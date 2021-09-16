import db from '@src/bin/db';
import { Status } from '@src/config/server_config';
import Watcher from '@src/models/fs_events_launcher';
import { default as ProcessRequest, default as process_request } from '@src/models/process_request';
import Util from '@src/util';
import { Request, Response } from 'express';
import path from 'path';
import util from 'util';
import Ssr from '../../models/ssr';

const sql = new db();
export default class {
    @ProcessRequest.Get('/')
    public async getHome(_req: Request, res: Response) {
        res.render('index', { title: 'hello world!', name: 'hello world!' });
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

    @ProcessRequest.Get('/word_count')
    public async wordCount(_req: Request, res: Response) {
        const filePath = path.join(__dirname, '../../assets/');
        const watcher = new Watcher(filePath, res);

        const wordCounts = await watcher.wordCount();

        res.send({
            status: Status.SUCCESS,
            data: wordCounts,
            success: true
        });
    }

    @process_request.Get('/404')
    public notfound(_req: Request, res: Response) {
        res.render('404');
    }

    @process_request.Get('/websocket')
    public webSocket(_req: Request, res: Response) {
        res.render('websocket');
    }
}
