/**
 * PAD 消除匹配器（纯逻辑）
 * 移植自 mugen_pazdora 的 $a.Matcher（docs/js/src/index.js）
 * 功能：
 *  -- 按行、按列扫描查找 3 连及以上的同属性元素组
 *  -- 将同属性且相邻（曼哈顿距离 <= 1）的行组/列组合并为同一个 combo（支持十字/L形/T形消除）
 *  -- 按"最左下角"排序（row*1000-col，越大越优先，即更靠下靠左的 combo 先结算）
 * 注意：本类不依赖任何渲染与游戏框架，仅依赖棋盘数据的 type 字段
 */

/**
 * 可参与匹配的最小接口：元素需暴露属性类型
 */
interface IPADMatchable {
    type: string;
}

/**
 * 一个消除组合
 */
interface PADCombo {
    type: string;
    /**
     * 组成该 combo 的全部坐标数组 [row, col]
     */
    indexes: number[][];
}

class PADMatcher {
    /**
     * 最近一次匹配得到的全部 combo
     */
    combos: PADCombo[];

    constructor() {
        this.combos = [];
    }

    /**
     * 获取最近一次匹配中被消除的全部坐标 [row, col]
     */
    getMatchedIndexes(): number[][] {
        let list: number[][] = [];
        for (let i = 0; i < this.combos.length; i++) {
            let combo = this.combos[i];
            for (let j = 0; j < combo.indexes.length; j++) {
                list.push(combo.indexes[j]);
            }
        }
        return list;
    }

