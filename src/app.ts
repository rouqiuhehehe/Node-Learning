import easyMonitor from 'easy-monitor';
import 'reflect-metadata';
import './child_process';
import './https';
import './server';
import './tcp';
import './tls';
import './udp';
import './websocket';
// import Async from './util/async';

if (process.env.NODE_RUN === 'debugger') {
    easyMonitor('dsc');
}

console.log(process.pid);
// (async () => {
//     const async = new Async();

//     try {
//         const result = await async.seriesLimit(
//             [
//                 (callback) => {
//                     setTimeout(() => {
//                         callback(1, 2);
//                     }, 2000);
//                 },
//                 (callback) => {
//                     setImmediate(() => {
//                         callback(7, 8);
//                     });
//                 },
//                 (callback) => {
//                     setTimeout(() => {
//                         callback(10, 20);
//                     }, 2500);
//                 },
//                 (callback) => {
//                     callback(Symbol(10));
//                 },
//                 (callback) => {
//                     process.nextTick(() => {
//                         callback(false);
//                     });
//                 }
//             ],
//             {
//                 limit: 2,
//                 time: 3000
//             }
//         );

//         console.log(result);
//     } catch (error) {
//         console.log(error);
//     }
// })();

