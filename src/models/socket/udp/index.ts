import { Listen } from '@src/config/server_config';
import dgram from 'dgram';

export default class UdpServer {
    protected server: dgram.Socket;

    public constructor() {
        this.server = dgram.createSocket('udp4');

        this.init();
        this.bind();
    }

    protected init() {
        this.server.on('listening', () => {
            const address = this.server.address();

            console.log('UDP server listening ' + address.address + ':' + address.port);
        });

        this.server.on('error', (e) => {
            console.log(e, 'error');
        });
    }

    protected bind() {
        this.server.bind(Listen.UDP_SOCKET_PORT);
    }
}
