import { ErrorMsg } from '@src/config/error';
import HttpError from '@src/models/httpError';
import events from 'events';
import { Request, Response } from 'express';
import fs from 'fs';
import iconv from 'iconv-lite';
import path from 'path';
import { Listen, Status } from '../config/server_config';
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

    public static dateFormat(dft: string | number | Date, format: string): string {
        const dateObj = new Date(dft);
        let k;
        const week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        let _format = format;

        const o: Record<string, number | string> = {
            'M+': dateObj.getMonth() + 1,
            'd+': dateObj.getDate(),
            // tslint:disable-next-line:no-magic-numbers
            'h+': dateObj.getHours() % 12,
            'H+': dateObj.getHours(),
            'm+': dateObj.getMinutes(),
            's+': dateObj.getSeconds(),
            'q+': Math.floor((dateObj.getMonth() + 3) / 3),
            'S+': dateObj.getMilliseconds(),
            'W+': week[dateObj.getDay()]
        };

        if (/(y+)/.test(_format)) {
            _format = _format.replace(RegExp.$1, (dateObj.getFullYear() + '').substr(4 - RegExp.$1.length));
        }

        for (k in o) {
            if (new RegExp('(' + k + ')').test(_format)) {
                _format = _format.replace(
                    RegExp.$1,
                    RegExp.$1.length === 1 ? `${o[k]}` : ('00' + o[k]).substr(('' + o[k]).length)
                );
            }
        }

        if (!dft) {
            return '';
        }

        return _format;
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

    /**
     * 阻塞
     */
    public static sleep(time: number): Promise<true> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, time);
        });
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

    public static getNoParamsUrl(req: Request) {
        const urlObj = new URL(req.url, 'http:localhost:' + Listen.PORT);
        return urlObj.pathname;
    }

    public static dataByReadStream(
        path: Parameters<typeof fs.createReadStream>[0],
        option?: Parameters<typeof fs.createReadStream>[1],
        encoding = 'utf8'
    ) {
        const rs = fs.createReadStream(
            path,
            option ?? {
                highWaterMark: 3
            }
        );

        return new Promise((resolve, reject) => {
            const res: Buffer[] = [];
            rs.on('data', (chunk: Buffer) => {
                res.push(chunk);
            });

            rs.on('end', () => {
                const buf = Buffer.concat(res);

                const str = iconv.decode(buf, encoding);

                resolve(str);
            });

            rs.on('error', (err) => {
                reject(err);
            });
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
