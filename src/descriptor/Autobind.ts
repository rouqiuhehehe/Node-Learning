// tslint:disable: no-invalid-this

function autoBind<T extends Function>(target: T): T | void;

function autoBind(target: Object, name: string, descriptor: PropertyDescriptor): PropertyDescriptor | void;

function autoBind<T extends Function>(
    target: T | Object,
    name?: string | symbol,
    descriptor?: PropertyDescriptor
): PropertyDescriptor | void {
    if (descriptor !== undefined && name !== undefined) {
        const fn = descriptor.value;
        if (typeof fn === 'function') {
            return methodAutoBind(target, name, fn);
        }
    } else {
        const prototype = (target as T).prototype;
        Reflect.ownKeys(prototype).forEach((v) => {
            if (v !== 'constructor') {
                const fn = prototype[v];
                if (typeof fn === 'function') {
                    Object.defineProperty(prototype, v, methodAutoBind(target, v, fn));
                }
            }
        });
    }
}

function methodAutoBind(target: Object, key: string | symbol, fn: Function) {
    return {
        get() {
            if (Object.prototype.hasOwnProperty.call(this, key) || this === target) {
                return fn;
            }
            Object.defineProperty(target, key, {
                value: fn.bind(this),
                configurable: true,
                writable: true,
                enumerable: false
            });

            return fn.bind(this);
        }
    };
}
export default autoBind;
