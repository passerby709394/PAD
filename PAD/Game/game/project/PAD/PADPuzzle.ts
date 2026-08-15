/**
 * PAD 消除玩法主控制器（独立界面）
 * 功能：
 *  -- 创建 root 容器并装配：棋盘、计分面板、倒计时
 *  -- 拖拽交互（MOUSE_DOWN/MOVE/UP，跨格交换）
 *  -- 限时回合：倒计时结束强制结算
 *  -- 计分统计（maxCombo/totalCombo/totalBall/各属性消除数）与结果输出
 * 入口：start() 显示界面，dispose() 结束；结果存于 PADPuzzle.lastResult 供后续指令读取
 */

/**
 * 消除玩法配置
 */
interface PADPuzzleOptions {
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
    /** 回合时长（ms），默认 PADPuzzle.DEFAULT_ROUND_TIME */
    roundTime?: number;
    /** root 容器在 uiLayer 中的 x，默认 PADPuzzle.DEFAULT_ROOT_X */
    rootX?: number;
    /** root 容器在 uiLayer 中的 y，默认 PADPuzzle.DEFAULT_ROOT_Y */
    rootY?: number;
    /** 棋盘在 root 中的 x，默认 PADPuzzle.DEFAULT_BOARD_X */
    boardX?: number;
    /** 棋盘在 root 中的 y，默认 PADPuzzle.DEFAULT_BOARD_Y */
    boardY?: number;
    /** 背景图路径（可选） */
    background?: string;
}

/**
 * 一次消除回合的结算结果
 */
interface PADPuzzleResult {
    /** 最大连锁数（一次连锁结算触发的总 combo 数上限） */
    maxComboCount: number;
    /** 最近一次消除的 combo 数（一次交换触发的一轮连锁的 combo 总数） */
    lastComboCount: number;
    /** 消除的珠子总数 */
    totalBallCount: number;
    /** 各属性消除数（累计），如 { fire: 6, heal: 3 } */
    byType: any;
    /** 最近一次消除的各属性数量，如 { fire: 3, water: 2 } */
    lastByType: any;
    /** 最近一次消除的十字数量（5 个同色元素构成十字） */
    lastCrossCount: number;
    /** 最近一次消除的整行数量（一行全部同色） */
    lastFullRowCount: number;
    /** 最近一次消除的整列数量（一列全部同色） */
    lastFullLineCount: number;
}

class PADPuzzle {
    // ===== 默认配置 =====
    static DEFAULT_ROUND_TIME: number = 30000;
    static DEFAULT_ROOT_X: number = 300;
    static DEFAULT_ROOT_Y: number = 100;
    static DEFAULT_BOARD_X: number = 20;
    static DEFAULT_BOARD_Y: number = 60;
    /** 计分面板左侧距棋盘左边的间距 */
    static SCORE_PADDING: number = -300;

    /**
     * 背景图路径（可选，供指令设置；不设置则不显示背景）
     */
    static bgImage: string = "";

    /**
     * 最近一次结算结果（供后续自定义指令读取，参考 QYTetris.fenShu 的模式）
     */
    static lastResult: PADPuzzleResult = null;

    /**
     * 交换音效是否已预热（首次按下珠子时静音播放一次，提前解锁 AudioContext）
     */
    static _swapSEWarmed: boolean = false;

    /**
     * 棋盘
     */
    board: PADBoard;
    /**
     * root 容器（已被 addChild 到 Game.layer.uiLayer）
     */
    root: UIRoot;

    // 配置
    private _boardX: number;
    private _boardY: number;
    private _roundTime: number;
    // UI 组件
    /**
     * 计分文本组件
     */
    static scoreText: UIString;
    private _timerSlider: UISlider;
    private _timerText: UIString;
    /**
     * combo 数字文本（参考 GUI4001 的 comboText）
     */
    private _comboText: UIString;
    /**
     * combo 数字文本的显示位置（相对 root；动画播放期间 target 坐标会被动画接管为 0，故独立保存）
     */
    private _comboTextX: number;
    private _comboTextY: number;
    /**
     * combo 数字动画（播放 1006，串行：播放完再播下一个）
     */
    private _comboAni: GCAnimation;
    private _pendingComboAni: boolean;
    /**
     * combo 图片组件（参考 GUI4001 的 comboImage，comboRootView 内 (0,0) 子节点）
     */
    private _comboImage: UIBitmap;
    /**
     * combo 图片动画（播放 1008，串行：播放完再播下一个）
     */
    private _comboImageAni: GCAnimation;
    private _pendingComboImageAni: boolean;
    // 计时状态
    private _remainTime: number;
    private _timerInterval: number;
    private _timeUp: boolean;
    // 拖拽状态
    private _dragging: PADElement;
    private _dragOffsetX: number;
    private _dragOffsetY: number;
    // 状态
    private _isBusy: boolean;
    private _isFinished: boolean;
    // 统计
    private _maxComboCount: number;
    private _lastComboCount: number;
    private _totalBallCount: number;
    private _byType: any;
    private _lastByType: any;
    private _lastCrossCount: number;
    private _lastFullRowCount: number;
    private _lastFullLineCount: number;
    // 回调
    private _onResult: Function;
    

