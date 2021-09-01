import { IncomingMessage } from 'http';
import { Socket } from 'net';
import WebSocket, { Frame } from './models/socket/websocket';

class WebSocketServer extends WebSocket {
    public constructor() {
        super();
    }

    protected onData(socket: Socket, data: Frame) {
        const str = data.payloadData?.toString();

        console.log(str);

        socket.send({
            payloadData: 'i get it'
        });
    }

    protected onConnetion(_socket: Socket, _req: IncomingMessage) {}

    protected onClose(_socket: Socket, err: boolean) {
        console.log(err);
    }

    protected onError(_socket: Socket, err: Error) {
        console.log(err);
    }
}

export default new WebSocketServer();
