import User from '@src/models/user';
import { NextFunction, Request, Response } from 'express';

export default class Auth {
    private static WHITE_URL = ['/login', '/register', '/favicon.ico', '/page', '/404', '/ejs/entries/get', '/pug'];

    public static async authMiddleware(req: Request, res: Response, next: NextFunction) {
        if (Auth.WHITE_URL.some((v) => new RegExp('^' + v).test(req.url))) {
            next();
        } else {
            try {
                await User.validateToken(req);
                next();
            } catch (e) {
                res.error(e.message);
                res.redirect('/login');
            }
        }
    }
}
