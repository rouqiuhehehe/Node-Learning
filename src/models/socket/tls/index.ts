import { Listen } from '@src/config/server_config';
import fs from 'fs';
import tls, { Server, TlsOptions } from 'tls';

export default class {
    protected tlsServer: Server;

    public constructor(options: TlsOptions = {}) {
        const option = {
            key: fs.readFileSync(__dirname + '/ssl/server.key'),
            cert: fs.readFileSync(__dirname + '/ssl/server.crt'),
            requestCert: true,
            ca: [fs.readFileSync(__dirname + '/ssl/ca.crt')],
            ...options
        };

        this.tlsServer = tls.createServer(option, (socket) => {
            // tslint:disable-next-line: no-magic-numbers
            socket.write('welcome!\n');
            socket.setEncoding('utf8');

            socket.pipe(socket);
        });

        this.listen();
    }

    protected listen() {
        this.tlsServer.listen(Listen.TLS_SOCKET_PORT);
    }
}
