import Util from '@util';
import { DomHandler, Parser } from 'htmlparser2';
import { Node } from 'domhandler';

export default class {
    public constructor(private fileUrl: string) {}

    public getHtml(fn: (dom: Node[]) => void) {
        Util.readFile(this.fileUrl, (data) => {
            const handler = new DomHandler((err, dom) => {
                if (err) {
                    Util.hadError(err);
                }
                fn(dom);
            });
            const parser = new Parser(handler);

            parser.parseComplete(data.toString());
        });
    }
}
