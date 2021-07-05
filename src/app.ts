const enum Server {
    PORT = 8000
}

import * as http from 'http';

const server = http.createServer((_req, resp) => {
    resp.end('Hello Node!');
});

server.listen(Server.PORT);
