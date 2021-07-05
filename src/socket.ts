import net from 'net';
import Socket from './models/socket_descriptor';
const socketServer = net.createServer((client) => {
    new Socket(client).init();
});

export default socketServer;
