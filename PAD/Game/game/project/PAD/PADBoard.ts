/**
 * PAD 消除棋盘（数据模型 + 动画调度）
 * 移植自 mugen_pazdora 的 $a.Board（docs/js/src/index.js）
 * 职责：
 *  -- 棋盘数据模型（行列数可配置，默认 6×5，不硬编码）
 *  -- 元素管理（生成/交换/移除/下落）
 *  -- 初始盘面保证无三连
 *  -- 连锁消除调度（匹配→淡出→移除→下落→再匹配）
 * 渲染：元素 view 挂载在 boardView 容器中，由本类创建
 */

/**
 * 棋盘配置（全部可选，覆盖默认值；默认值见 PADBoard.DEFAULT_*）
 */
interface PADBoardOptions {
    /** 列数，默认 6 */
    cols?: number;
    /** 行数，默认 5 */
    rows?: number;
    /** 元素渲染宽度，默认 100 */
    elementWidth?: number;
    /** 元素渲染高度，默认 100 */
    elementHeight?: number;
    /** 格子间距，默认 8 */
    gap?: number;
    /** 下落动画时长（ms），默认 200 */
    fallDuration?: number;
    /** 消除淡出时长（ms），默认 200 */
    fadeDuration?: number;
    /** combo 结算间隔（ms），默认 100 */
    comboInterval?: number;
}

/**
 * 一次下落移动：from → to
 * from 为 null 表示该位置生成新元素
 */
interface PADMove {
    from: number[];
    to: number[];
}

class PADBoard {
    // ===== 默认配置（可在调用前修改，便于后续指令配置） =====
    static DEFAULT_COLS: number = 6;
    static DEFAULT_ROWS: number = 5;
    static DEFAULT_ELEMENT_WIDTH: number = 100;
    static DEFAULT_ELEMENT_HEIGHT: number = 100;
    static DEFAULT_GAP: number = 8;
    static DEFAULT_FALL_DURATION: number = 200;
    static DEFAULT_FADE_DURATION: number = 200;
    static DEFAULT_COMBO_INTERVAL: number = 100;

    // ===== 实例配置 =====
    cols: number;
    rows: number;
    elementWidth: number;
    elementHeight: number;
    gap: number;
    fallDuration: number;
    fadeDuration: number;
    comboInterval: number;

    /**
     * 棋盘数据 [row][col]，空位为 null
     */
    squares: PADElement[][];
    /**
     * 棋盘容器（元素 view 挂载于此，由本类创建）
     */
    boardView: UIRoot;
    /**
     * 最近一次连锁结算累计产生的全部 combo
     */
    lastComboResults: PADCombo[];
    /**
     * 是否正在结算连锁消除（防重入）
     */
    isComboRunning: boolean;
    /**
     * 元素 view 创建完成回调（参数为 PADElement），供上层绑定交互等
     */
    onViewCreated: Function;
    /**
     * 移除动画（1007）全部实例（含播放中，界面结束时统一释放）
     */
    private _removeAnis: GCAnimation[] = [];
    /**
     * 移除动画（1007）空闲实例池（播放完成后归还复用，避免反复创建/销毁）
     */
    private _removeAniIdle: GCAnimation[] = [];

    constructor(options?: PADBoardOptions) {
        this.cols = options && options.cols !== undefined ? options.cols : PADBoard.DEFAULT_COLS;
        this.rows = options && options.rows !== undefined ? options.rows : PADBoard.DEFAULT_ROWS;
        this.elementWidth = options && options.elementWidth !== undefined ? options.elementWidth : PADBoard.DEFAULT_ELEMENT_WIDTH;
        this.elementHeight = options && options.elementHeight !== undefined ? options.elementHeight : PADBoard.DEFAULT_ELEMENT_HEIGHT;
        this.gap = options && options.gap !== undefined ? options.gap : PADBoard.DEFAULT_GAP;
        this.fallDuration = options && options.fallDuration !== undefined ? options.fallDuration : PADBoard.DEFAULT_FALL_DURATION;
        this.fadeDuration = options && options.fadeDuration !== undefined ? options.fadeDuration : PADBoard.DEFAULT_FADE_DURATION;
        this.comboInterval = options && options.comboInterval !== undefined ? options.comboInterval : PADBoard.DEFAULT_COMBO_INTERVAL;
        this.squares = [];
        this.lastComboResults = [];
        this.isComboRunning = false;
        this.boardView = new UIRoot();
    }

    /**
     * 预热移除动画：游戏开始时加载并缓存 1007 动画实例（后续消除直接复用，不反复创建/销毁）
     * 同时兜底预加载 1007 资源，确保首次消除即可播放
     */
    preloadRemoveAni(): void {
        AssetManager.preLoadAnimationAsset(1007);
        this._recycleRemoveAni(this._createRemoveAni());
    }

