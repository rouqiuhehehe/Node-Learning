import { ErrorMsg } from '@src/config/error';
import { Status } from '@src/config/server_config';
import HttpError from '@src/models/httpError';
import { NextFunction, Request, Response } from 'express';

export default (err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
    res.status(err.status ?? Status.SERVER_ERROR);
    return res.send({
        state: err.status ?? Status.UNKONW_ERROR,
        success: false,
        error: err.message ?? ErrorMsg.UNKONW_ERROR
    });
};
