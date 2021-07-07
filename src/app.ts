import path from 'path';
import { Listen } from './config/server_config';
import Ssr from './interface/ssr';
import './interface/test-interface';
import Watcher from './models/fs_events_launcher';
import async from './models/serial_parallel';
import app from './server';
import socketServer from './socket';

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

watcher.start();

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

new Ssr('/assets/333.html').getHtml();

socketServer.listen(Listen.SOCKET_PORT);
app.listen(Listen.PORT);