    /**
     * 匹配棋盘，返回全部 combo（并缓存到 this.combos）
     * @param squares 棋盘数据 [row][col]，元素需有 type 字段，空位为 null
     * @param rows 棋盘行数
     * @param cols 棋盘列数
     */
    match(squares: IPADMatchable[][], rows: number, cols: number): PADCombo[] {
        this.combos = [];
        // 收集行组与列组
        let ballSets: PADCombo[] = [];
        // 按行扫描
        for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
            let sets = PADMatcher.__pickBallSets(squares[rowIndex].slice(), "row", rowIndex);
            ballSets = ballSets.concat(sets);
        }
        // 按列扫描
        for (let columnIndex = 0; columnIndex < cols; columnIndex++) {
            let squaresOnLine: IPADMatchable[] = [];
            for (let r = 0; r < rows; r++) {
                squaresOnLine.push(squares[r][columnIndex]);
            }
            let sets = PADMatcher.__pickBallSets(squaresOnLine, "column", columnIndex);
            ballSets = ballSets.concat(sets);
        }
        // 合并同属性相邻组为 combo
        let combos = PADMatcher.__mergeBallSets(ballSets);
        // 排序：按最左下角（order 越大越靠下靠左，优先结算）
        combos.sort(function (a, b) {
            return PADMatcher.__makeComboOrder(b) - PADMatcher.__makeComboOrder(a);
        });
        this.combos = combos;
        return combos;
    }

    /**
     * 判断一组同色坐标是否恰好构成一个十字（5 个元素：中心 + 上下左右）
     * @param indexes 坐标数组 [row, col]
     */
    static isCrossShape(indexes: number[][]): boolean {
        if (indexes.length !== 5) return false;
        let set: any = {};
        for (let i = 0; i < 5; i++) {
            set[indexes[i][0] + "," + indexes[i][1]] = true;
        }
        for (let i = 0; i < 5; i++) {
            let r = indexes[i][0];
            let c = indexes[i][1];
            if (set[(r - 1) + "," + c] && set[(r + 1) + "," + c] &&
                set[r + "," + (c - 1)] && set[r + "," + (c + 1)]) {
                return true;
            }
        }
        return false;
    }

    /**
     * 判断一组同色坐标是否恰好覆盖一整行（所有列）
     * @param indexes 坐标数组 [row, col]
     * @param cols 棋盘列数
     */
    static isFullRow(indexes: number[][], cols: number): boolean {
        if (indexes.length !== cols) return false;
        let row = indexes[0][0];
        let set: any = {};
        for (let i = 0; i < indexes.length; i++) {
            if (indexes[i][0] !== row) return false;
            set[indexes[i][1]] = true;
        }
        for (let c = 0; c < cols; c++) {
            if (!set[c]) return false;
        }
        return true;
    }

    /**
     * 判断一组同色坐标是否恰好覆盖一整列（所有行）
     * @param indexes 坐标数组 [row, col]
     * @param rows 棋盘行数
     */
    static isFullLine(indexes: number[][], rows: number): boolean {
        if (indexes.length !== rows) return false;
        let col = indexes[0][1];
        let set: any = {};
        for (let i = 0; i < indexes.length; i++) {
            if (indexes[i][1] !== col) return false;
            set[indexes[i][0]] = true;
        }
        for (let r = 0; r < rows; r++) {
            if (!set[r]) return false;
        }
        return true;
    }

    /**
     * 从一条线（行或列）中挑出 3 连及以上的同属性段
     * @param squaresOnLine 该线上的元素数组（注意：会被临时 push 一个 null 用于收尾，函数内部会恢复）
     * @param direction "row" | "column"
     * @param rowOrColumnIndex 所在行号或列号
     * @return 形如 [{ type, indexes:[[row,col],..] }, ..]
     */
    private static __pickBallSets(squaresOnLine: IPADMatchable[], direction: string, rowOrColumnIndex: number): PADCombo[] {
        // 匹配 3 连模式，如 [daaaaf] => [["aqua",1,4]]；[dddrrr] => [["dark",0,3],["red",3,3]]
        let matches: any[] = [];
        let preBallType: string = null;
        let count = 1;
        squaresOnLine.push(null); // 收尾哨兵
        for (let i = 0; i < squaresOnLine.length; i++) {
            let square = squaresOnLine[i];
            let ballType = (square !== null) ? square.type : null;
            if (ballType !== preBallType) {
                if (count >= 3) {
                    matches.push([preBallType, i - count, count]);
                }
                preBallType = ballType;
                count = 1;
            } else {
                if (ballType !== null) {
                    count += 1;
                }
            }
        }
        squaresOnLine.pop(); // 恢复原数组

        // 匹配结果转换为坐标数组，如 ["aqua",1,4] => { type:"aqua", indexes:[[0,1],[0,2],[0,3],[0,4]] }
        let ballSets: PADCombo[] = [];
        for (let m = 0; m < matches.length; m++) {
            let set: PADCombo = { type: matches[m][0], indexes: [] };
            for (let i = 0; i < matches[m][2]; i++) {
                if (direction === "row") {
                    set.indexes.push([rowOrColumnIndex, matches[m][1] + i]);
                } else {
                    set.indexes.push([matches[m][1] + i, rowOrColumnIndex]);
                }
            }
            ballSets.push(set);
        }
        return ballSets;
    }

    /**
     * 合并同属性相邻的组合（十字/L形/T形会并为一个 combo）
     */
    private static __mergeBallSets(ballSets: PADCombo[]): PADCombo[] {
        let mergedBallSets: PADCombo[] = [];
        while (ballSets.length > 0) {
            let currentBallSet = ballSets.shift();
            let result = PADMatcher.__findSameTypeAndMergeBallSet(currentBallSet, ballSets);
            mergedBallSets.push(result[0]);
            ballSets = result[1];
        }
        return mergedBallSets;
    }

    /**
     * 将 subject 与列表中所有同属性且相邻的组合并，返回 [合并后的 subject, 剩余列表]
     */
    private static __findSameTypeAndMergeBallSet(subject: PADCombo, ballSets: PADCombo[]): [PADCombo, PADCombo[]] {
        let newBallSets: PADCombo[] = [];
        for (let i = 0; i < ballSets.length; i++) {
            let target = ballSets[i];
            if (PADMatcher.__areNeighboringSameTypeBallSets(subject, target)) {
                // 合并去重
                for (let j = 0; j < target.indexes.length; j++) {
                    let idx = target.indexes[j];
                    let exists = false;
                    for (let k = 0; k < subject.indexes.length; k++) {
                        if (subject.indexes[k][0] === idx[0] && subject.indexes[k][1] === idx[1]) {
                            exists = true;
                            break;
                        }
                    }
                    if (!exists) {
                        subject.indexes.push(idx);
                    }
                }
            } else {
                newBallSets.push(target);
            }
        }
        return [subject, newBallSets];
    }

    /**
     * 判断两个组合是否同属性且任意两格相邻（曼哈顿距离 <= 1）
     */
    private static __areNeighboringSameTypeBallSets(a: PADCombo, b: PADCombo): boolean {
        if (a.type !== b.type) return false;
        for (let ai = 0; ai < a.indexes.length; ai++) {
            for (let bi = 0; bi < b.indexes.length; bi++) {
                if (PADMatcher.__pointsToDistance(a.indexes[ai], b.indexes[bi]) <= 1) return true;
            }
        }
        return false;
    }

    /**
     * 曼哈顿距离
     */
    private static __pointsToDistance(a: number[], b: number[]): number {
        return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
    }

    /**
     * 坐标转排序权重：row*1000-col，row 权重优先（越靠下越大），再取 col 小者（越靠左越大）
     */
    private static __idxToOrder(idx: number[]): number {
        return idx[0] * 1000 - idx[1];
    }

    /**
     * 组合的排序权重：取其中"最左下角"元素的权重
     */
    private static __makeComboOrder(combo: PADCombo): number {
        let maxOrder = -Infinity;
        for (let i = 0; i < combo.indexes.length; i++) {
            let o = PADMatcher.__idxToOrder(combo.indexes[i]);
            if (o > maxOrder) maxOrder = o;
        }
        return maxOrder;
    }
}
