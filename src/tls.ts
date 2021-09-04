import tls from './models/socket/tls';

class TlsServer extends tls {
    public constructor() {
        super();
    }
}

export default new TlsServer();