    /**
     * @param options 玩法配置（可选，覆盖默认值）
     */
    constructor(options?: PADPuzzleOptions) {
        this._boardX = options && options.boardX !== undefined ? options.boardX : PADPuzzle.DEFAULT_BOARD_X;
        this._boardY = options && options.boardY !== undefined ? options.boardY : PADPuzzle.DEFAULT_BOARD_Y;
        this._roundTime = options && options.roundTime !== undefined ? options.roundTime : PADPuzzle.DEFAULT_ROUND_TIME;
        this._isBusy = false;
        this._isFinished = false;
        this._timeUp = false;
        this._dragging = null;
        this._maxComboCount = 0;
        this._lastComboCount = 0;
        this._totalBallCount = 0;
        this._byType = {};
        // 预置各属性计数为 0
        for (let i = 0; i < PADElement.TYPES.length; i++) {
            this._byType[PADElement.TYPES[i]] = 0;
        }
        this._lastByType = {};
        this._lastCrossCount = 0;
        this._lastFullRowCount = 0;
        this._lastFullLineCount = 0;
        this.board = new PADBoard(options);
        // 元素 view 创建时绑定拖拽事件
        this.board.onViewCreated = (el: PADElement) => { this._bindElement(el); };
    }

    /**
     * 开始消除玩法：创建界面并显示
     * @param onResult 初始化完成回调，参数为当前 PADPuzzle 实例
     */
    start(onResult?: Function): void {
        if (this._isFinished) return;
        this._onResult = onResult;
       
        // root 容器
        this.root = new UIRoot();
        // 棋盘初始化（创建元素与 view）
        this.board.initBoard();
        // 预热移除动画 1007（缓存动画实例，消除时直接复用）
        this.board.preloadRemoveAni();
        // 布局：与 GUI4001 相同——root 用 elementBG 的位置与宽高，
        // 第 0 行第 0 列 Element 的位置 = element1bg 在 elementBG 中的位置
        GameUI.load(4001)
        let ui4001: GUI_4001 = GameUI.get(4001) as GUI_4001;
        let boardW = this.board.getWidth();
        let boardH = this.board.getHeight();
        let rootX: number = 0;
        let rootY: number = 0;
        let rootW = boardW + this._boardX * 2;
        let rootH = this._boardY + boardH + 80; // 下方预留计分面板
        let boardViewX = this._boardX;
        let boardViewY = this._boardY;
        let bgImage: string = "";
        /** 棋盘右侧留白（相对 elementBG 右侧），由 ui4001 原始布局反推 */
        let rightPadding: number = this._boardX;
        if (ui4001 && ui4001.elementBG) {
            rootX = ui4001.elementBG.x;
            rootY = ui4001.elementBG.y;
            bgImage = ui4001.elementBG.image;
            // 0 行 0 列 Element 位置 = element1bg 相对 elementBG 的位置
            if (ui4001.element1bg) {
                boardViewX = ui4001.element1bg.x;
                boardViewY = ui4001.element1bg.y;
            }
            // 由 ui4001 原始布局反推右侧留白：
            // rightPadding = elementBG.width - element1bg.x - 默认列数的棋盘宽度
            let defaultBoardW = PADBoard.DEFAULT_COLS * this.board.elementWidth + (PADBoard.DEFAULT_COLS - 1) * this.board.gap;
            rightPadding = ui4001.elementBG.width - boardViewX - defaultBoardW;
        }
        // 根据 cols 动态计算 elementBG 宽度：左侧留白 + 棋盘宽度 + 右侧留白
        rootW = boardViewX + boardW + rightPadding;
        // 根据 rows 动态计算 elementBG 高度：顶部留白 + 棋盘高度 + 底部留白
        rootH = boardViewY + boardH + 20;
        // 宽度偏移量（相对 ui4001 原始 elementBG 宽度）：用于 UI 组件适配
        let originalRootW: number = (ui4001 && ui4001.elementBG) ? ui4001.elementBG.width : rootW;
        let extraW: number = rootW - originalRootW;
        this.root.x = rootX;
        this.root.y = rootY;
        this.root.width = rootW;
        this.root.height = rootH;
        // 背景：优先使用 elementBG.image，其次使用静态 bgImage
        let useBgImage = bgImage || PADPuzzle.bgImage;
        if (useBgImage) {
            let bg = new UIBitmap();
            bg.image = useBgImage;
            bg.width = rootW;
            bg.height = rootH;
            this.root.addChild(bg);
        }
        // 棋盘容器
        this.board.boardView.x = boardViewX;
        this.board.boardView.y = boardViewY;
        this.root.addChild(this.board.boardView);
        // 计分面板
        this._createScorePanel(boardW);
        // 倒计时
        this._createTimer(boardW, extraW);
        // combo 显示容器（参考 GUI4001 的 comboRoot）
        this._createComboRoot(extraW);
        // 显示
        Game.layer.uiLayer.addChild(this.root);
        // 倒计时由按下 Element 驱动（按住开始、松手暂停），启动时不开始计时

        // 初始化完成，触发回调
        if (this._onResult) this._onResult(this);
    }

