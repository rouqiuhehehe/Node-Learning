import { Status } from '@src/config/server_config';
import Util from '@util';
import fsPromise from 'fs/promises';
import multer from 'multer';
import path from 'path';
import HttpError from './httpError';

interface FileFilterOption {
    fileId: string;
    rule: string;
}

export default class Upload {
    private uploader;

    public constructor(dirPath: string, fileFilterOption: FileFilterOption | FileFilterOption[]) {
        this.uploader = multer({
            storage: multer.diskStorage({
                async destination(_req, _file, cb) {
                    const date = Util.dateFormat(Date.now(), 'yyyy-MM-dd');
                    const realPath = path.join(dirPath, date);
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
