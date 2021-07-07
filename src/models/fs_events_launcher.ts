import events from 'events';
import fs from 'fs';

export default class extends events.EventEmitter {
    public constructor(private watchDir: string) {
        super();
    }

    public start() {
        fs.watch(
            this.watchDir,
            {
                recursive: true
            },
            (eventname, filename) => {
                this.emit('fileChange', eventname, filename);
            }
        );
    }

    // private watch() {
    //     fs.readdir(this.watchDir, (err, files) => {
    //         if (err) {
    //             Util.hadError(err);
    //         }
    //         for (const item of files) {
    //             this.emit('process', item);
    //         }
    //     });
    // }
}