    /**
     * 结束并释放界面（外部主动结束；结算结果仍会输出）
     */
    dispose(): void {
        if (this._isFinished) return;
        this._timeUp = true;
        this._finish();
    }

    /**
     * 是否已结束
     */
    isFinished(): boolean {
        return this._isFinished;
    }

    /**
     * 设置忙碌状态（true 禁止玩家输入，false 允许玩家操作）
     * 供战斗行动（攻击/治疗动画）全部完成后解除输入锁
     */
    setBusy(v: boolean): void {
        this._isBusy = v;
    }

    /**
     * 获取引擎 Web Audio 的 AudioContext（用于在用户手势内显式 resume，解锁浏览器自动播放）
     */
    private static _getWebAudioContext(): any {
        const w: any = window;
        const LayaNS: any = w && w.Laya;
        const WebAudioSound: any = LayaNS && (LayaNS.WebAudioSound ||
            (LayaNS.media && LayaNS.media.webaudio && LayaNS.media.webaudio.WebAudioSound));
        return WebAudioSound && WebAudioSound.ctx;
    }

    // ===== 拖拽交互 =====

    /**
     * 绑定元素拖拽开始事件
     */
    private _bindElement(el: PADElement): void {
        if (!el.view) return;
        let self = this;
        el.view.on(EventObject.MOUSE_DOWN, this, function (e: EventObject) {
            self._onElementDown(e, el);
        });
    }

    /**
     * 鼠标按下元素：开始拖拽
     */
    private _onElementDown(e: EventObject, el: PADElement): void {
        if (this._isBusy || this._timeUp || this._isFinished || PADBattle.battleStep!=1) return;
        // 预热音频：首次按下珠子时，在用户手势内显式恢复 AudioContext（浏览器自动播放策略），
        // 并静音播放一次 swapSE，避免之后拖拽交换首播无声/音量过小
        if (!PADPuzzle._swapSEWarmed) {
            PADPuzzle._swapSEWarmed = true;
            const ctx = PADPuzzle._getWebAudioContext();
            if (ctx && ctx.state === "suspended" && typeof ctx.resume === "function") {
                ctx.resume();
            }
            GameAudio.playSE(PADElement.swapSE, 0);
        }
        this._dragging = el;
        // 按下：倒计时重新开始（刷新时间）
        this._startTimer();
        // 记录抓取偏移（boardView 本地坐标 - 元素格子原点）
        let local = this._boardLocalFromStage(e.stageX, e.stageY);
        let pos = this.board.cellToPos(el.row, el.col);
        this._dragOffsetX = local.x - pos.x;
        this._dragOffsetY = local.y - pos.y;
        // 提升层级：重新 addChild 到容器末尾（顶层）
        this.board.boardView.addChild(el.view);
        // 拖拽期间监听舞台移动/弹起
        stage.on(EventObject.MOUSE_MOVE, this, this._onBoardMove);
        stage.on(EventObject.MOUSE_UP, this, this._onBoardUp);
    }

