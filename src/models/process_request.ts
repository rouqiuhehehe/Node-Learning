import app from '../server';
import Util from '../util';

export default class extends Util {
    public static Get(url: string) {
        return (_target: Object, _name: string | symbol, descriptor: PropertyDescriptor) => {
            const fn = descriptor.value;
            if (super.variableTypes.isFunction(fn)) {
                app.get(url, fn);
            }
        };
    }

    public static Post(url: string) {
        return (_target: Object, _name: string | symbol, descriptor: PropertyDescriptor) => {
            const fn = descriptor.value;
            if (super.variableTypes.isFunction(fn)) {
                app.post(url, fn);
            }
        };
    }

    public static Use() {
        return (_target: Object, _name: string | symbol, descriptor: PropertyDescriptor) => {
            app.use(descriptor.value);
        };
    }
}
