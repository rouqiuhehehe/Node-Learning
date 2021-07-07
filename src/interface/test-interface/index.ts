import ProcessRequest from '@src/models/process_request';
import Util from '@src/util';
import { Request, Response } from 'express';
import path from 'path';

export default class {
    @ProcessRequest.Get('/')
    public getHome(_req: Request, res: Response) {
        res.send('hello world!');
    }

    @ProcessRequest.Get('/logo')
    public getImg(_req: Request, _res: Response) {
        _res.sendFile(path.join(__dirname, './assets/logo.jpg'));
    }

    @ProcessRequest.Get('/txt')
    public getTxt(_req: Request, _res: Response) {
        Util.readFile('assets/1.txt', (_data) => {
            _res.send(_data);
        });
    }
}
