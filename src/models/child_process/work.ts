import { App } from '@src/server';
import http from 'http';
import net from 'net';

// tslint:disable: no-unused-expression
class ChildServer extends App {
    public constructor() {
        super();

        const serverd = http.createServer((req, res) => {
            console.log(req.url);

            res.end('dsc');
        });
        process.send && process.send('xxx');
        process.on('message', (e, server: net.Server) => {
            if (e === 'tcp') {
                server.on('connection', (socket) => {
                    console.log(7);

                    this.app.emit('connection', socket);
                });
            }
        });
    }
}
new ChildServer();
