import * as http from 'http';
import { ServerConfig } from './config';

const server = http.createServer((_req, resp) => {
    resp.end('Hello Node!');
});

server.listen(ServerConfig.PORT);
