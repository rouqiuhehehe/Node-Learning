import Util from '@util';
import { DomHandler, Parser } from 'htmlparser2';

export default class {
    public constructor(private fileUrl: string) {}

    public getHtml() {
        Util.readFile(this.fileUrl, (data) => {
            const handler = new DomHandler((err, dom) => {
                if (err) {
                    Util.hadError(err);
                }
                console.log(dom);
            });
            const parser = new Parser(handler);

            parser.parseComplete(data.toString());
        });
    }
}
