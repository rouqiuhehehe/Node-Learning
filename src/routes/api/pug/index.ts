import process_request from '@src/models/process_request';
import { NextFunction, Request, Response } from 'express';

export default class {
    @process_request.Get('/pug')
    public getPug(_req: Request, res: Response, _next: NextFunction) {
        res.render('pug/content.pug', {
            messages: ['dsa', 'asd']
        });
    }
}
