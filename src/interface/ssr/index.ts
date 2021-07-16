import { Status } from '@src/config/server_config';
import HttpError from '@src/models/httpError';
import Util from '@util';
import { Node } from 'domhandler';
import { DomHandler, Parser } from 'htmlparser2';

export default class {
    public constructor(private fileUrl: string) {}

    public getHtml(fn: (dom: Node[]) => void) {
        Util.readFile(this.fileUrl, (data) => {
            const handler = new DomHandler((err, dom) => {
                if (err) {
                    Util.hadError(new HttpError(Status.SERVER_ERROR, err.message, err));
                }
                fn(dom);
            });
            const parser = new Parser(handler);

            parser.parseComplete(data.toString());
        });
    }
}
