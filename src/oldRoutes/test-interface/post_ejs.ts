import { Status } from '@src/config/server_config';
import Entry from '@src/models/entry';
import HttpError from '@src/models/httpError';
import process_request from '@src/models/process_request';
import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

export default class {
    @process_request.Use('/ejs/post/add')
    public addEntriesCheck(req: Request, _res: Response, next: NextFunction) {
        const schema = Joi.object({
            title: Joi.string().required().min(2),
            body: Joi.string().required()
        });

        const { error } = schema.validate(req.body);

        if (error) {
            next(new HttpError(Status.SERVER_ERROR, error.details[0].message));
        } else {
            next();
        }
    }

    @process_request.Post('/ejs/post/add')
    public async addEntries(req: Request, res: Response, next: NextFunction) {
        const { title, body } = req.body;
        const entry = new Entry({
            title,
            body,
            username: req.user.username
        });

        try {
            await entry.save();
            res.redirect('/ejs/entries');
        } catch (e) {
            next(new HttpError(Status.SERVER_ERROR, e));
        }
    }
}
