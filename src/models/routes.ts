import { Status } from '@src/config/server_config';
import HttpError from '@src/models/httpError';
import fsPromise from 'fs/promises';
import path from 'path';

class Routes {
    public watchRoutes() {
        return new Promise(async (resolve, reject) => {
            try {
                if (process.env.NODE_RUN === 'dev' || process.env.NODE_RUN === 'debugger') {
                    await this.fileDisplay(path.join(__dirname, '../routes'));
                } else {
                    await this.fileDisplay(path.join(__dirname), true);
                }

                resolve(true);
            } catch (e: any) {
                reject(new HttpError(Status.SERVER_ERROR, e.message ?? e, e));
            }
        });
    }

    private async fileDisplay(filePath: string, webpack = false) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!webpack) {
                    const fileNames = await fsPromise.readdir(filePath);

                    for (const item of fileNames) {
                        const fileDirPath = path.join(filePath, item);

                        const stat = await fsPromise.stat(fileDirPath);

                        if (stat.isFile()) {
                            import(`${fileDirPath}`);
                        } else if (stat.isDirectory()) {
                            await this.fileDisplay(fileDirPath);
                        }
                    }
                } else {
                    const context = require.context('../routes', true, /\.ts$/, 'lazy');

                    context.keys().forEach((key) => {
                        context(key);
                    });
                }

                resolve(true);
            } catch (e: any) {
                reject(new HttpError(Status.SERVER_ERROR, e.message ?? e, e));
            }
        });
    }
}

export default new Routes();
