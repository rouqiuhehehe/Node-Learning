import express from 'express';
import logger from 'morgan';
import { Listen } from './config/server_config';
import middleware from './middleware';

class App {
    public app: express.Application;
    public constructor() {
        this.app = express();
        this.config();
        this.middleware();
        this.listen();
    }

    public middleware() {
        this.app.use(logger('dev'));
        this.app.use(middleware.logger(['method', 'url', 'query', 'body']));
    }

    private config() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
    }

    private listen() {
        this.app.listen(Listen.PORT);
    }
}

export default new App().app;
