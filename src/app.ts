import * as http from 'http';
import { ServerConfig } from './config';

const server = http.createServer((_req, resp) => {
    console.log(_req);
    resp.end('Hello Node!');
});

server.listen(ServerConfig.PORT);
