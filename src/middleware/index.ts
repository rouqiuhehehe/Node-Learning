import NotFound from './404';
import Auth from './auth';
import ErrorMiddleware from './errorMiddleware';
import Logger from './logger';
import Message from './message';
import User from './user';
class Middleware {
    // public errorMiddleware = errorMiddleware;

    public constructor(
        public errorMiddleware = ErrorMiddleware,
        public logger = Logger,
        public message = Message.messageMiddleware,
        public user = User,
        public auth = Auth.authMiddleware,
        public notFound = NotFound.redirect
    ) {}
}

export default new Middleware();
