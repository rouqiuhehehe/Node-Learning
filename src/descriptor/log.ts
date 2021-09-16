import { Status } from '@src/config/server_config';
import Morgan from '@src/middleware/morgan';
import HttpError from '@src/models/httpError';
import { DefaultMiddleWareType, MiddleWareArray } from '@src/models/routes';
import { Middleware } from '@src/types/middleware_type';
import Util, { DescriptorKey } from '@util';
import path from 'path';
import { ControllerMetadata, Route } from './controller';

const logger = new Morgan(path.join(__dirname, '../../log/info'));

const repeatDefineError = new HttpError(Status.SERVER_ERROR, '父路由定义过的中间件不允许在子路由重复定义');

export const findFatherClass = (target: Object, cb: (v: Object) => boolean) => {
    const father = Object.getPrototypeOf(target);

    if (father) {
        if (cb(father)) {
            return father;
        } else {
            findFatherClass(father, cb);
        }
    }
};

const classLogHandler = (target: Object, type: DefaultMiddleWareType, middleware: Middleware) => {
    if (Reflect.hasMetadata('middleware', target)) {
        const middleware: MiddleWareArray[] = Reflect.getMetadata('middleware', target);
        if (!Reflect.hasOwnMetadata('middleware', target)) {
            if (middleware.some((v) => v.type === type)) {
                throw repeatDefineError;
            }
        } else {
            const father = findFatherClass(target, (v) => {
                const middleware = Reflect.getOwnMetadata('middleware', v) as MiddleWareArray[];
                return middleware && middleware.some((i) => i.type === type);
            });

            if (father) {
                throw repeatDefineError;
            }
        }
    } else {
        Reflect.defineMetadata('middleware', [], target);
    }

    Reflect.getOwnMetadata('middleware', target).push({
        type: DefaultMiddleWareType.LOG,
        target,
        fn: middleware
    });
};

const methodLogHandler = (target: Object, propertyKey: string | symbol, type: DefaultMiddleWareType) => {
    if (Reflect.hasMetadata('middleware', target.constructor)) {
        const middleware: MiddleWareArray[] = Reflect.getMetadata('middleware', target.constructor);

        // 如果自己没有middleware，则认为middleware是父级拿到的
        if (!Reflect.hasOwnMetadata('middleware', target, propertyKey)) {
            if (middleware.some((v) => v.type === type)) {
                throw repeatDefineError;
            }
        } else {
            // 自己有middleware，则遍历父级，如果有相同middleware则报错
            const father = findFatherClass(target, (v) => {
                const middleware = Reflect.getOwnMetadata('middleware', v) as MiddleWareArray[];
                return middleware && middleware.some((i) => i.type === type);
            });

            if (father) {
                throw repeatDefineError;
            }
        }
    }
};

function Log(dev?: 'dev') {
    return (target: Object, propertyKey?: string | symbol, descriptor?: PropertyDescriptor) => {
        Util.middlewareDescriptor(target, propertyKey, descriptor, (result) => {
            if (result === DescriptorKey.CLASS) {
                if (dev === 'dev') {
                    if (process.env.NODE_ENV === 'development') {
                        classLogHandler(target, DefaultMiddleWareType.LOG, logger.useLogger());
                    }
                } else {
                    classLogHandler(target, DefaultMiddleWareType.LOG, logger.useLogger());
                }
            } else {
                if (dev === 'dev') {
                    if (process.env.NODE_ENV === 'development') {
                        const routes = Reflect.getMetadata(ControllerMetadata.ROUTES, target) as Route[];

                        if (routes instanceof Array && routes.length) {
                            methodLogHandler(target, propertyKey!, DefaultMiddleWareType.LOG);
                            routes.forEach((v) => {
                                // tslint:disable-next-line: no-unused-expression
                                v.propertyKey === propertyKey &&
                                    (v.middleWare ?? (v.middleWare = [])).push(logger.useLogger());
                            });
                        } else {
                            throw new HttpError(
                                Status.SERVER_ERROR,
                                routes + ' is not an array, is maybe that the descriptor in the wrong order'
                            );
                        }
                    }
                } else {
                    const routes = Reflect.getMetadata(ControllerMetadata.ROUTES, target) as Route[];

                    if (routes instanceof Array && routes.length) {
                        methodLogHandler(target, propertyKey!, DefaultMiddleWareType.LOG);
                        routes.forEach((v) => {
                            // tslint:disable-next-line: no-unused-expression
                            v.propertyKey === propertyKey &&
                                (v.middleWare ?? (v.middleWare = [])).push(logger.useLogger());
                        });
                    } else {
                        throw new HttpError(
                            Status.SERVER_ERROR,
                            routes + ' is not an array, is maybe that the descriptor in the wrong order'
                        );
                    }
                }
            }
        });
    };
}
export default Log;
