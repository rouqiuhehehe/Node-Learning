import { Status } from '@src/config/server_config';
import HttpError from '@src/models/httpError';
import process_request from '@src/models/process_request';
import User from '@src/models/user';
import { NextFunction, Request, Response } from 'express';

export default class {
    @process_request.Get('/api/user/:id')
    public async getUserInfo(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            if (!id) {
                next(new HttpError(Status.SERVER_ERROR, 'id must be required'));
            }
            const userInfo = await User.getById(+id);
            res.json(userInfo);
        } catch (e: any) {
            next(new HttpError(Status.SERVER_ERROR, e.message, e));
        }
    }
}
