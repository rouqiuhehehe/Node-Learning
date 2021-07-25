import { ErrorMsg } from '@src/config/error';
import HttpError from '@src/models/httpError';
import events from 'events';
import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Status } from '../config/server_config';
import variableTypes from './variable_type';

const channel = new events.EventEmitter();

export default class Util {
    public static channel = channel;
    public static variableTypes = variableTypes;
    public static hadError<T extends Error>(err: HttpError<T>, res?: Response) {
        if (process.env.NODE_ENV === 'development') {
            if (res) {
                res.status(err.status).send({
                    status: err.status,
                    success: false,
                    message: err.message
                });
            } else {
                throw new Error(err.message);
            }
        } else {
            if (res) {
                res.status(err.status).send({
                    status: err.status,
                    success: false,
                    message: ErrorMsg.SERVER_ERROR
                });
            } else {
                console.log('err', err.message);
            }
        }
    }

    public static getCmdParams() {
        const params = process.argv.splice(2);
        const paramsObj: Record<string, string> = {};
        for (const item of params) {
            const format = item.slice(2);
            const paramsArr = format.split('=');
            paramsObj[paramsArr[0]] = paramsArr[1];
        }

        return paramsObj;
    }

    public static readFile(fileName: string, fn: (data: string | Buffer) => void, encoding = 'utf-8') {
        fs.readFile(path.join(__dirname, '../', fileName), encoding, (err, data) => {
            if (err) {
                Util.hadError(new HttpError(Status.SERVER_ERROR, err.message, err));
            } else {
                fn.call(null, data);
            }
        });
    }

    public static successSend(data: unknown) {
        return {
            status: Status.SUCCESS,
            data,
            success: true
        };
    }

    public static errorSend<T extends Error>(err: T) {
        return {
            status: Status.SERVER_ERROR,
            success: false,
            message: err.message
        };
    }
}
