import { Status } from '@src/config/server_config';
import HttpError from '@src/models/httpError';
import process_request from '@src/models/process_request';
import Upload from '@src/models/upload';
import { NextFunction, Request, Response } from 'express';

export default class {
    @process_request.Get('/admin/upload/img')
    public uploadImgRender(_req: Request, res: Response, next: NextFunction) {
        try {
            res.render('upload-img');
        } catch (e: any) {
            next(new HttpError(Status.SERVER_ERROR, e.message, e));
        }
    }

    @process_request.Post('/admin/upload/img')
    public async uploadImg(req: Request, res: Response) {
        new Upload('uploads', [
            {
                fileId: 'img',
                rule: '.png|.jpeg|.bmp|.svg|.jpg|.jfif',
                storageAddress: 'img'
            },
            {
                fileId: 'txt',
                rule: 'txt',
                storageAddress: 'desc'
            }
        ]).fields([
            {
                name: 'img',
                maxCount: 1
            },
            {
                name: 'txt',
                maxCount: 1
            }
        ])(req, res, (err) => {
            const { user } = req;
            const { title, desc } = req.body;

            // const {img: [{path: imgPath}], txt: [{path: txtPath}]} = req.files

            if (err) {
                res.error(err.message);

                res.redirect('back');
            } else {
                req.session.success = {
                    message: 'success upload!!'
                };
                res.redirect('/admin/success');
            }
        });
    }
}
