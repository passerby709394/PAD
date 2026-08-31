/**
 * dsh-write-touch — DSH 宿主插件（Cordis）。
 *
 * 背景见 docs/DSH插件-文件写入优化.md 第 5 节「方案 C」：
 *
 *   - DSH 的 write/edit 落盘走「原子替换」（先写临时文件，再 rename 覆盖目标），
 *     在 Windows 上触发的是 FILE_NOTIFY_CHANGE_FILE_NAME（改名/替换）事件；
 *   - GameCreator 编辑器监听的是 FILE_NOTIFY_CHANGE_LAST_WRITE（原地写内容）事件，
 *     因此对原子替换无感，不会自动重编译。
 *
 * 本插件采用文档里的「C2 写后 touch」路线：保留原子替换（崩溃安全不变），
 * 在 write/edit 成功落盘之后，对目标文件做一次**字节级原地重写**
 * （内容不变），补发 LAST_WRITE 事件。这样既不重写 DSH 的写路径、
 * 不破坏沙箱围栏与版本守卫，又能让监听 LAST_WRITE 的编辑器感知改动。
 *
 * 挂载点：`ctx.fs`（@deepseek-ai/dsh-fs 服务）。工具层每次写/改都是动态调用
 * `ctx.fs.writeText(...)` / `ctx.fs.editText(...)`，因此包装实例方法即可生效，
 * 且后端无论挂的是 dsh-fs-local 还是 dsh-fs-sandbox 都成立。
 *
 * 插件只导出 `name` 与 `apply`（与 dshmarket 等宿主插件一致），不 import 任何
 * @deepseek-ai 包，依赖为零；`fs` 服务通过 `ctx.inject(['fs'], …)` 按需获取。
 */
import { open, readFile } from "node:fs/promises";

/** Cordis 插件 id（与 cordis.patch.yml 里的 `id` 一致）。 */
export const name = "write-touch";

/**
 * 配置字段（由 loader 从 profile 的 patch 层注入，这里做默认值收敛）：
 *
 * - enabled:    是否启用，默认 true。
 * - extensions: 命中这些后缀的文件才在写后 touch；空数组 = 所有文件。
 *               默认 [".ts"]（GameCreator 源码场景）。
 */
export function apply(ctx, config) {
  const resolved = {
    enabled: config?.enabled ?? true,
    extensions: normalizeExtensions(config?.extensions ?? [".ts"]),
    touchDelayMs: Number.isFinite(config?.touchDelayMs) ? Math.max(0, config.touchDelayMs) : 300
  };
  if (!resolved.enabled) return;

  // 只有宿主真的挂载了 fs 服务时才包装；否则本插件静默不起作用。
  ctx.inject(["fs"], (fsCtx) => wrapFs(fsCtx, resolved));
}

function wrapFs(ctx, resolved) {
  const fs = ctx.fs;

  // HMR / 重复装载保护：同一 fs 实例只包装一次。
  const WRAPPED = Symbol.for("dsh-write-touch.wrapped");
  if (fs[WRAPPED]) return;
  fs[WRAPPED] = true;

  const originalWriteText = fs.writeText.bind(fs);
  const originalEditText = fs.editText.bind(fs);

  /**
   * 写/改成功后补发 LAST_WRITE，并把被 touch 改动的版本号回填到返回值，
   * 保证 fs-observation-policy 记录的是 touch 之后的最新版本——否则连续
   * 对同一文件「写两次不重读」会被误判为 stale（FS_STALE_VERSION）。
   */
  async function touchAndFixVersion(target, outcome) {
    const display = String(target?.displayPath ?? target?.targetKey ?? "");
    if (!display || !shouldTouch(display, resolved.extensions)) return;
    try {
      // 重新 resolve：与沙箱后端的 checkedTarget 同一口径（realpath 后的 target）。
      const fresh = await fs.resolve(display);
      const path = String(fresh?.targetKey ?? fresh?.displayPath ?? "");
      if (!path) return;
      // 原子替换会先产生 FILE_NAME（rename/create）事件，编辑器据此可能重置/关闭该文件的
      // 监听；紧接着发的 LAST_WRITE（原地重写）容易被这次事件风暴吞掉。这里先等一拍，
      // 让编辑器消化完 rename/create，再补发 LAST_WRITE，编辑器才能稳定感知改动。
      if (resolved.touchDelayMs > 0) await sleep(resolved.touchDelayMs);
      await rewriteInPlace(path);
      const info = await fs.stat(fresh, void 0);
      if (info && outcome) outcome.version = info.version;
    } catch {
      // 尽力而为：touch 失败不影响已成功的写入本身。
    }
  }

  fs.writeText = async function writeText(target, content, expected, signal, policy) {
    const outcome = await originalWriteText(target, content, expected, signal, policy);
    await touchAndFixVersion(target, outcome);
    return outcome;
  };

  fs.editText = async function editText(target, edit, expected, signal, policy) {
    const outcome = await originalEditText(target, edit, expected, signal, policy);
    await touchAndFixVersion(target, outcome);
    return outcome;
  };
}

/** 规范化扩展名列表：统一为小写、带点、非空。 */
function normalizeExtensions(list) {
  if (!Array.isArray(list)) return [];
  const seen = new Set();
  const out = [];
  for (const raw of list) {
    const s = String(raw).trim().toLowerCase();
    if (s === "") continue;
    const ext = s.startsWith(".") ? s : `.${s}`;
    if (seen.has(ext)) continue;
    seen.add(ext);
    out.push(ext);
  }
  return out;
}

/** 等待指定毫秒数（用于把 LAST_WRITE 与原子替换的 FILE_NAME 事件错开）。 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** 目标路径是否命中扩展名过滤（extensions 为空 = 全部命中）。 */
function shouldTouch(path, extensions) {
  if (extensions.length === 0) return true;
  const p = path.toLowerCase();
  return extensions.some((ext) => p.endsWith(ext));
}

/**
 * 字节级原地重写（内容不变）：读回当前字节，再用 r+ 句柄原样写回。
 *
 * 关键点：
 * - 用 `open(path, "r+")` 而非 `writeFile(path, buf)`（后者先截断再写，若中途崩溃
 *   会留下半空文件）；r+ 原样写回相同字节，即使写入被中断，文件内容也始终一致。
 * - WriteFile 写 ≥1 字节即更新「最后写入时间」，从而触发
 *   ReadDirectoryChangesW 的 FILE_NOTIFY_CHANGE_LAST_WRITE；这正是编辑器监听的
 *   那一类事件（区别于原子替换触发的 FILE_NOTIFY_CHANGE_FILE_NAME）。
 * - 空文件无字节可写回，直接跳过（空文件本就没有可重编译内容）。
 */
async function rewriteInPlace(path) {
  const buf = await readFile(path);
  if (buf.length === 0) return;
  const handle = await open(path, "r+");
  try {
    await handle.write(buf, 0, buf.length, 0);
    await handle.sync();
  } finally {
    await handle.close();
  }
}
