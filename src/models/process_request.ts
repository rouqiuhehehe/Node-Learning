import { Middleware } from '@src/types/middleware_type';
import app from '../server';
import Util from '../util';
export default class extends Util {
    public static Get(url: string, ...callback: Middleware[]) {
        return (target: Object, _name: string | symbol, descriptor: PropertyDescriptor) => {
            const fn = descriptor.value;
            if (super.variableTypes.isInterfaceFunction(fn)) {
                if (callback.length) {
                    app.get(url, ...callback, fn.bind(target));
                } else {
                    app.get(url, fn.bind(target));
                }
            }
        };
    }

    public static Post(url: string, ...callback: Middleware[]) {
        return (target: Object, _name: string | symbol, descriptor: PropertyDescriptor) => {
            const fn = descriptor.value;
            if (super.variableTypes.isInterfaceFunction(fn)) {
                if (callback.length) {
                    app.post(url, ...callback, fn.bind(target));
                } else {
                    app.post(url, fn.bind(target));
                }
            }
        };
    }

    public static Use(url?: string) {
        return (target: Object, _name: string | symbol, descriptor: PropertyDescriptor) => {
            const fn = descriptor.value;

            if (super.variableTypes.isInterfaceFunction(fn)) {
                if (url) {
                    app.use(url, fn.bind(target));
                } else {
                    app.use(fn.bind(target));
                }
            }
        };
    }

    public static autoBind<T extends Function>(target: T): T | void;

    public static autoBind(target: Object, name: string, descriptor: PropertyDescriptor): PropertyDescriptor | void;

    public static autoBind<T extends Function>(
        target: T | Object,
        name?: string | symbol,
        descriptor?: PropertyDescriptor
    ) {
        const methodAutoBind = (target: Object, key: string | symbol, fn: Function) => {
            return {
                get() {
                    Object.defineProperty(target, key, {
                        value: fn.bind(this),
                        configurable: true,
                        writable: true,
                        enumerable: false
                    });

                    return fn.bind(this);
                }
            };
        };

        if (descriptor !== undefined && name !== undefined) {
            const fn = descriptor.value;
            if (super.variableTypes.isFunction(fn)) {
                return methodAutoBind(target, name, fn);
            }
        } else {
            const prototype = (target as T).prototype;
            Reflect.ownKeys(prototype).forEach((v) => {
                if (v !== 'constructor') {
                    const fn = prototype[v];
                    if (super.variableTypes.isFunction(fn)) {
                        Object.defineProperty(target, v, methodAutoBind(prototype, v, fn));
                    }
                }
            });
        }
    }
}
