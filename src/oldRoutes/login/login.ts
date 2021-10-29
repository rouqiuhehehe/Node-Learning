import { Status } from '@src/config/server_config';
import autoBind from '@src/descriptor/autobind';
import LoginMiddware from '@src/middleware/login';
import HttpError from '@src/models/httpError';
import process_request from '@src/models/process_request';
import User from '@src/models/user';
import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
@autoBind
export default class Login {
    // private static

    @process_request.Get('/login')
    public renderLoginPage(_req: Request, res: Response, next: NextFunction) {
        const title = 'Login';
        try {
            res.render('login', { title, crypto });
        } catch (e: any) {
            next(new HttpError(Status.SERVER_ERROR, e));
        }
    }

    @process_request.Post('/login', LoginMiddware.loginUserCheck)
    public async loginUser(req: Request, res: Response) {
        const { username, password } = req.body;

        try {
            req.session.uid = await User.authenticate({
                username,
                password
            });
            req.session.authorization = 'Bearer ' + (await User.issueToken(req.session.uid));

            if (process.env.NODE_ENV === 'development') {
                res.cookie('authorization', req.session.authorization, {
                    // tslint:disable-next-line: no-magic-numbers
                    maxAge: 1000 * 60 * 60 * 4,
                    signed: true,
                    httpOnly: true
                });
                res.cookie('uid', req.session.uid, {
                    // tslint:disable-next-line: no-magic-numbers
                    maxAge: 1000 * 60 * 60 * 4,
                    signed: true,
                    httpOnly: true
                });
            }
            res.redirect(`/ejs/entries?title=${username}&name=${username}`);
        } catch (e: any) {
            res.error(e.message ?? e);
            res.redirect('back');
        }
    }

    @process_request.Get('/logout')
    public logout(req: Request, res: Response, next: NextFunction) {
        req.session.destroy((err) => {
            if (err) {
                next(new HttpError(Status.SERVER_ERROR, err.message ?? err, err));
            } else {
                res.redirect('/login');
            }
        });
    }
}