    /**
     * 释放全部移除动画实例（含播放中；界面结束时调用）
     */
    releaseRemoveAnis(): void {
        for (let i = 0; i < this._removeAnis.length; i++) {
            this._removeAnis[i].dispose();
        }
        this._removeAnis = [];
        this._removeAniIdle = [];
    }

    /**
     * 初始化盘面：随机生成元素并保证无初始三连（无动画）
     */
    initBoard(): void {
        this.clearBoard();
        for (let r = 0; r < this.rows; r++) {
            this.squares[r] = [];
            for (let c = 0; c < this.cols; c++) {
                let el = new PADElement(PADElement.randomType(), r, c);
                this.squares[r][c] = el;
                this.createElementView(el);
            }
        }
        // 去除初始三连（与 _resetBalls 同步逻辑）
        let matcher = new PADMatcher();
        while (true) {
            let combos = matcher.match(this.squares, this.rows, this.cols);
            if (combos.length === 0) break;
            let matched = matcher.getMatchedIndexes();
            for (let i = 0; i < matched.length; i++) {
                this.removeElement(matched[i][0], matched[i][1]);
            }
            this.fallElements();
        }
        this.syncViews();
    }

    /**
     * 清空盘面并释放全部元素 view
     */
    clearBoard(): void {
        for (let r = 0; r < this.rows; r++) {
            if (!this.squares[r]) continue;
            for (let c = 0; c < this.cols; c++) {
                let el = this.squares[r][c];
                if (el) el.disposeView();
            }
        }
        this.squares = [];
    }