    /**
     * 拖拽移动：元素跟手（钳制在棋盘内），跨相邻格交换
     */
    private _onBoardMove(e: EventObject): void {
        if (!this._dragging) return;
        let local = this._boardLocalFromStage(e.stageX, e.stageY);
        // 钳制在棋盘范围内，拖拽中不越出棋盘显示
        let maxX = this.board.getWidth() - this.board.elementWidth;
        let maxY = this.board.getHeight() - this.board.elementHeight;
        this._dragging.view.x = Math.max(0, Math.min(maxX, local.x - this._dragOffsetX));
        this._dragging.view.y = Math.max(0, Math.min(maxY, local.y - this._dragOffsetY));
        // 判定格子：鼠标移出棋盘时钳制到最近边缘格，等效于在边缘格上继续滑动（可继续触发交换）
        let clampX = Math.max(0, Math.min(this.board.getWidth(), local.x));
        let clampY = Math.max(0, Math.min(this.board.getHeight(), local.y));
        let cell = this.board.pointToCell(clampX, clampY);
        if (cell === null) return;
        // 沿鼠标方向逐格交换，直到珠子到达鼠标所在格
        // 斜线（对角）移动通过两次相邻交换完成，避免"不相邻就不交换"的死区
        let cur = this._dragging.getIndex();
        while (cur[0] !== cell[0] || cur[1] !== cell[1]) {
            let dr = cell[0] - cur[0];
            let dc = cell[1] - cur[1];
            if (Math.abs(dr) > Math.abs(dc)) {
                // 纵向差异更大，先纵向移动一格
                this.board.exchangeElements(cur, [cur[0] + (dr > 0 ? 1 : -1), cur[1]]);
            } else {
                // 横向差异更大或相等（斜线），先横向移动一格
                this.board.exchangeElements(cur, [cur[0], cur[1] + (dc > 0 ? 1 : -1)]);
            }
            cur = this._dragging.getIndex();
        }
    }

    /**
     * 拖拽结束：归位并触发连锁消除
     */
    private _onBoardUp(e: EventObject): void {
        if (!this._dragging) return;
        this._endDrag();
        this._runComboAndSettle();
    }

    /**
     * 结束拖拽并归位元素显示
     */
    private _endDrag(): void {
        if (!this._dragging) return;
        stage.off(EventObject.MOUSE_MOVE, this, this._onBoardMove);
        stage.off(EventObject.MOUSE_UP, this, this._onBoardUp);
        this.board.syncViews();
        this._dragging = null;
        // 松开：暂停倒计时（下次按下再重新开始）
        if (this._timerInterval) {
            clearInterval(this._timerInterval);
            this._timerInterval = null;
        }
    }

    /**
     * 舞台坐标 → boardView 本地坐标
     */
    private _boardLocalFromStage(stageX: number, stageY: number): any {
        return this.board.boardView.globalToLocal(new Point(stageX, stageY));
    }

    // ===== 计时 =====

    /**
     * 开始倒计时
     */
    private _startTimer(): void {
        if (this._roundTime <= 0) return;
        this._remainTime = this._roundTime;
        this._timeUp = false;
        if (this._timerSlider) {
            this._timerSlider.max = this._roundTime;
            this._timerSlider.min = 0;
            this._timerSlider.setValueForce(this._roundTime);
        }
        if (this._timerText) {
            this._timerText.text = String(Math.ceil(this._roundTime / 1000));
        }
        let self = this;
        this._timerInterval = setInterval(function () {
            self._onTimerTick();
        }, 100);
    }

    /**
     * 计时步进
     */
    private _onTimerTick(): void {
        this._remainTime -= 100;
        if (this._remainTime <= 0) {
            this._remainTime = 0;
            if (this._timerSlider) this._timerSlider.setValueForce(0);
            if (this._timerText) this._timerText.text = "0";
            this._timeUp = true;
            clearInterval(this._timerInterval);
            this._forceSettle();
            return;
        }
        if (this._timerSlider) this._timerSlider.setValueForce(this._remainTime);
        if (this._timerText) this._timerText.text = String(Math.ceil(this._remainTime / 1000));
    }

    /**
     * 时间到：强制结束当前拖拽并触发一次结算
     * 倒计时与拖拽绑定：按下开始、松手暂停、时间到强制结束本次拖拽
     */
    private _forceSettle(): void {
        // 若正在拖拽，先结束拖拽（结束时会暂停倒计时）
        if (this._dragging) {
            this._endDrag();
        }
        // 触发一次结算（若已在结算中则等待其完成，完成时复位 _timeUp）
        this._runComboAndSettle();
    }

    // ===== 结算 =====

