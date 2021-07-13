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
    public static hadError<T extends Error>(err: T, res?: Response) {
        if (res) {
            res.status(Status.SERVER_ERROR).send({
                status: Status.SERVER_ERROR,
                success: false,
                message: err.message
            });
        } else {
            throw new Error(err.message);
        }
    }

    public static readFile(fileName: string, fn: (data: string | Buffer) => void, encoding = 'utf-8') {
        fs.readFile(path.join(__dirname, '../', fileName), encoding, (err, data) => {
            if (err) {
                Util.hadError(err);
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