    /**
     * 获取指定格元素（越界返回 null）
     */
    getElement(row: number, col: number): PADElement {
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) return null;
        return this.squares[row][col];
    }

    /**
     * 交换两个格子的元素（数据 + view 位置立即更新）
     * @param a 坐标 [row, col]
     * @param b 坐标 [row, col]
     */
    exchangeElements(a: number[], b: number[]): void {
        let elA = this.squares[a[0]][a[1]];
        let elB = this.squares[b[0]][b[1]];
        if (!elA || !elB) return;
        // 播放交换音效
        if (PADElement.swapSE) {            
            GameAudio.playSE(PADElement.swapSE,1)         
        }
        this.squares[a[0]][a[1]] = elB;
        this.squares[b[0]][b[1]] = elA;
        elA.setIndex(b[0], b[1]);
        elB.setIndex(a[0], a[1]);
        this.updateElementViewPos(elA);
        this.updateElementViewPos(elB);
    }

    /**
     * 移除指定格元素（数据置空 + 释放 view）
     */
    removeElement(row: number, col: number): void {
        let el = this.squares[row][col];
        if (el === null || el === undefined) return;
        el.isRemoved = true;
        this.squares[row][col] = null;
        if (el.view) {
            el.view.dispose();
            el.view = null;
        }
    }

    /**
     * 计算下落：每列从下往上补位，上方的元素下移，空位生成新元素
     * 注意：仅更新数据与元素行列号，不更新 view 位置（动画由 _runFallingBalls 执行）
     * @return 移动序列 [{from, to}]，from 为 null 表示新元素
     */
    fallElements(): PADMove[] {
        let movements: PADMove[] = [];
        for (let columnIndex = 0; columnIndex < this.cols; columnIndex++) {
            for (let rowIndex = this.rows - 1; rowIndex >= 0; rowIndex--) {
                let r = this.__fallHere([rowIndex, columnIndex]);
                if (r !== null) movements.push(r);
            }
        }
        return movements;
    }

    /**
     * 让盘面全部元素的 view 与数据位置同步（无动画，用于初始化/无动画流程）
     */
    syncViews(): void {
        for (let r = 0; r < this.rows; r++) {
            if (!this.squares[r]) continue;
            for (let c = 0; c < this.cols; c++) {
                let el = this.squares[r][c];
                if (!el) continue;
                if (!el.view) {
                    this.createElementView(el);
                } else {
                    let pos = this.cellToPos(r, c);
                    el.view.x = pos.x;
                    el.view.y = pos.y;
                }
            }
        }
    }

    /**
     * 格子坐标 → 棋盘容器内位置
     */
    cellToPos(row: number, col: number): any {
        return { x: col * (this.elementWidth + this.gap), y: row * (this.elementHeight + this.gap) };
    }

    /**
     * 棋盘容器内坐标 → 格子坐标 [row, col]
     * 落在格子间隙或棋盘外返回 null；顶部越界仅最近一行视为第 0 行（原版行为），更远越界返回 null
     */
    pointToCell(localX: number, localY: number): number[] {
        let stepX = this.elementWidth + this.gap;
        let stepY = this.elementHeight + this.gap;
        let col = Math.floor(localX / stepX);
        let row = Math.floor(localY / stepY);
        // 顶部越界：仅最近一行（row === -1）视为第 0 行，更远越界不判定
        if (row < -1) return null;
        if (row < 0) row = 0;
        if (col < 0 || col >= this.cols || row >= this.rows) return null;
        // 落在格子间隙内不判定
        let inX = localX - col * stepX;
        let inY = localY - row * stepY;
        if (inX > this.elementWidth || inY > this.elementHeight) return null;
        return [row, col];
    }

    /**
     * 棋盘总宽度
     */
    getWidth(): number {
        return this.cols * this.elementWidth + (this.cols - 1) * this.gap;
    }

    /**
     * 棋盘总高度
     */
    getHeight(): number {
        return this.rows * this.elementHeight + (this.rows - 1) * this.gap;
    }

    /**
     * 连锁消除：匹配 → 逐个 combo 淡出 → 移除 → 下落 → 再匹配，直至无新消除
     * @param onCombo 每个 combo 淡出完成后回调（用于计分/统计），参数为 PADCombo
     * @param onComplete 全部连锁结算完成回调
     */
    runChainedCombo(onCombo: Function, onComplete: Function): void {
        if (this.isComboRunning) return; // 防重入
        this.isComboRunning = true;
        this.lastComboResults = [];
        let preComboCount = 0;
        let self = this;
        function __runCombo() {
            self._runComboOnce(onCombo, function () {
                if (self.lastComboResults.length > preComboCount) {
                    preComboCount = self.lastComboResults.length;
                    setTimeout(__runCombo, 1);
                } else {
                    self.isComboRunning = false;
                    if (onComplete) onComplete();
                }
            });
        }
        setTimeout(__runCombo, 1);
    }

    // ===== 内部方法 =====

    /**
     * 创建元素 view 并挂载到棋盘容器（统一入口，创建后触发 onViewCreated 回调）
     */
    private _createView(el: PADElement, x: number, y: number): void {
        el.createView(this.boardView, this.elementWidth, this.elementHeight, x, y);
        if (this.onViewCreated) {
            this.onViewCreated(el);
        }
    }

    /**
     * 创建元素 view 并挂载到棋盘容器
     */
    private createElementView(el: PADElement): void {
        let pos = this.cellToPos(el.row, el.col);
        this._createView(el, pos.x, pos.y);
    }

    /**
     * 将元素 view 更新到其数据位置
     */
    private updateElementViewPos(el: PADElement): void {
        if (!el.view) return;
        let pos = this.cellToPos(el.row, el.col);
        el.view.x = pos.x;
        el.view.y = pos.y;
    }

    /**
     * 单次消除（内部）：匹配 → 淡出 → 移除 → 下落
     */
    private _runComboOnce(onCombo: Function, onComplete: Function): void {
        let matcher = new PADMatcher();
        let combos = matcher.match(this.squares, this.rows, this.cols);
        this.lastComboResults = this.lastComboResults.concat(combos);
        if (combos.length === 0) {
            onComplete();
            return;
        }
        let self = this;
        this._disappearCombos(combos, 0, onCombo, function () {
            // 移除被消除的元素
            let matched = matcher.getMatchedIndexes();
            for (let i = 0; i < matched.length; i++) {
                self.removeElement(matched[i][0], matched[i][1]);
            }
            // 计算下落（数据）
            let movements = self.fallElements();
            // 下落动画
            self._runFallingBalls(movements, onComplete);
        });
    }

    /**
     * 创建一个移除动画实例（加载 1007）
     */
    private _createRemoveAni(): GCAnimation {
        let ani = new GCAnimation();
        ani.id = 1007;
        this._removeAnis.push(ani);
        return ani;
    }

    /**
     * 获取一个空闲的移除动画实例（池空则新建）
     */
    private _getRemoveAni(): GCAnimation {
        if (this._removeAniIdle.length > 0) {
            return this._removeAniIdle.pop();
        }
        return this._createRemoveAni();
    }

    /**
     * 归还移除动画实例（复用，不销毁）
     */
    private _recycleRemoveAni(ani: GCAnimation): void {
        this._removeAniIdle.push(ani);
    }

    /**
     * 串行处理每个 combo 的移除动画（combo 内并行，combo 之间按结算间隔）
     * 每个被消除的元素播放动画 1007（缩小至消失），播放完成后释放元素 view 与锚点容器
     */
    private _disappearCombos(combos: PADCombo[], index: number, onCombo: Function, onComplete: Function): void {
        if (index >= combos.length) {
            onComplete();
            return;
        }
        let combo = combos[index];
        let pending = combo.indexes.length;
        let self = this;
        function __afterAll() {
            if (onCombo) onCombo(combo);
            // 原版 combo 结算间隔 0.1s
            setTimeout(function () {
                self._disappearCombos(combos, index + 1, onCombo, onComplete);
            }, self.comboInterval);
        }
        if (pending === 0) {
            __afterAll();
            return;
        }
        for (let i = 0; i < combo.indexes.length; i++) {
            let idx = combo.indexes[i];
            let el = this.squares[idx[0]][idx[1]];
            if (el && el.view) {
                // 锚点容器：动画 target 会把目标 x/y/alpha/scale 重置为默认值（引擎 resetTargetEffect），
                // 故先把元素移入定位在格子位置的容器内 (0,0)，动画播放时元素位置保持不变
                let wrapper = new UIRoot();
                let pos = this.cellToPos(idx[0], idx[1]);
                wrapper.x = pos.x;
                wrapper.y = pos.y;
                this.boardView.addChild(wrapper);
                wrapper.addChild(el.view);
                el.view.x = 0;
                el.view.y = 0;
                // 播放移除动画 1007（元素缩小至消失）
                // 复用缓存实例：gotoAndPlay(1) 从第 1 帧重播（直接 play 会从上一帧继续，导致立即播完）
                let ani = this._getRemoveAni();
                ani.target = el.view;
                ani.once(GCAnimation.PLAY_COMPLETED, this, function () {
                    // 先释放元素 view 再解除动画目标：动画释放会把 target 属性重置为默认值，
                    // 提前释放可避免元素在数据移除前闪现回原大小
                    if (el.view) {
                        el.view.dispose();
                        el.view = null;
                    }
                    wrapper.dispose();
                    // 解除目标绑定后归还动画实例复用（不销毁）
                    ani.target = null;
                    self._recycleRemoveAni(ani);
                    pending--;
                    if (pending === 0) __afterAll();
                });
                ani.gotoAndPlay(1);
            } else {
                pending--;
                if (pending === 0) __afterAll();
            }
        }
    }

    /**
     * 下落动画：按目标行分组（自下而上串行，组内并行）
     */
    private _runFallingBalls(movements: PADMove[], onComplete: Function): void {
        // 按目标行分组
        let groups: PADMove[][] = [];
        for (let r = this.rows - 1; r >= 0; r--) {
            let group: PADMove[] = [];
            for (let i = 0; i < movements.length; i++) {
                if (movements[i].to[0] === r) group.push(movements[i]);
            }
            groups.push(group);
        }
        this._runFallRowGroups(groups, 0, onComplete);
    }

    /**
     * 串行执行各行下落（组内并行）
     */
    private _runFallRowGroups(groups: PADMove[][], index: number, onComplete: Function): void {
        if (index >= groups.length) {
            onComplete();
            return;
        }
        let group = groups[index];
        if (group.length === 0) {
            this._runFallRowGroups(groups, index + 1, onComplete);
            return;
        }
        let pending = group.length;
        let self = this;
        for (let i = 0; i < group.length; i++) {
            let movement = group[i];
            let fromIdx = movement.from;
            let toIdx = movement.to;
            let el = this.squares[toIdx[0]][toIdx[1]];
            let toPos = this.cellToPos(toIdx[0], toIdx[1]);
            // 起点：移动元素从原格，新元素从上方 -1 行
            let fromPos = fromIdx !== null ? this.cellToPos(fromIdx[0], fromIdx[1]) : this.cellToPos(-1, toIdx[1]);
            if (!el.view) {
                this._createView(el, fromPos.x, fromPos.y);
            } else {
                el.view.x = fromPos.x;
                el.view.y = fromPos.y;
            }
            Tween.to(el.view, { x: toPos.x, y: toPos.y }, this.fallDuration, Ease.linearNone, Callback.New(function () {
                pending--;
                if (pending === 0) {
                    self._runFallRowGroups(groups, index + 1, onComplete);
                }
            }, this));
        }
    }

    /**
     * 处理单格下落（内部）：返回移动数据，无移动则返回 null
     */
    private __fallHere(idx: number[]): PADMove {
        if (this.squares[idx[0]][idx[1]] !== null) return null;
        let result: PADMove = null;
        // 从距 idx 最近的上方非空格开始寻找（自下而上）
        for (let r = idx[0] - 1; r >= 0; r--) {
            let upperEl = this.squares[r][idx[1]];
            if (upperEl !== null) {
                // 数据移动
                this.squares[r][idx[1]] = null;
                this.squares[idx[0]][idx[1]] = upperEl;
                upperEl.setIndex(idx[0], idx[1]);
                result = { from: [r, idx[1]], to: idx };
                break;
            }
        }
        if (result === null) {
            // 上方无元素，生成新元素
            let el = new PADElement(PADElement.randomType(), idx[0], idx[1]);
            this.squares[idx[0]][idx[1]] = el;
            result = { from: null, to: idx };
        }
        return result;
    }
}