    /**
     * 触发一次连锁消除并结算
     */
    private _runComboAndSettle(): void {
        if (this._isBusy || this._isFinished) return;
        this._isBusy = true;
        // 本次消除（这轮连锁）的开始：重置当次计数，后续由 _onComboFired 逐个实时累加
        this._lastComboCount = 0;
        this._lastCrossCount = 0;
        this._lastFullRowCount = 0;
        this._lastFullLineCount = 0;
        let self = this;
        this.board.runChainedCombo(
            function (combo: PADCombo) { self._onComboFired(combo); },
            function () {
                // 无消除：直接解除输入锁与时间到标记，跳过战斗行动
                if (self.board.lastComboResults.length === 0) {
                    self._isBusy = false;
                    self._timeUp = false;
                    return;
                }
                // 本次消除的各属性数量（当次值）
                let combos = self.board.lastComboResults;
                self._lastByType = {};
                for (let i = 0; i < combos.length; i++) {
                    let type = combos[i].type;
                    if (self._lastByType[type] === undefined) {
                        self._lastByType[type] = 0;
                    }
                    self._lastByType[type] += combos[i].indexes.length;
                }
                self._updateScoreText();
                // 每次连锁消除完成后立即更新 lastResult（可实时查询，每轮覆盖）
                PADPuzzle.lastResult = {
                    maxComboCount: self._maxComboCount,
                    lastComboCount: self._lastComboCount,
                    totalBallCount: self._totalBallCount,
                    byType: self._byType,
                    lastByType: self._lastByType,
                    lastCrossCount: self._lastCrossCount,
                    lastFullRowCount: self._lastFullRowCount,
                    lastFullLineCount: self._lastFullLineCount
                };
                // 结算完成：恢复倒计时为完整时间（保持暂停，等待下次按下重新开始）
                self._remainTime = self._roundTime;
                self._timeUp = false;
                if (self._timerSlider) self._timerSlider.setValueForce(self._roundTime);
                if (self._timerText) self._timerText.text = String(Math.ceil(self._roundTime / 1000));

                // ===== 钩子②：所有 combo 完成后激活的方法（在这里写你的逻辑）=====
                // 可用数据：
                //   self.board.lastComboResults：本次全部消除的 combo 数组（combo.type 属性类型，combo.indexes 元素索引数组）
                //   self._lastComboCount / self._lastCrossCount / self._lastFullRowCount / self._lastFullLineCount：本次消除统计
                //   self._lastByType：本次各属性消除数量
                //   PADPuzzle.lastResult：本次完整结算结果
                // 战斗行动
                PADBattle.next();
            }
        );
    }

    /**
     * 单个 combo 消除完成的计分
     */
    private _onComboFired(combo: PADCombo): void {
        GameAudio.playSE(PADElement.removeSE, 0.8);
        this._totalBallCount += combo.indexes.length;
        if (this._byType[combo.type] === undefined) {
            this._byType[combo.type] = 0;
        }
        this._byType[combo.type] += combo.indexes.length;
        // 本次消除的 combo 数（实时累加）
        this._lastComboCount++;
        // combo 数字显示（参考 GUI4001 的 comboText）
        if (this._comboText) {
            this._comboText.text = String(this._lastComboCount);
            // 更新时播放 1006 动画（串行：播完再播下一个）
            this._playComboAni();
        }
        // combo 图片同步播放 1008 动画（串行：播完再播下一个）
        this._playComboImageAni();
        // 最大 combo 数（实时更新）
        if (this._lastComboCount > this._maxComboCount) {
            this._maxComboCount = this._lastComboCount;
        }
        // 本次消除的十字数量（5 个同色元素构成十字，实时累加）
        if (PADMatcher.isCrossShape(combo.indexes)) {
            this._lastCrossCount++;
        }
        // 本次消除的整行数量（一行全部同色，实时累加）
        if (PADMatcher.isFullRow(combo.indexes, this.board.cols)) {
            this._lastFullRowCount++;
        }
        // 本次消除的整列数量（一列全部同色，实时累加）
        if (PADMatcher.isFullLine(combo.indexes, this.board.rows)) {
            this._lastFullLineCount++;
        }
        this._updateScoreText();

        // ===== 钩子①：每消除一个 combo 时激活的方法（在这里写你的逻辑）=====
        // 可用的参数：
        //   combo：本次消除的 combo 对象（combo.type 属性类型，combo.indexes 元素索引数组）
        // 实时统计：this._lastComboCount / this._lastCrossCount / this._lastFullRowCount / this._lastFullLineCount
        // 玩家攻击准备：对属性与本次 combo 相同、且已累积攻击力（atkAniPRtext > 0）的玩家角色实例，各触发一次攻击准备动画
        const atkReady = PADhelper.calcAttackReady(combo);
        for (const item of atkReady) {
            if (item.change > 0) {
                PADanim.playerAtkPR(item.player, item.change);
                if(combo.indexes.length>=5)item.player.isAllAtk=true;
            }
        }
        // 玩家治疗准备：查找 combo.type 对应的元素数据ID，若该元素为治疗元素（isHeal=true），计算治疗量并触发治疗准备动画
        let healElementID = -1;
        for (const id of PADElement.dataIDs) {
            if (GameData.getModuleData(PADElement.MODULE_ID, id).name === combo.type) { healElementID = id; break; }
        }
        if (healElementID >= 0 && GameData.getModuleData(PADElement.MODULE_ID, healElementID).isHeal) {
    
            for (const player of Batter.players) {
                const healReady = PADhelper.calcHealReady(player, combo, healElementID);
              
                if (healReady.change > 0) {
                    PADanim.playerHealPR(player, healReady.change, healElementID);
                }
            }
        }
    }

