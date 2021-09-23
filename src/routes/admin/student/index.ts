import autoBind from '@src/descriptor/Autobind';
import { Controller, Get } from '@src/descriptor/controller';
import Login from '@src/descriptor/login';
import { Request, Response } from 'express';
import admin from '..';

@Controller('/student')
export default class extends admin {
    @autoBind
    @Login
    @Get('/')
    public indexPage(_req: Request, res: Response) {
        res.send(`<h1>${this.homePageRender()}</h1>`);
    }

    @Get('/dsc')
    public testPage(_req: Request, res: Response) {
        res.send('dsc');
    }

    private homePageRender() {
        return 'this is student homepage, welcome!';
    }
}
