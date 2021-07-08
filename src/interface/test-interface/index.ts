import { Status } from '@src/config/server_config';
import ProcessRequest from '@src/models/process_request';
import Util from '@src/util';
import { Request, Response } from 'express';
import path from 'path';
import util from 'util';
import Ssr from '../ssr';

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

    @ProcessRequest.Get('/get_html')
    public getHtml(_req: Request, res: Response) {
        // util.inspect(dom)
        new Ssr('/assets/333.html').getHtml((dom) => {
            const domArr = dom.map((v) => (v as any).name);
            res.send({
                success: true,
                status: Status.SUCCESS,
                data: util.inspect(dom)
            });
        });
    }
}