    /**
     * 结束收口：输出结果并释放界面（仅由外部 dispose() 触发；倒计时归零只重置回合，不调用此方法）
     */
    private _finish(): void {
        if (this._isFinished) return;
        this._isFinished = true;
        this._timeUp = true;
        if (this._timerInterval) clearInterval(this._timerInterval);
        // 清理播放中的 combo 动画
        if (this._comboAni) {
            this._comboAni.dispose();
            this._comboAni = null;
        }
        this._pendingComboAni = false;
        if (this._comboImageAni) {
            this._comboImageAni.dispose();
            this._comboImageAni = null;
        }
        this._pendingComboImageAni = false;
        // 释放棋盘缓存的移除动画实例
        this.board.releaseRemoveAnis();
        PADPuzzle.lastResult = {
            maxComboCount: this._maxComboCount,
            lastComboCount: this._lastComboCount,
            totalBallCount: this._totalBallCount,
            byType: this._byType,
            lastByType: this._lastByType,
            lastCrossCount: this._lastCrossCount,
            lastFullRowCount: this._lastFullRowCount,
            lastFullLineCount: this._lastFullLineCount
        };
        // 移除并释放界面
        if (this.root && this.root.parent) {
            this.root.parent.removeChild(this.root);
        }
        if (this.root) {
            this.root.dispose();
            this.root = null;
        }
        
    }

    // ===== UI 构建 =====

    /**
     * 创建计分面板（原版计分板样式）
     */
    private _createScorePanel(boardW: number): void {
        let text = new UIString();
        text.text = "Max combos: 0\nCombos: 0\nTotal balls: 0\nCross: 0 | Row: 0 | Col: 0";
        text.fontSize = 24;
        text.color = "#ffffff";
        text.bold = true;
        text.wordWrap = false;
        text.x = this._boardX + PADPuzzle.SCORE_PADDING;
        text.y = this._boardY + this.board.getHeight() - 200;
        text.width = boardW;
        text.height = 80;
        text.visible = false;
        PADPuzzle.scoreText = text;
        this.root.addChild(text);
    }

