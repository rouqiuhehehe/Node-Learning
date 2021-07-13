import { Status } from '@src/config/server_config';

export default class HttpError extends Error {
    public constructor(public status = Status.SERVER_ERROR, public message = 'unkonw error') {
        super(message);
    }
}
