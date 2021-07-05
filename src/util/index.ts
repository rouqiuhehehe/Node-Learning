import { Response } from 'express';
import { Status } from '../config/server_config';
import variableTypes from './variable_type';
import fs from 'fs';
import path from 'path';
import events from 'events';

const channel = new events.EventEmitter();

export default class Util {
    public static channel = channel;
    public static variableTypes = variableTypes;
    public static hadError<T extends Error>(err: T, res?: Response) {
        if (res) {
            res.statusCode = Status.REJECT_REQUEST;
            res.send(err.message);
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
}