    /**
     * 创建倒计时滑条与剩余时间文本
     */
    private _createTimer(boardW: number, extraW: number): void {
        if (this._roundTime <= 0) return;
        // 从 GUI_4001 获取 timeImage 与 timer 的位置/宽高，保持与 GUI4001 布局一致
        let timerX: number = this._boardX;
        let timerY: number = this._boardY- 8;
        let timerW: number = boardW;
        let timeIcon = new UIBitmap();
        let ui4001: GUI_4001 = GameUI.get(4001) as GUI_4001;   
        let timerH: number = ui4001.timeImage.height;
        let timeIconX: number = 0;
        let timeIconY: number = 0;
        if (ui4001 && ui4001.timeImage && ui4001.PADtimer) {
            // root 定位在 elementBG 位置，所以相对坐标 = 组件绝对坐标 - elementBG绝对坐标
            let elBGX = (ui4001.elementBG) ? ui4001.elementBG.x : 0;
            let elBGY = (ui4001.elementBG) ? ui4001.elementBG.y : 0;
            timeIconX = ui4001.timeImage.x - elBGX;
            timeIconY = ui4001.timeImage.y - elBGY;
            // 创建 timeImage 图片（时钟图标），宽高取 GUI4001 的 timeImage
            
            timeIcon.image = ui4001.timeImage.image;
            timeIcon.x = timeIconX;
            timeIcon.y = timeIconY;
            timeIcon.width = ui4001.timeImage.width;
            timeIcon.height = ui4001.timeImage.height;
            this.root.addChild(timeIcon);
            // 滑条：位置/宽高取 GUI4001 的 timer
            timerX = ui4001.PADtimer.x;
            timerY = ui4001.PADtimer.y;
            timerW = ui4001.PADtimer.width;
            timerH = ui4001.PADtimer.height;
        }
        // 滑条：样式配置取 GUI4001 的 timer（保持与 GUI4001 一致），不存在时使用默认
        let slider = new UISlider();         
        if (ui4001 && ui4001.PADtimer) {
            slider.image1 = ui4001.PADtimer.image1;
            slider.image2 = ui4001.PADtimer.image2;
            slider.image3 = ui4001.PADtimer.image3;
            slider.bgGrid9 = ui4001.PADtimer.bgGrid9;
            slider.blockGrid9 = ui4001.PADtimer.blockGrid9;
            slider.blockFillGrid9 = ui4001.PADtimer.blockFillGrid9;
            slider.transverseMode = ui4001.PADtimer.transverseMode;
            slider.blockFillMode = ui4001.PADtimer.blockFillMode;
        } else {
            slider.image1 = "asset/image/picture/control/slider_bg.png";
            slider.image3 = "asset/image/picture/control/slider_bgfill.png";
            slider.bgGrid9 = "4,5,4,5,0";
            slider.blockFillGrid9 = "3,5,3,5,0";
            slider.transverseMode = true;
            slider.blockFillMode = 1;
        }
        slider.min = 0;
        slider.max = this._roundTime;
        slider.value = this._roundTime;
        slider.x = timerX;
        slider.y = timerY;
        slider.width = timerW + extraW;
        slider.height = timerH;
        this._timerSlider = slider;              
        this.root.addChild(slider);
        // 剩余时间文本：属性全部参考 GUI4001 的 PADtimerNum（位置/宽高相对 timeImage）
        let timerText = new UIString();
        timerText.text = String(Math.ceil(this._roundTime / 1000));
        let padTimerNum = (ui4001) ? ui4001.PADtimerNum : null;
        if (padTimerNum) {
            timerText.x =  padTimerNum.x;
            timerText.y = padTimerNum.y;
            timerText.width = padTimerNum.width;
            timerText.height = padTimerNum.height;
            timerText.fontSize = padTimerNum.fontSize;
            timerText.color = padTimerNum.color;
            timerText.bold = padTimerNum.bold;
            timerText.italic = padTimerNum.italic;
            timerText.smooth = padTimerNum.smooth;
            timerText.leading = padTimerNum.leading;
            timerText.letterSpacing = padTimerNum.letterSpacing;
            timerText.font = padTimerNum.font;
            timerText.wordWrap = padTimerNum.wordWrap;
            timerText.overflow = padTimerNum.overflow;
            timerText.align = padTimerNum.align;
            timerText.valign = padTimerNum.valign;
            timerText.shadowEnabled = padTimerNum.shadowEnabled;
            timerText.shadowColor = padTimerNum.shadowColor;
            timerText.shadowDx = padTimerNum.shadowDx;
            timerText.shadowDy = padTimerNum.shadowDy;
            timerText.stroke = padTimerNum.stroke;
            timerText.strokeColor = padTimerNum.strokeColor;
        } else {
            timerText.fontSize = 24;
            timerText.color = "#ffffff";
            timerText.bold = true;
            timerText.align = 1;
            timerText.x = timerX + timerW + 6;
            timerText.y = timerY;
            timerText.width = 60;
            timerText.height = timerH;
        }
        this._timerText = timerText;
        timeIcon.addChild(timerText);
    }

