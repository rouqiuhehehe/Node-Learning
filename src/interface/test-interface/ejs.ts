import { Status } from '@src/config/server_config';
import HttpError from '@src/models/httpError';
import process_request from '@src/models/process_request';
import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

export default class {
    @process_request.Use('/ejs/:page/view')
    public renderPageCheck(req: Request, _res: Response, next: NextFunction) {
        const schema = Joi.object({
            title: Joi.string().required(),
            name: Joi.string().required()
        });

        const { error } = schema.validate(req.query);

        if (error) {
            return next(new HttpError(Status.SERVER_ERROR, error.details[0].message));
        } else {
            next();
        }
    }

    @process_request.Get('/ejs/:page/view')
    public renderPage(req: Request, res: Response) {
        const { page } = req.params;
        const { title, name } = req.query;

        res.render(page, { title, name });
    }
}
