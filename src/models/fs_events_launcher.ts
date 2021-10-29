import { Status } from '@src/config/server_config';
import Util from '@util';
import events from 'events';
import { Response } from 'express';
import fs, { promises } from 'fs';
import iconv from 'iconv-lite';
import path from 'path';
import HttpError from './httpError';

export default class extends events.EventEmitter {
    private wordCounts: Record<string, number> = {};

    public constructor(private watchDir: string, private res?: Response) {
        super();
    }

    public startWatchFile() {
        fs.watch(
            this.watchDir,
            {
                recursive: true
            },
            (eventname, filename) => {
                this.emit('fileChange', eventname, filename);
            }
        );
    }

    public wordCount() {
        return new Promise((resolve) => {
            fs.stat(this.watchDir, (err, data) => {
                if (err) {
                    Util.hadError(new HttpError(Status.SERVER_ERROR, err.message, err), this.res);
                }
                if (data.isDirectory()) {
                    fs.readdir(this.watchDir, (err, files) => {
                        const promiseArr: Promise<boolean>[] = [];
                        if (err) {
                            Util.hadError(new HttpError(Status.SERVER_ERROR, err.message, err), this.res);
                        }
                        files.forEach((v) => {
                            const extname = path.extname(v);
                            if (extname !== '.jpg') {
                                promiseArr.push(this.wordCountByFile(v));
                            }
                        });

                        Promise.all(promiseArr).then(() => {
                            resolve(this.wordCounts);
                        });
                    });
                } else if (data.isFile()) {
                    this.wordCountByFile().then(() => {
                        resolve(this.wordCounts);
                    });
                }
            });
        });
    }

    public async copyFile(fileName: string, realExtension: string) {
        const filePath = path.join(this.watchDir, fileName);
        const fileExtension = path.extname(fileName);
        const realFileName = fileName.replace(fileExtension, realExtension);
        const realFilePath = path.join(this.watchDir, realFileName);
        try {
            const data = await promises.readFile(filePath, { encoding: 'utf-8', flag: 'r' });
            await promises.rm(realFilePath, { force: true });
            await promises.writeFile(realFilePath, data, { encoding: 'utf-8' });
        } catch (e: any) {
            Util.hadError(new HttpError(Status.SERVER_ERROR, e));
        }
    }

    private wordCountByFile(filename?: string): Promise<boolean> {
        return new Promise((resolve) => {
            fs.readFile(this.watchDir + (filename ?? ''), (err, data) => {
                if (err) {
                    Util.hadError(new HttpError(Status.SERVER_ERROR, err.message, err), this.res);
                }

                const str = iconv.decode(data, 'gbk');
                this.countWordInFile(str);
                resolve(true);
            });
        });
    }

    private countWordInFile(data: string) {
        data.toString()
            .toLowerCase()
            .split(/\s+/)
            .sort()
            .forEach((v) => {
                this.addWordCount(v);
            });
    }

    private addWordCount(v: string) {
        this.wordCounts[v] = this.wordCounts[v] ? this.wordCounts[v] + 1 : 1;
    }
}
