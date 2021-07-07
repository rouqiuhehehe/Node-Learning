import net from 'net';
import Util from '../../util';

export default class Socket {
    public constructor(
        private clients: Record<string, net.Socket> = {},
        private subScripts: Record<string, (id: string, message: string) => void> = {}
    ) {
        this.channelBind();
    }

    public init(client: net.Socket) {
        const id = `${client.remoteAddress}_${client.remotePort}`;
        console.log(id);

        Util.channel.emit('join', id, client);
        this.listenData(id, client);
    }

    public get size() {
        return Object.keys(this.clients).length;
    }

    private channelBind() {
        Util.channel.on('join', this.join.bind(this));
        Util.channel.on('leave', (id) => {
            if (this.subScripts[id]) {
                Util.channel.removeListener('broadcast', this.subScripts[id]);
                Reflect.deleteProperty(this.subScripts, id);
                Reflect.deleteProperty(this.clients, id);
            }

            Util.channel.emit('broadcast', id, `${id} has left the chatroom\n`);
        });

        Util.channel.on('shutdown', () => {
            Util.channel.emit('broadcast', '', `The server has shut down \n`);
            Util.channel.removeAllListeners('broadcast');
        });
    }

    private listenData(id: string, client: net.Socket) {
        client.on('data', (data) => {
            const _data = data.toString('utf-8');
            if (_data === 'shutdown') {
                Util.channel.emit('shutdown');
            }
            Util.channel.emit('broadcast', id, _data);
        });
        client.on('close', () => {
            Util.channel.emit('leave', id);
        });

        client.on('error', (err) => {
            console.log(err);
        });
    }

    private join(id: string, client: net.Socket) {
        this.clients[id] = client;
        this.subScripts[id] = (_id, message) => {
            if (id !== _id) {
                this.clients[id].write(`${message}`);
            }
        };

        Util.channel.on('broadcast', this.subScripts[id]);
    }
}
