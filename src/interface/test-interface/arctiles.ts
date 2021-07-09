import { ErrorMsg } from '@src/config/error';
import { Status } from '@src/config/server_config';
import Arctiles from '@src/models/arctiles';
import process_request from '@src/models/process_request';
import Util from '@util';
import { Request, Response } from 'express';

export default class {
    @process_request.Get('/arctiles')
    public async getArctiles(_req: Request, res: Response) {
        const data = await Arctiles.all();
        res.send({
            status: Status.SUCCESS,
            data,
            success: true
        });
    }

    @process_request.Get('/arctiles/:id')
    public async getArctile(req: Request, res: Response) {
        const id = req.params.id;
        const data = await Arctiles.find(id);

        res.send(Util.successSend(data));
    }

    @process_request.Post('/arctiles/:id')
    public async deleteArctile(req: Request, res: Response) {
        const id = req.params.id;
        const data = await Arctiles.delete(id);

        if (data) {
            res.send(Util.successSend(true));
        } else {
            Util.hadError(new ReferenceError(ErrorMsg.AFFECTEDROWS_ERROR), res);
        }
    }

    @process_request.Post('/arctiles/:id')
    public async insertArctile(req: Request, res: Response) {
        const id = req.params.id;
        const data = await Arctiles.delete(id);

        if (data) {
            res.send(Util.successSend(true));
        } else {
            Util.hadError(new ReferenceError(ErrorMsg.AFFECTEDROWS_ERROR), res);
        }
    }
}
