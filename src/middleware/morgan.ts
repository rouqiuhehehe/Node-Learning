import autoBind from '@src/descriptor/autobind';
import Util from '@util';
import { Request, Response } from 'express';
import FileStreamRotator from 'file-stream-rotator';
import morgan from 'morgan';
import path from 'path';
@autoBind
export default class Morgan {
    public constructor(private dirPath: string) {}

    public useLogger() {
        const key = this.morganforMat();

        return morgan(key, {
            stream: this.fileStreamRotatorGetStream()
        });
    }

    private morganforMat() {
        const dateFormat = Util.dateFormat(new Date(), 'yyyy-MM-dd HH.mm.ss');
        const key = 'dev_params';

        morgan.token('requestParameters', (req: Request, _res: Response) => {
            return JSON.stringify(req.query) || '-';
        });

        morgan.token('requestBody', (req: Request, _res: Response) => {
            return JSON.stringify(req.body) || '-';
        });

        morgan.format(key, `[${dateFormat}] :method :url :status :requestParameters :requestBody`);

        return key;
    }

    private fileStreamRotatorGetStream() {
        return FileStreamRotator.getStream({
            date_format: 'YYYYMMDD',
            filename: path.join(this.dirPath, 'access-%DATE%.log'),
            frequency: 'daily',
            verbose: false,
            max_logs: '10d'
        });
    }
}
