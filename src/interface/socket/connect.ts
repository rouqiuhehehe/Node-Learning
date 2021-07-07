import net from 'net';
import { Listen } from '../../config/server_config';

const tcpClient = new net.Socket();

tcpClient.connect(Listen.SOCKET_PORT, '127.0.0.1', () => {
    console.log('connect success.');
    tcpClient.write('this is tcp client by Node.js'); // 服务器向客户端发送消息
});

// 监听服务器端发过来的数据
tcpClient.on('data', (data) => {
    console.log('received: ', data.toString());
});

tcpClient.on('close', () => {
    console.log('closed');
});
