import net from 'net';
import { Listen } from './config/server_config';
import Socket from './models/socket/tcp';

class SocketServer extends Socket {
    public socketer: net.Server;
    public constructor(
        protected clients: Record<string, net.Socket> = {},
        protected subScripts: Record<string, (id: string, message: string) => void> = {}
    ) {
        super(clients, subScripts);
        this.socketer = net.createServer((client) => {
            super.init(client);
        });
        this.listen();
    }

    private listen() {
        this.socketer.listen(Listen.TCP_SOCKET_PORT);
    }
}

export default new SocketServer();