    /**
     * 创建 combo 显示容器：完全使用 GUI4001 的 comboRoot（含 comboImage、comboText）的属性
     */
    private _createComboRoot(extraW: number): void {
        let ui4001: GUI_4001 = GameUI.get(4001) as GUI_4001;
        if (!ui4001 || !ui4001.comboRoot) return;
        let elBGX = (ui4001.elementBG) ? ui4001.elementBG.x : 0;
        let elBGY = (ui4001.elementBG) ? ui4001.elementBG.y : 0;
        // comboRoot 容器：位置相对 elementBG（root 定位在 elementBG），宽高取 GUI4001
        // x 加 extraW：跟随 elementBG 右边缘移动
        let comboRootView = new UIRoot();
        comboRootView.x = ui4001.comboRoot.x - elBGX + extraW;
        comboRootView.y = ui4001.comboRoot.y - elBGY;
        comboRootView.width = ui4001.comboRoot.width;
        comboRootView.height = ui4001.comboRoot.height;
        // comboImage：完全使用 GUI4001 的属性
        if (ui4001.comboImage) {
            let comboImage = new UIBitmap();
            comboImage.image = ui4001.comboImage.image;
            comboImage.x = ui4001.comboImage.x;
            comboImage.y = ui4001.comboImage.y;
            comboImage.width = ui4001.comboImage.width;
            comboImage.height = ui4001.comboImage.height;
            comboImage.grid9 = ui4001.comboImage.grid9;
            comboImage.flip = ui4001.comboImage.flip;
            comboImage.isTile = ui4001.comboImage.isTile;
            comboImage.pivotType = ui4001.comboImage.pivotType;
            this._comboImage = comboImage;
            comboRootView.addChild(comboImage);
        }
        // comboText：现在是 GUI4001 的直接子组件（不在 comboRoot 内），
        // 放入独立锚点容器（位置 = GUI4001 的 comboText 相对 root 的位置）。
        // 原因：动画 target 绑定会把 target 的 x/y 重置为 0（引擎 resetTargetEffect），
        // 且动画显示位置锚定 target 屏幕位置、不受动画自身 x/y 影响，
        // 故文本置于容器内 (0,0)，由容器位置决定显示与动画锚点，归零无影响。
        if (ui4001.comboText) {
            let anchor = new UIRoot();
            // x 加 extraW：跟随 elementBG 右边缘移动
            anchor.x = ui4001.comboText.x - elBGX + extraW;
            anchor.y = ui4001.comboText.y - elBGY;
            this._comboTextX = anchor.x;
            this._comboTextY = anchor.y;
            this.root.addChild(anchor);
            let comboText = new UIString();
            comboText.x = 0;
            comboText.y = 0;
            comboText.width = ui4001.comboText.width;
            comboText.height = ui4001.comboText.height;
            comboText.fontSize = ui4001.comboText.fontSize;
            comboText.color = ui4001.comboText.color;
            comboText.bold = ui4001.comboText.bold;
            comboText.italic = ui4001.comboText.italic;
            comboText.smooth = ui4001.comboText.smooth;
            comboText.leading = ui4001.comboText.leading;
            comboText.letterSpacing = ui4001.comboText.letterSpacing;
            comboText.font = ui4001.comboText.font;
            comboText.wordWrap = ui4001.comboText.wordWrap;
            comboText.overflow = ui4001.comboText.overflow;
            comboText.align = ui4001.comboText.align;
            comboText.valign = ui4001.comboText.valign;
            comboText.shadowEnabled = ui4001.comboText.shadowEnabled;
            comboText.shadowColor = ui4001.comboText.shadowColor;
            comboText.shadowDx = ui4001.comboText.shadowDx;
            comboText.shadowDy = ui4001.comboText.shadowDy;
            comboText.stroke = ui4001.comboText.stroke;
            comboText.strokeColor = ui4001.comboText.strokeColor;
            comboText.text = "0";
            this._comboText = comboText;
            anchor.addChild(comboText);
        }
        this.root.addChild(comboRootView);
    }

    /**
     * 播放 combo 数字动画（1006）：参考战斗伤害显示 showDamage 的方式，
     * 串行播放——若上一个动画未播完则等待其完成后再播下一个
     */
    private _playComboAni(): void {
        let ui4001: GUI_4001 = GameUI.get(4001) as GUI_4001;
        if (!this._comboText) return;
        if (this._comboAni) {
            // 上一个动画还在播放，标记待播，等其播完后再播放
            this._pendingComboAni = true;
            return;
        }
        let ani = new GCAnimation();
        ani.target = this._comboText;
        // 注意：动画显示位置锚定 target（comboText）的屏幕位置，
        // 不受动画自身 x/y 影响；comboText 已在锚点容器内 (0,0)，容器位置即显示位置
        let self = this;
        ani.once(GCAnimation.PLAY_COMPLETED, this, function () {
            ani.dispose();
            self._comboAni = null;
            if (self._pendingComboAni) {
                self._pendingComboAni = false;
                self._playComboAni();
            }
        });
        ani.id = 1006;
        ani.play();
        this._comboAni = ani;
    }

    /**
     * 播放 combo 图片动画（1008）：与 combo 数字动画同节奏，
     * 串行播放——若上一个动画未播完则等待其完成后再播下一个。
     * comboImage 是 comboRootView 内 (0,0) 子节点，位置由容器决定，
     * 动画帧的缩放/偏移结束后引擎会重置回默认值，故可直接绑定 target 无需锚点容器
     */
    private _playComboImageAni(): void {
        if (!this._comboImage) return;
        if (this._comboImageAni) {
            // 上一个动画还在播放，标记待播，等其播完后再播放
            this._pendingComboImageAni = true;
            return;
        }
        let ani = new GCAnimation();
        ani.target = this._comboImage;
        let self = this;
        ani.once(GCAnimation.PLAY_COMPLETED, this, function () {
            ani.dispose();
            self._comboImageAni = null;
            if (self._pendingComboImageAni) {
                self._pendingComboImageAni = false;
                self._playComboImageAni();
            }
        });
        ani.id = 1008;
        ani.play();
        this._comboImageAni = ani;
    }

    // ===== 显示 =====

    /**
     * 刷新计分文本
     */
    private _updateScoreText(): void {
        if (!PADPuzzle.scoreText) return;
        PADPuzzle.scoreText.text = "Max combos: " + this._maxComboCount +
            "\nCombos: " + this._lastComboCount +
            "\nTotal balls: " + this._totalBallCount +
            "\nCross: " + this._lastCrossCount + " | Row: " + this._lastFullRowCount + " | Col: " + this._lastFullLineCount;
    }
}
