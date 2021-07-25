// import async from './models/async';
import './server';
import './socket';

// listenRoutes();
// 串行多函数
// async.serialSerise([
//     (next) => {
//         setTimeout(() => {
//             console.log(1);
//             next();
//         }, 1000);
//     },
//     (next) => {
//         setTimeout(() => {
//             console.log(2);
//             next();
//         }, 100);
//     },
//     () => {
//         setTimeout(() => {
//             console.log(3);
//             // next();
//             // tslint:disable-next-line:no-magic-numbers
//         }, 2000);
//     }
// ]);
