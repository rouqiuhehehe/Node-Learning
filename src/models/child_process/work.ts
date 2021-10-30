import { App } from '@src/server';
import http from 'http';
import net from 'net';

// tslint:disable: no-unused-expression
class ChildServer extends App {
    public constructor() {
        super((err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            const server = http.createServer(this.app);
            console.log(this.app._router);

            process.send && process.send('init');
            process.on('message', (e, net: net.Server) => {
                if (e === 'tcp') {
                    net.on('connection', (socket) => {
                        server.emit('connection', socket);
                    });
                }
            });
        });
    }
}
new ChildServer();
