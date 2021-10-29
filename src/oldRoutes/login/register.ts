import { Status } from '@src/config/server_config';
import { RegisterError } from '@src/config/user_error';
import LoginMiddware from '@src/middleware/login';
import HttpError from '@src/models/httpError';
import process_request from '@src/models/process_request';
import User from '@src/models/user';
import { NextFunction, Request, Response } from 'express';
export default class Register {
    // public static

    @process_request.Get('/register')
    public renderRegisterPage(_req: Request, res: Response, next: NextFunction) {
        const title = 'Register';

        try {
            res.render('register', { title });
        } catch (e: any) {
            next(new HttpError(Status.SERVER_ERROR, e));
        }
    }

    @process_request.Post('/register', LoginMiddware.addUserMiddleware)
    public async addUser(req: Request, res: Response, next: NextFunction) {
        const { username, password } = req.body;

        try {
            const user = await User.getByUsername(username);
            if (user && user.userInfo.id) {
                res.error(RegisterError.USERNAME_WAS_USED);
                res.redirect('back');
            } else {
                const user = new User({
                    username,
                    password
                });
                await user.save();
                res.redirect('/login');
            }
        } catch (e: any) {
            next(new HttpError(Status.SERVER_ERROR, e));
        }
    }
}
