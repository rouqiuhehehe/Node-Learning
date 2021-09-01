import { Status } from '@src/config/server_config';
import HttpError from '@src/models/httpError';
import Util from '@util';
import { NextFunction, Request, Response } from 'express';
import FileStreamRotator from 'file-stream-rotator';
import path from 'path';

interface A {
    name: string;
    [p: string]: any;
}

export default (dirpPath: string) =>
    <T extends Error>(err: HttpError<T>, _req: Request, res: Response, _next: NextFunction) => {
        const stream = FileStreamRotator.getStream({
            date_format: 'YYYYMMDD',
            filename: path.join(dirpPath, 'access-%DATE%.log'),
            frequency: 'daily',
            verbose: false,
            max_logs: '10d'
        });

        stream.write(
            `\n[${Util.dateFormat(new Date(), 'yyyy-MM-dd HH.mm.ss')}]\n${err.stack ?? err} \n\n`,
            'utf-8',
            (err) => {
                if (err) {
                    console.error(err);
                }
            }
        );

        stream.end();

        if (process.env.NODE_ENV === 'development') {
            return res.status(Status.SUCCESS).send({
                status: err.status,
                success: false,
                message: err.message
            });
        } else {
            return res.status(err.status);
        }
    };
