import dbconfig from '@src/config/db_config';
import Util from '@util';
import events from 'events';
import { Request } from 'express';
import mysql from 'mysql';

export interface Result<T> {
    result: T;
    fields?: mysql.FieldInfo[];
}

export default class extends events.EventEmitter {
    private status = 'ready';
    private pool = mysql.createPool(dbconfig);

    public constructor() {
        super();
        this.setMaxListeners(0);
    }

    public asyncQuery<T>(sql: string, values?: unknown[]): Promise<Result<T>> {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                } else {
                    connection.query(sql, values, (err, result, _fields) => {
                        if (err) {
                            reject(err);
                        }
                        resolve(result);
                    });
                }
                connection.release();
            });
        });
    }

    /**
     * 加锁处理多请求
     */
    public asyncQuerySock<T>(req: Request, sql: string, values?: []): Promise<Result<T>> {
        const url = Util.getNoParamsUrl(req);
        return new Promise(async (resolve, reject) => {
            this.once(url, (res) => {
                if (res instanceof Error) {
                    reject(res);
                } else {
                    resolve(res);
                }
            });

            try {
                if (this.status === 'ready') {
                    this.status = 'pending';
                    const result = await this.asyncQuery(sql, values);
                    this.emit(url, result);
                    this.status = 'ready';
                }
            } catch (e) {
                this.emit(url, e);
            }
        });
    }
}
