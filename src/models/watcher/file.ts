import { Status } from '@src/config/server_config';
import HttpError from '@src/models/httpError';
import Util from '@util';
import Watcher from '@src/models/fs_events_launcher';
import path from 'path';

class FilesWatcher {
    private excludeFile = ['.png', '.jpg', '.vue'];

    public constructor(private params = Util.getCmdParams()) {
        this.checkParams();
    }

    public checkParams() {
        if (
            Object.prototype.hasOwnProperty.call(this.params, 'watchDir') ||
            Object.prototype.hasOwnProperty.call(this.params, 'WD')
        ) {
            this.watchDir(this.params.watchDir || this.params.WD);
        } else {
            Util.hadError(new HttpError(Status.SERVER_ERROR, 'params is error, please enter --watchDir or --WD'));
        }
    }

    private watchDir(watchPath: string) {
        console.log('开始监听：' + watchPath);

        const watcher = new Watcher(watchPath);
        watcher.on('fileChange', (eventName, fileName) => {
            const fileExtension = path.extname(fileName);
            console.log(eventName);

            if (eventName === 'change' && !this.excludeFile.includes(fileExtension)) {
                watcher.copyFile(fileName, '.vue');
            }
        });

        watcher.startWatchFile();
    }
}

export default new FilesWatcher();
