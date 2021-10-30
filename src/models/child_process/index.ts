import autoBind from '@src/descriptor/autobind';
import childProcess from 'child_process';
import net from 'net';
import os from 'os';
import path from 'path';

/*
    类型         回调/异常    进程类型     执行类型         可设置超时
    spawn()         X          任意        命令              X
    exec()          √          任意        命令              √
    execFile()      X          任意      可执行文件           √
    fork()          √          node     JavaScript文件       X
*/
const port = 1337;
export default class ChildProcess {
    protected cpus = os.cpus();
    protected server;

    public constructor() {
        // 创建tcp服务，发射给子进程
        this.server = net.createServer().listen(port, this.forkChildProcess);
    }

    @autoBind
    protected forkChildProcess() {
        let i = 0;
        const arr = [0, 0];
        arr.forEach(() => {
            const cp = childProcess.fork(path.join(__dirname, './work.ts'));

            cp.on('message', (msg) => {
                if (msg === 'init') {
                    cp.send('tcp', this.server);
                    i++;

                    if (i === arr.length) {
                        // 发射完成后，关闭主进程tcp服务
                        this.server.close();
                    }
                }
            });
        });
    }
}
