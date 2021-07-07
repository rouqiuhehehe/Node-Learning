export default class {
    public static isFunction(fn: any): fn is (...arg: any[]) => void {
        return typeof fn === 'function';
    }
}
