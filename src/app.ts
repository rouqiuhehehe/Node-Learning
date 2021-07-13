import path from 'path';
import './interface';
import middleware from './middleware';
import Watcher from './models/fs_events_launcher';
import async from './models/serial_parallel';
import app from './server';
import './socket';

// 监听文件夹文件变化
const watcher = new Watcher(path.join(__dirname, './assets'));
watcher.on('fileChange', (eventname, filename) => {
    console.log(eventname, filename);
    // fs.rename(dirJoin('./assets/' + file), dirJoin('./assets/' + 're-' + file), (err) => {
    //     if (err) {
    //         Util.hadError(err);
    //     }
    // });
});

watcher.startWatchFile();

// 串行多函数
async.serialSerise([
    (next) => {
        setTimeout(() => {
            console.log(1);
            next();
        }, 1000);
    },
    (next) => {
        setTimeout(() => {
            console.log(2);
            next();
        }, 100);
    },
    () => {
        setTimeout(() => {
            console.log(3);
            // next();
            // tslint:disable-next-line:no-magic-numbers
        }, 2000);
    }
]);

// 错误中间件放最后
app.use(middleware.errorMiddleware);
