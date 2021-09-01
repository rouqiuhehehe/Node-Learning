import { NextFunction, Request, Response } from 'express';

class EjsMiddware {
    public async entriesPage(req: Request, res: Response, next: NextFunction) {
        const { page } = req.params;
        const prepage = Math.max(parseInt(page ?? '1', 10), 1) - 1;
        const LIMIT = 10;

        res.locals.page = {
            prepage,
            from: prepage * LIMIT,
            to: prepage * LIMIT + LIMIT,
            count: LIMIT
        };
        next();
    }
}
export default new EjsMiddware();
