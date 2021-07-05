import ProcessRequest from './models/process_request';
import { Request, Response } from 'express';
import Util from './util';
import path from 'path';
import app from './server';
import socketServer from './socket';
import { Listen } from './config/server_config';
import net from 'net';

class Index {
    @ProcessRequest.Get('/')
    public getHome(_req: Request, res: Response) {
        res.send('hello world!');
    }

    @ProcessRequest.Get('/logo')
    public getImg(_req: Request, _res: Response) {
        _res.sendFile(path.join(__dirname, './assets/logo.jpg'));
    }

    @ProcessRequest.Get('/txt')
    public getTxt(_req: Request, _res: Response) {
        Util.readFile('assets/1.txt', (_data) => {
            _res.send(_data);
        });
    }
}

const tcpClient = new net.Socket();

tcpClient.connect(Listen.SOCKET_PORT, '127.0.0.1', () => {
    console.log('connect success.');
    tcpClient.write('this is tcp client by Node.js'); // 服务器向客户端发送消息
});

// 监听服务器端发过来的数据
tcpClient.on('data', (data) => {
    console.log('received: ', data.toString());
});

socketServer.listen(Listen.SOCKET_PORT);
app.listen(Listen.PORT);
