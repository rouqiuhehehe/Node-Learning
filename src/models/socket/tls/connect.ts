import fs from 'fs';
import tls, { ConnectionOptions } from 'tls';
import { Listen } from '../../../config/server_config';

const option: ConnectionOptions = {
    key: fs.readFileSync(__dirname + '/ssl/client.key'),
    cert: fs.readFileSync(__dirname + '/ssl/client.crt'),
    ca: [fs.readFileSync(__dirname + '/ssl/ca.crt')],
    rejectUnauthorized: false
};

const steam = tls.connect(Listen.TLS_SOCKET_PORT, option, () => {
    console.log(steam.authorized, 9);

    steam.write('yoshiki');
    process.stdin.pipe(steam);
});

steam.setEncoding('utf8');

steam.on('data', (data) => {
    console.log(data, 10);
});
