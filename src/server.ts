import express from 'express';
import { Listen } from './config/server_config';

class App {
    public app: express.Application;
    public constructor() {
        this.app = express();
        this.config();
        this.listen();
    }

    public middleware() {
        // this.app.use(middleware.errorMiddleware);
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
