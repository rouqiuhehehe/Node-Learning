import easyMonitor from 'easy-monitor';
import 'reflect-metadata';
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

// const classDescriptor = (target: Function) => {
//     console.log(target.name, 1);
// };

// const methodDescriptor = (target: Object, propertyKey: string | symbol, _descriptor: PropertyDescriptor) => {
//     process.nextTick(() => {
//         console.log(target.constructor.name, propertyKey, 2);

//         console.log(Reflect.getMetadata('a', target.constructor), 220);
//     });
// };

// const c = (target: Object, _name: string, _des: PropertyDescriptor) => {
//     console.log(Reflect.getMetadata('a', target.constructor), 70);
// };
// @Reflect.metadata('a', [])
// class A {}

// class B extends A {
//     @c
//     public b() {
//         //
//     }
// }

// console.log(Reflect.getMetadata('a', B) === Reflect.getOwnMetadata('a', A));

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
