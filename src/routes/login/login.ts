import { Status } from '@src/config/server_config';
import HttpError from '@src/models/httpError';
import process_request from '@src/models/process_request';
import User from '@src/models/user';
import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

export default class Login {
    private static loginUserCheck(req: Request, res: Response, next: NextFunction) {
        const schema = Joi.object({
            // tslint:disable-next-line:no-magic-numbers
            username: Joi.string().required().min(4).max(20),
            // tslint:disable-next-line:no-magic-numbers
            password: Joi.string().required().min(6).max(16)
        });

        const { error } = schema.validate(req.body);

        if (error) {
            res.error(error.message);
            res.redirect('back');
        } else {
            next();
        }
    }

    @process_request.Get('/login')
    public renderLoginPage(_req: Request, res: Response, next: NextFunction) {
        const title = 'Login';

        try {
            res.render('login', { title });
        } catch (e) {
            next(new HttpError(Status.SERVER_ERROR, e));
        }
    }

    @process_request.Post('/login', Login.loginUserCheck)
    public async loginUser(req: Request, res: Response) {
        const { username, password } = req.body;

        try {
            req.session.uid = await User.authenticate({
                username,
                password
            });
            req.session.authorization = 'Bearer ' + (await User.issueToken(req.session.uid));
            res.redirect(`/ejs/entries?title=${username}&name=${username}`);
        } catch (e) {
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
