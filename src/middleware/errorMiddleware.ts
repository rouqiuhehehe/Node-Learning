import { ErrorMsg } from '@src/config/error';
import HttpError from '@src/models/httpError';
import { NextFunction, Request, Response } from 'express';

export default <T extends Error>(err: HttpError<T>, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    if (process.env.NODE_ENV === 'development') {
        return res.status(err.status).send({
            status: err.status,
            success: false,
            message: err.message
        });
    } else {
        return res.status(err.status).send({
            status: err.status,
            success: false,
            message: ErrorMsg.SERVER_ERROR
        });
    }
};
