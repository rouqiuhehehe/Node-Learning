import { NextFunction, Request, Response } from 'express';

export default (arg: (keyof Request)[]) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        console.log(process.env.NODE_ENV);

        for (const item of arg) {
            if (Object.prototype.hasOwnProperty.call(req, item)) {
                console.log(req[item], item);
            }
        }
        next();
    };
};
