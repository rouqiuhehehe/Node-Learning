import dbconfig from '@src/config/db_config';
import mysql from 'mysql';

export const asyncQuery = <T>(sql: string, values?: T[]) => {
    return new Promise((resolve, reject) => {
        const db = mysql.createConnection(dbconfig);
        db.connect();
        db.query(sql, values, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
        db.end();
    });
};
