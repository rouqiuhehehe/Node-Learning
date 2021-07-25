import { Status } from '@src/config/server_config';
import { RegisterError } from '@src/config/user_error';
import HttpError from '@src/models/httpError';
import process_request from '@src/models/process_request';
import User from '@src/models/user';
import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

export default class Register {
    public static addUserMiddleware(req: Request, res: Response, next: NextFunction) {
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

    @process_request.Get('/register')
    public renderRegisterPage(_req: Request, res: Response, next: NextFunction) {
        const title = 'Register';

        try {
            res.render('register', { title });
        } catch (e) {
            next(new HttpError(Status.SERVER_ERROR, e));
        }
    }

    @process_request.Post('/register', Register.addUserMiddleware)
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
        } catch (e) {
            next(new HttpError(Status.SERVER_ERROR, e));
        }
    }
}
