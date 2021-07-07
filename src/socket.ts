import net from 'net';
import Socket from './interface/socket';

const socket = new Socket();

const socketServer = net.createServer((client) => {
    socket.init(client);
});

export default socketServer;
