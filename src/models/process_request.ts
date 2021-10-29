import autoBind from '@src/descriptor/autobind';
import { Middleware } from '@src/types/middleware_type';
import app from '../server';
import Util from '../util';
export default class extends Util {
    public static Get(url: string, ...callback: Middleware[]) {
        return (target: Object, name: string | symbol, descriptor: PropertyDescriptor) => {
            // tslint:disable-next-line: no-unused-expression
            const newTarget = new (target.constructor as any)();
            const newDes = autoBind(target, name, descriptor);
            Object.defineProperty(target, name, newDes);
            const fn = newTarget[name];

            if (super.variableTypes.isInterfaceFunction(fn)) {
                if (callback.length) {
                    app.get(url, ...callback, fn);
                } else {
                    app.get(url, fn);
                }
            }
        };
    }

    public static Post(url: string, ...callback: Middleware[]) {
        return (target: Object, name: string | symbol, descriptor: PropertyDescriptor) => {
            const newTarget = new (target.constructor as any)();
            const newDes = autoBind(target, name, descriptor);
            Object.defineProperty(target, name, newDes);
            const fn = newTarget[name];
            if (super.variableTypes.isInterfaceFunction(fn)) {
                if (callback.length) {
                    app.post(url, ...callback, fn);
                } else {
                    app.post(url, fn);
                }
            }
        };
    }

    public static Use(url?: string) {
        return (target: Object, name: string | symbol, descriptor: PropertyDescriptor) => {
            const newTarget = new (target.constructor as any)();
            const newDes = autoBind(target, name, descriptor);
            Object.defineProperty(target, name, newDes);
            const fn = newTarget[name];

            if (super.variableTypes.isInterfaceFunction(fn)) {
                if (url) {
                    app.use(url, fn);
                } else {
                    app.use(fn);
                }
            }
        };
    }
}
