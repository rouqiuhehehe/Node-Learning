import ErrorMiddleware from './errorMiddleware';
import Logger from './logger';
class Middleware {
    // public errorMiddleware = errorMiddleware;

    public constructor(public errorMiddleware = ErrorMiddleware, public logger = Logger) {}
}

export default new Middleware();
