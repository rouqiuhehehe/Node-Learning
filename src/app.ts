import path from 'path';
import './interface';
import middleware from './middleware';
import Watcher from './models/fs_events_launcher';
import async from './models/serial_parallel';
import app from './server';
import './socket';

// 监听文件夹文件变化
const watcher = new Watcher(__dirname);
watcher.on('fileChange', (eventname, filename) => {
    console.log(eventname, filename);
    const fileExtension = path.extname(filename);
    if (eventname === 'change' && fileExtension !== '.vue') {
        watcher.copyFile(filename, '.vue');
    }
});

// watcher.startWatchFile();

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
