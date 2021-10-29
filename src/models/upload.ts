import { Status } from '@src/config/server_config';
import Util from '@util';
import fsPromise from 'fs/promises';
import multer, { DiskStorageOptions } from 'multer';
import path from 'path';
import HttpError from './httpError';

interface FileFilterOption {
    fileId: string;
    rule: string;
    storageAddress?: string;
}

type noString<T> = T extends string ? never : T;
interface Hook {
    beforeUpload(...params: Parameters<noString<NonNullable<DiskStorageOptions['destination']>>>): void;
}

export default class Upload {
    private uploader;
    private lock = false;

    public constructor(dirPath: string, fileFilterOption: FileFilterOption | FileFilterOption[], _hook?: Hook) {
        this.uploader = multer({
            storage: multer.diskStorage({
                async destination(_req, file, cb) {
                    try {
                        await fsPromise.access(dirPath);
                    } catch (e) {
                        await fsPromise.mkdir(dirPath);
                    }
                    // tslint:disable-next-line: no-parameter-reassignment
                    fileFilterOption = fileFilterOption instanceof Array ? fileFilterOption : [fileFilterOption];
                    const date = Util.dateFormat(Date.now(), 'yyyy-MM-dd');
                    const extname = path.extname(file.originalname).replace(/^\./, '');
                    const storageAddress = fileFilterOption.find((v) => v.rule.includes(extname))?.storageAddress ?? '';
                    const storagePath = path.join(dirPath, storageAddress);

                    try {
                        await fsPromise.access(storagePath);
                    } catch (e) {
                        await fsPromise.mkdir(storagePath);
                    }

                    const realPath = path.join(dirPath, storageAddress, date);
                    try {
                        await fsPromise.access(realPath);
                    } catch (e) {
                        await fsPromise.mkdir(realPath);
                    }

                    cb(null, realPath);
                },
                filename(_req, file, cb) {
                    const extname = path.extname(file.originalname);

                    cb(null, Date.now() + extname);
                }
            }),
            fileFilter(_req, file, cb) {
                const extname = path.extname(file.originalname).replace(/^\./, '');
                let rule;
                if (fileFilterOption instanceof Array) {
                    rule = fileFilterOption.find((v) => v.fileId === file.fieldname)?.rule;
                } else {
                    if (file.fieldname === fileFilterOption.fileId) {
                        rule = fileFilterOption.rule;
                    }
                }

                if (rule && rule.includes(extname)) {
                    cb(null, true);
                } else {
                    cb(new HttpError(Status.SERVER_ERROR, 'File type error'));
                }
            }
        });
    }

    public single(fieIdName: string) {
        return this.uploader.single(fieIdName);
    }

    public fields(fields: readonly multer.Field[]) {
        return this.uploader.fields(fields);
    }
}
