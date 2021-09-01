import UdpServer from './models/socket/udp';

class UDP extends UdpServer {
    public constructor() {
        super();
        this.listenMessage();
    }

    private listenMessage() {
        this.server.on('message', (msg, rinfo) => {
            this.server.send(
                msg.toString() + '-' + rinfo.address + '-' + rinfo.port,
                rinfo.port,
                rinfo.address,
                (err) => {
                    if (err) {
                        console.log(err);
                    }
                }
            );
        });
    }
}
export default new UDP();
