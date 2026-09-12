/**
 * Created by 六一 on 2026-08-16 01:51:50.
 */
class Test {
    constructor(){

    }

    // DSH write-touch 测试：编辑器是否能看到这行注释
    // 【第2次】插件已加载后写入 —— 这行出现即说明脚本编辑器感知到修改

    /**
     * 验证变量是否是数字
     * @param value 待验证的变量
     * @returns 是数字返回 true，否则返回 false
     */
    static isNumber(value: unknown): boolean {
        return typeof value === "number" && !Number.isNaN(value);
    }

    /**
     * 验证变量是否是字符串
     * @param value 待验证的变量
     * @returns 是字符串返回 true，否则返回 false
     */
    static isString(value: unknown): boolean {
        return typeof value === "string";
    }

    /**
     * 验证变量是否是布尔值
     * @param value 待验证的变量
     * @returns 是布尔值返回 true，否则返回 false
     */
    static isBoolean(value: unknown): boolean {
        return typeof value === "boolean";
    }

    /**
     * 验证变量是否是列表（数组）
     * @param value 待验证的变量
     * @returns 是数组返回 true，否则返回 false
     */
    static isList(value: unknown): boolean {
        return Array.isArray(value);
    }

    /**
     * 验证变量是否是对象（排除 null 与数组，即「纯对象」）
     * @param value 待验证的变量
     * @returns 是对象返回 true，否则返回 false
     */
    static isObject(value: unknown): boolean {
        return value !== null && typeof value === "object" && !Array.isArray(value);
    }

    /**
     * 验证变量是否是集合（Set）
     * @param value 待验证的变量
     * @returns 是 Set 返回 true，否则返回 false
     */
    static isSet(value: unknown): boolean {
        return value instanceof Set;
    }

    /**
     * 如果输入是字符串，则在字符串末尾加上 "OK" 后返回；否则原样返回
     * @param value 待处理的变量
     * @returns 字符串返回 value + "OK"，非字符串原样返回
     */
    static appendOKIfString(value: unknown): unknown {
        if (typeof value === "string") {
            return value + "OK";
        }
        return value;
    }

    /**
     * 判断变量如果不是字符串，则输出 "NO"
     * @param value 待验证的变量
     */
    static outputNOIfNotString(value: unknown): void {
        if (typeof value !== "string") {
            trace("NO");
        }
    }
}