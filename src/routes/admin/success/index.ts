import { Status } from '@src/config/server_config';
import HttpError from '@src/models/httpError';
import process_request from '@src/models/process_request';
import { NextFunction, Request, Response } from 'express';

export default class {
    @process_request.Get('/admin/success')
    public successRender(req: Request, res: Response, next: NextFunction) {
        res.locals.success = req.session.success;
        res.render('success', {}, (err, html) => {
            if (err) {
                next(new HttpError(Status.SERVER_ERROR, err.message, err));
            } else {
                res.send(html);
            }
        });
    }
}
