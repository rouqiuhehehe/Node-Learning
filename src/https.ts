import https from './models/socket/https';
import app from './server';
class HttpsServer extends https {
    public constructor() {
        super(app);
    }
}

export default new HttpsServer();
