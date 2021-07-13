import { ErrorMsg } from '@src/config/error';
import { Status } from '@src/config/server_config';
import Arctiles from '@src/models/arctiles';
import HttpError from '@src/models/httpError';
import process_request from '@src/models/process_request';
import Util from '@util';
import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { MysqlError } from 'mysql';

export default class {
    @process_request.Get('/arctiles')
    public async getArctiles(_req: Request, res: Response) {
        const data = await Arctiles.all();
        res.send({
            status: Status.SUCCESS,
            data,
            success: true
        });
    }

    @process_request.Get('/arctiles/:id')
    public async getArctile(req: Request, res: Response) {
        const id = req.params.id;
        const data = await Arctiles.find(id);

        res.send(Util.successSend(data));
    }

    @process_request.Post('/arctiles/delete/:id')
    public async deleteArctile(req: Request, res: Response) {
        const id = req.params.id;
        const data = await Arctiles.delete(id);

        if (data) {
            res.send(Util.successSend(true));
        } else {
            Util.hadError(new ReferenceError(ErrorMsg.AFFECTEDROWS_ERROR), res);
        }
    }

    @process_request.Use('/arctiles/insert')
    public insertArctileCheck(req: Request, _res: Response, next: NextFunction) {
        const schema = Joi.object({
            title: Joi.string().required(),
            content: Joi.string().required()
        });

        const { error } = schema.validate(req.body);

        if (this.isValidationError(error)) {
            return next(new HttpError(Status.SERVER_ERROR, error.details[0].message));
        } else {
            next();
        }
    }

    @process_request.Post('/arctiles/insert')
    public async insertArctile(req: Request, res: Response, next: NextFunction) {
        try {
            await Arctiles.insert(req.body);
            res.send(Util.successSend(true));
        } catch (err) {
            next(new HttpError(Status.SERVER_ERROR, (err as MysqlError).sqlMessage));
        }
    }

    private isValidationError(err?: Joi.ValidationError): err is Joi.ValidationError {
        return err !== undefined;
    }
}
