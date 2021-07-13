import ErrorMiddleware from './errorMiddleware';
class Middleware {
    // public errorMiddleware = errorMiddleware;

    public constructor(public errorMiddleware = ErrorMiddleware) {}
}

export default new Middleware();
