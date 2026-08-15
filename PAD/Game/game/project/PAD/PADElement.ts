/**
 * PAD 消除元素（珠子）
 * 移植自 mugen_pazdora 的 $a.Ball（docs/js/src/index.js）
 * 数据（属性类型、行列位置）+ 渲染（UIBitmap）一体
 * 属性类型由 dataIDs（自定义模块 MODULE_ID 的数据 ID 列表）动态生成，默认 6 种：
 * fire/water/wood/light/dark/heal（对应项目素材 PADitem 下的图片）
 */

class PADElement {
    /** 自定义模块 ID（PADitem 属性素材数据所在模块，保持常量） */
    static MODULE_ID: number = 2;

    // ===== 音频路径（静态变量，可在外部覆盖，统一在此管理） =====
    /** 交换（移动）音效路径 */
    static swapSE: string = "asset/audio/se/PAD/yidong.ogg";
    /** 消除音效路径 */
    static removeSE: string = "asset/audio/se/PAD/xiaochu.ogg";
    /** 回复（治疗）音效路径 */
    static healSE: string = "asset/audio/se/PAD/heal.ogg";

    /**
     * 元素池的数据 ID 列表（自定义模块 MODULE_ID 中的数据 ID）
     * 决定本局使用哪些属性类型；整体赋值后 TYPES 与图片缓存自动重建
     * 默认 [4,5,6,1,2,3] 对应 fire/water/wood/light/dark/heal
     */
    private static _dataIDs: number[] = [4, 5, 6, 1, 2, 3];
    static get dataIDs(): number[] {
        return PADElement._dataIDs.slice();
    }
    static set dataIDs(ids: number[]) {
        PADElement._dataIDs = ids;
        PADElement._images = null; // 图片缓存失效
    }

    /**
     * 属性类型 → 图片路径的缓存（惰性初始化）
     * 注意：不能在类定义时立即调用 GameData.getModuleData——此时模块数据尚未就绪（返回 null），
     * 会导致类初始化中断；改为首次取图时才读取
     */
    private static _images: any = null;

    /**
     * 获取指定属性类型的图片路径
     * @param type 属性类型
     */
    static getTypeImage(type: string): string {
        if (!PADElement._images) {
            PADElement._images = {};
            for (let i = 0; i < PADElement.dataIDs.length; i++) {
                let d = GameData.getModuleData(PADElement.MODULE_ID, PADElement.dataIDs[i]);
                PADElement._images[d.name] = d.image;
            }
        }
        return PADElement._images[type];
    }
    /**
     * 全部属性类型（随机生成时使用），由 dataIDs 对应的模块数据 name 动态生成
     */
    static get TYPES(): string[] {
        let types: string[] = [];
        for (let i = 0; i < PADElement.dataIDs.length; i++) {
            let d = GameData.getModuleData(PADElement.MODULE_ID, PADElement.dataIDs[i]);
            types.push(d.name);
        }
        return types;
    }

    /**
     * 随机一个属性类型
     */
    static randomType(): string {
        return PADElement.TYPES[MathUtils.rand(PADElement.TYPES.length)];
    }

    /**
     * 属性类型
     */
    type: string;
    /**
     * 所在行号
     */
    row: number;
    /**
     * 所在列号
     */
    col: number;
    /**
     * 是否已从盘面移除（消除）
     */
    isRemoved: boolean;
    /**
     * 渲染组件（由棋盘创建并加入棋盘容器）
     */
    view: UIBitmap;


    /**
     * @param type 属性类型
     * @param row 行号
     * @param col 列号
     */
    constructor(type: string, row: number, col: number) {
        this.type = type;
        this.row = row;
        this.col = col;
        this.isRemoved = false;
        this.view = null;
    }

    /**
     * 设置所在行列
     */
    setIndex(row: number, col: number): void {
        this.row = row;
        this.col = col;
    }

    /**
     * 获取所在坐标 [row, col]
     */
    getIndex(): number[] {
        return [this.row, this.col];
    }

    /**
     * 获取本元素对应图片路径
     */
    getImage(): string {
        return PADElement.getTypeImage(this.type);
    }

    /**
     * 创建渲染组件（UIBitmap）
     * @param container 棋盘容器（组件会被 addChild 到该容器）
     * @param width 渲染宽度
     * @param height 渲染高度
     * @param x 初始 x（棋盘容器内坐标）
     * @param y 初始 y（棋盘容器内坐标）
     */
    createView(container: UIRoot, width: number, height: number, x: number, y: number): UIBitmap {
        let view = new UIBitmap();
        view.image = this.getImage();
        view.width = width;
        view.height = height;
        view.x = x;
        view.y = y;
        this.view = view;
        container.addChild(view);
        return view;
    }

    /**
     * 释放渲染组件
     */
    disposeView(): void {
        if (this.view) {
            this.view.dispose();
            this.view = null;
        }
    }
}
