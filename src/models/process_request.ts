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
}
