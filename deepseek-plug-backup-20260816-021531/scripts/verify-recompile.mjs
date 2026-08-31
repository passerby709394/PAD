#!/usr/bin/env node
/**
 * 验证 docs/DSH插件-文件写入优化.md §5.4 的关键假设：
 *
 *   在「游戏预览运行中」状态下，对 .ts 源文件做一次字节级原地重写（内容不变，
 *   触发 FILE_NOTIFY_CHANGE_LAST_WRITE），能否让 GameCreator 自动重编译对应的
 *   分文件产物 out/game/project/**\/*.js？
 *
 * 用法：
 *   node scripts/verify-recompile.mjs [源.ts] [产物.js] [等待秒] [--port 预览端口]
 *
 * 默认值面向 PAD 项目：
 *   源:     C:/PAD/PAD/Game/game/project/PAD/PADPuzzle.ts
 *   产物:   C:/PAD/PAD/out/game/project/PAD/PADPuzzle.js
 *   等待:   60 秒
 *   端口:   2615（GameCreator 编辑器窗口标题里的 port）
 *
 * 脚本不会修改源文件内容（只做原地重写相同字节），产物是否重编译以
 * 其 mtime/size 是否变化为准。
 */
import { readFile, open, stat } from "node:fs/promises";
import { createServer } from "node:net";
import { resolve } from "node:path";

const ARGS = process.argv.slice(2);

function parseArgs() {
  const positional = [];
  let port = 2615;
  for (let i = 0; i < ARGS.length; i++) {
    const a = ARGS[i];
    if (a === "--port") {
      port = Number(ARGS[++i] ?? 2615);
    } else if (a === "--help" || a === "-h") {
      usage();
      process.exit(0);
    } else {
      positional.push(a);
    }
  }
  const src = resolve(positional[0] ?? "C:/PAD/PAD/Game/game/project/PAD/PADPuzzle.ts");
  const out = resolve(positional[1] ?? "C:/PAD/PAD/out/game/project/PAD/PADPuzzle.js");
  const waitSec = Math.max(1, Number(positional[2] ?? 60) || 60);
  return { src, out, waitSec, port };
}

function usage() {
  console.log("用法: node scripts/verify-recompile.mjs [源.ts] [产物.js] [等待秒] [--port 预览端口]");
}

function ts() {
  return new Date().toLocaleTimeString("zh-CN", { hour12: false });
}

/** 原地重写相同字节，触发 LAST_WRITE（与插件 lib/index.js 的 rewriteInPlace 一致）。 */
async function rewriteInPlace(path) {
  const buf = await readFile(path);
  if (buf.length === 0) return 0;
  const handle = await open(path, "r+");
  try {
    await handle.write(buf, 0, buf.length, 0);
    await handle.sync();
  } finally {
    await handle.close();
  }
  return buf.length;
}

/** 探测本地端口是否在监听（用于提示「预览是否在运行」）。 */
function portListening(port) {
  return new Promise((resolvePort) => {
    const srv = createServer();
    let settled = false;
    const done = (v) => {
      if (settled) return;
      settled = true;
      resolvePort(v);
    };
    // 端口被占用 → 有东西在监听（listen 报错，handle 已自动释放，无需 close）
    srv.once("error", () => done(true));
    // 能监听 → 端口空闲；close 后释放端口再返回
    srv.once("listening", () => srv.close(() => done(false)));
    srv.listen(port, "127.0.0.1");
  });
}

async function main() {
  const { src, out, waitSec, port } = parseArgs();

  console.log(`[${ts()}] 源文件 : ${src}`);
  console.log(`[${ts()}] 产物   : ${out}`);

  let srcInfo, outInfo;
  try {
    srcInfo = await stat(src);
  } catch (e) {
    console.error(`✗ 源文件不存在或不可读: ${e.message}`);
    process.exit(2);
  }
  try {
    outInfo = await stat(out);
  } catch (e) {
    console.error(`✗ 产物文件不存在（先确认编辑器已编译过该项目）: ${e.message}`);
    process.exit(2);
  }

  const outBefore = { mtimeMs: outInfo.mtimeMs, size: outInfo.size };

  const listening = await portListening(port);
  if (!listening) {
    console.warn(`[${ts()}] ⚠ 端口 ${port} 未监听 —— 游戏预览很可能没在运行。`);
    console.warn(`[${ts()}]   按 §5.4，非预览状态下原地重写已被确认不会触发重编译，本次结果可能为「未重编译」（不具结论性）。`);
    console.warn(`[${ts()}]   请先在 GameCreator 里运行游戏预览，再重跑本脚本。`);
  } else {
    console.log(`[${ts()}] ✓ 端口 ${port} 在监听，预览疑似运行中。`);
  }

  const bytes = await rewriteInPlace(src);
  console.log(`[${ts()}] 已对源文件做原地重写（${bytes} 字节，内容不变），开始观察产物 ${waitSec}s …`);

  const deadline = Date.now() + waitSec * 1000;
  let recompiled = false;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 500));
    try {
      const cur = await stat(out);
      if (cur.mtimeMs !== outBefore.mtimeMs || cur.size !== outBefore.size) {
        console.log(`[${ts()}] ✓ 产物已变化（mtime/size 不同）→ 原地写触发了重编译。`);
        recompiled = true;
        break;
      }
    } catch {
      // 产物可能被编辑器暂时删除/重建，忽略本次轮询
    }
  }

  if (!recompiled) {
    console.log(`[${ts()}] ✗ ${waitSec}s 内产物未变化。`);
    if (!listening) {
      console.log(`[${ts()}]   结论：不具结论性 —— 请先运行预览再重跑。`);
    } else {
      console.log(`[${ts()}]   结论：预览运行中仍未重编译 → 编辑器不监听外部 LAST_WRITE，`);
      console.log(`[${ts()}]   需要走「主动通知编辑器重编译」路线（§5.4 第二种可能）。`);
    }
    process.exit(1);
  }
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
