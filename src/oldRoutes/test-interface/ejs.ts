import { Status } from '@src/config/server_config';
import EjsMiddleware from '@src/middleware/ejs';
import Entry from '@src/models/entry';
import HttpError from '@src/models/httpError';
import process_request from '@src/models/process_request';
import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

export default class Entries {
    @process_request.Use('/ejs/entries/get/:page?')
    // public static
    @process_request.Use('/ejs/:page/view')
    public renderPageCheck(req: Request, _res: Response, next: NextFunction) {
        const schema = Joi.object({
            title: Joi.string().required(),
            name: Joi.string().required()
        });

        const { error } = schema.validate(req.query);

        if (error) {
            next(new HttpError(Status.SERVER_ERROR, error.details[0].message));
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

    @process_request.Get('/ejs/entries')
    public async renderEntriesPage(_req: Request, res: Response, next: NextFunction) {
        try {
            const entries = (await Entry.getRange(0, -1)).data;

            res.render('entries', {
                title: 'Entries',
                entries
            });
        } catch (e: any) {
            next(new HttpError(Status.SERVER_ERROR, e.message));
        }
    }

    @process_request.Get('/ejs/entries/get/:page?', EjsMiddleware.entriesPage)
    public async renderEntries(_req: Request, res: Response, next: NextFunction) {
        try {
            const result = await Entry.getRange(res.locals.page.from, res.locals.page.to);
            res.format({
                json: () => {
                    res.json(result);
                },
                xml: () => {
                    res.render('entries', {
                        title: 'Entries',
                        entries: result.data
                    });
                },
                html: () => {
                    res.render('entries', {
                        title: 'Entries',
                        entries: result.data
                    });
                }
            });
        } catch (e: any) {
            next(new HttpError(Status.SERVER_ERROR, e.message, e));
        }
    }
}
