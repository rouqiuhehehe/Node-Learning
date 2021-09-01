import dgram from 'dgram';
import { Listen } from '../../../config/server_config';

const buf = Buffer.from('潇洒李狗蛋');

const client = dgram.createSocket('udp4');

client.on('message', (msg, rinfo) => {
    console.log(msg.toString(), rinfo);
});

client.send(buf, Listen.UDP_SOCKET_PORT, (err, _bytes) => {
    if (err) {
        console.log(err);
    }
    // client.close();
});
