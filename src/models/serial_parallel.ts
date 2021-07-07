import Util from '../util';

export default class extends Util {
    public static serialSerise(callbacks: [...((next: () => void) => void)[], () => void]) {
        const len = callbacks.length;
        let i = 0;

        const next = async () => {
            const cb = callbacks[i];
            if (i === len - 1) {
                await (cb as () => void)();
            } else {
                await cb(next);
                i++;
            }
        };

        next();
    }
}
