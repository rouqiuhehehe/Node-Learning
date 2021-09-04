import { Listen } from '@src/config/server_config';
import express from 'express';
import fs from 'fs';
import https from 'https';
import path from 'path';

export default class {
    protected httpsServer: https.Server;

    public constructor(app: express.Application) {
        const option = {
            key: fs.readFileSync(path.join(__dirname, './ssl/server.key')),
            cert: fs.readFileSync(path.join(__dirname, './ssl/server.crt'))
        };

        this.httpsServer = https.createServer(option, app);

        this.listen();
    }

    protected listen() {
        this.httpsServer.listen(Listen.HTTPS, () => {
            console.log('https server on ' + Listen.HTTPS);
        });
    }
}
