import { Status } from '@src/config/server_config';
import HttpError from '@src/models/httpError';
import fsPromise from 'fs/promises';
import path from 'path';

class Routes {
    public watchRoutes() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.fileDisplay(__dirname, true);
                resolve(true);
            } catch (e) {
                reject(new HttpError(Status.SERVER_ERROR, e.message ?? e, e));
            }
        });
    }

    private async fileDisplay(filePath: string, init = false) {
        return new Promise(async (resolve, reject) => {
            try {
                let fileNames = await fsPromise.readdir(filePath);
                if (init) {
                    fileNames = fileNames.filter((v) => v !== 'index.ts');
                }

                for (const item of fileNames) {
                    const fileDirPath = path.join(filePath, item);

                    const stat = await fsPromise.stat(fileDirPath);

                    if (stat.isFile()) {
                        import(fileDirPath);
                    } else if (stat.isDirectory()) {
                        await this.fileDisplay(fileDirPath);
                    }
                }
                resolve(true);
            } catch (e) {
                reject(new HttpError(Status.SERVER_ERROR, e.message ?? e, e));
            }
        });
    }
}

export default new Routes();
