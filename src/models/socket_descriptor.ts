import net from 'net';
import Util from '../util';
const clients: Record<string, net.Socket> = {};
const subScripts: Record<string, (id: string, message: string) => void> = {};

export default class Socket {
    public constructor(private client: net.Socket) {
        Util.channel.on('join', this.join);
    }

    public init() {
        const id = `${this.client.remoteAddress}_${this.client.remotePort}`;
        console.log(id);

        Util.channel.emit('join', id, this.client);
        this.listenData(id);
    }

    private listenData(id: string) {
        this.client.on('data', (data) => {
            const _data = data.toString('utf-8');
            Util.channel.emit('broadcast', id, _data);
        });
    }

    private join(id: string, client: net.Socket) {
        clients[id] = client;
        subScripts[id] = (_id, message) => {
            // if (id !== _id) {
            console.log(message);

            clients[id].write(message);
            // }
        };

        Util.channel.on('broadcast', subScripts[id]);
    }
}
