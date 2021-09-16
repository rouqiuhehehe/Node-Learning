import { ControllerMetadata, Route } from '@src/descriptor/controller';
import { findFatherClass } from '@src/descriptor/log';
import { Middleware } from '@src/types/middleware_type';
import express, { NextFunction, Request, Response } from 'express';
import fsPromise from 'fs/promises';
import path from 'path';

// tslint:disable: no-unused-expression

export enum DefaultMiddleWareType {
    LOG = 'log',
    CUSTOM = 'custom'
}

export interface MiddleWareArray {
    target: any;
    type: DefaultMiddleWareType;
    fn: (req: Request, res: Response, next: NextFunction) => void;
}

export const scanController = (dirPath: string, route: express.Application) => {
    return new Promise(async (resole, reject) => {
        try {
            // 检测目录是否存在
            await fsPromise.access(dirPath);

            const fileName = await fsPromise.readdir(dirPath);

            try {
                for (const name of fileName) {
                    const curPath = path.join(dirPath, name);
                    const dirStat = await fsPromise.stat(curPath);

                    if (dirStat.isDirectory()) {
                        await scanController(curPath, route);
                        continue;
                    }

                    if (!/(\.js|\.ts)$/.test(curPath)) {
                        continue;
                    }

                    try {
                        const module = await import(`${curPath}`);
                        const controller = module.default ?? module;

                        if (controller && controller.prototype) {
                            // 路由懒加载，先加载中间件
                            process.nextTick(() => {
                                // 判断是否存在basepath 以及路由，如果没有默认理解为不是路由类
                                const isController = Reflect.hasMetadata(ControllerMetadata.BASEPATH, controller);
                                // 导入时，方法装饰器挂载的元数据在prototype上
                                const hasRoutes = Reflect.hasMetadata(ControllerMetadata.ROUTES, controller.prototype);
                                const hasHomePath = Reflect.hasMetadata(ControllerMetadata.HOMEPATH, controller);
                                const hasStaticRoutes = Reflect.hasMetadata(ControllerMetadata.ROUTES, controller);
                                const basePath = Reflect.getMetadata(ControllerMetadata.BASEPATH, controller);
                                const homePath = Reflect.getMetadata(ControllerMetadata.HOMEPATH, controller);

                                if (Reflect.hasMetadata('middleware', controller)) {
                                    const ownMiddleware = Reflect.getOwnMetadata('middleware', controller);
                                    const middleware = Reflect.getMetadata(
                                        'middleware',
                                        controller
                                    ) as MiddleWareArray[];

                                    // 判断装饰器是否挂载在父级路由上
                                    if (!ownMiddleware || ownMiddleware !== middleware) {
                                        const customMiddleware: Middleware[] = [];

                                        middleware
                                            .filter((v) => {
                                                if (v.type === DefaultMiddleWareType.CUSTOM) {
                                                    customMiddleware.push(v.fn);
                                                    return false;
                                                }
                                                return true;
                                            })
                                            .forEach((v) => {
                                                // 找到父级挂载的中间件
                                                const target = findFatherClass(controller, (i) => {
                                                    if (i === v.target) {
                                                        return true;
                                                    }
                                                    return false;
                                                });

                                                if (target) {
                                                    const basePath = Reflect.getMetadata(
                                                        ControllerMetadata.BASEPATH,
                                                        target
                                                    );
                                                    const homePath = Reflect.getMetadata(
                                                        ControllerMetadata.HOMEPATH,
                                                        target
                                                    );
                                                    const realPath = path.posix.join(homePath, basePath ?? '');

                                                    Reflect.deleteMetadata('middleware', target);
                                                    route.use(realPath, v.fn);
                                                } else {
                                                    throw new Error('unkonw Error');
                                                }
                                            });

                                        customMiddleware.length &&
                                            route.use(path.posix.join(homePath, basePath ?? ''), ...customMiddleware);
                                    } else {
                                        route.use(
                                            path.posix.join(homePath, basePath ?? ''),
                                            ...(
                                                (Reflect.getOwnMetadata('middleware', controller) ??
                                                    []) as MiddleWareArray[]
                                            ).map((v) => v.fn)
                                        );
                                    }
                                }

                                if (isController && hasHomePath && (hasRoutes || hasStaticRoutes)) {
                                    const routes = [
                                        ...(Reflect.getOwnMetadata(ControllerMetadata.ROUTES, controller.prototype) ??
                                            []),
                                        ...(Reflect.getOwnMetadata(ControllerMetadata.ROUTES, controller) ?? [])
                                    ] as Route[];

                                    routes.forEach((v) => {
                                        // 做字符串兼容
                                        const curPath = path.posix
                                            .join(homePath, basePath, v.path)
                                            .replace(new RegExp('/$'), '');
                                        const controllerInstance = new controller();

                                        const callback = controllerInstance[v.propertyKey].bind(controllerInstance);

                                        route[v.method](curPath, ...(v.middleWare ?? []), callback);
                                    });
                                }
                            });
                        }
                    } catch (error) {
                        reject(error);
                    }
                }
                resole(route);
            } catch (error) {
                reject(error);
            }
        } catch (error) {
            reject(path + ' does not exist');
        }
    });
};
