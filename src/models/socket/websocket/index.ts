// tslint:disable:no-magic-numbers
import { Listen } from '@src/config/server_config';
import crypto from 'crypto';
import http, { IncomingMessage } from 'http';
import { Socket } from 'net';

export interface Frame {
    /**
     * 是否结束
     */
    isFinal: boolean;
    /**
     * 操作码 0: 附加帧 1: 文本帧 2: 二进制帧 3-7: 保留作为未来的非控制帧 8: 关闭帧 9: ping 帧 10: pong 帧 11-15: 保留作为未来的控制帧
     */
    opcode: number;
    /**
     * 是否为掩码
     */
    masked: boolean;
    /**
     * 0-125: 实际负载数据长度  126: 接下来的两字节对应的无符号整数作为负载长度  127: 扩展的 8 字节对应的无符号帧数作为负载长度
     */
    payloadLen: number;
    /**
     * 如果 MASK 为 1 时，后续的四字节作为 Masking-key，MASK 为 0 时则缺省 Masking-key
     */
    maskingKey: number[] | null;
    /**
     * (x+y) bytes 负载数据  Extension data (x bytes): 扩展数据通常来说是 0 字节，除非协商了一个扩展  Application data (y bytes): 应用数据
     */
    payloadData: null | Uint8Array | string;
}

export default abstract class WebSocket {
    protected server = http.createServer();

    public constructor() {
        this.init();
        this.listen();
    }

    protected init() {
        this.server.on('upgrade', (req: IncomingMessage, socket: Socket, _upgradeHead: Buffer) => {
            // 固定GUID
            const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

            // 获取客户端返回的 key 与 GUID 进行 sha1 编码后获取 base64 格式摘要
            let key = req.headers['sec-websocket-key'];
            key = crypto
                .createHash('sha1')
                .update(key + GUID)
                .digest('base64');

            // 返回 101 协议切换响应
            const resMsg = [
                'HTTP/1.1 101 Switching Protocols',
                'Upgrade: websocket',
                'Connection: Upgrade',
                'Sec-WebSocket-Accept: ' + key,
                '\r\n'
            ].join('\r\n');

            this.onConnetion(socket, req);

            // 数据立即发送
            socket.setNoDelay(true);
            socket.write(resMsg);

            socket.send = (
                option: Partial<Pick<Frame, 'isFinal' | 'opcode' | 'payloadData'>> & { payloadData: string }
            ) => {
                if (option.opcode) {
                    option.opcode = 1;
                }
                if (option.isFinal === undefined) {
                    option.isFinal = true;
                }

                const data = this.encodeWsFrame(option as Pick<Frame, 'isFinal' | 'opcode' | 'payloadData'>);

                socket.write(data);
            };

            socket.on('data', (e) => {
                const frame = this.decodeWsFrame(e);
                const frameArr = []; // 用来保存分片帧的数组
                let totalLen = 0; // 记录所有分片帧负载叠加的总长度
                if (frame.isFinal) {
                    // 分片的终止帧
                    if (frame.opcode === 0) {
                        frameArr.push(frame);
                        totalLen += frame.payloadLen;

                        const frameItem = frameArr[0];
                        const payloadDataArr = frameArr
                            .filter((frame) => frame.payloadData)
                            .map((frame) => frame.payloadData);
                        // 将所有分片负载合并
                        if (payloadDataArr) frameItem.payloadData = Buffer.concat(payloadDataArr as Uint8Array[]);
                        frameItem.payloadLen = totalLen;
                        // 根据帧类型进行处理
                        this.onData(socket, frame);
                        frameArr.length = 0;
                        totalLen = 0;
                    } else {
                        // 普通帧
                        this.onData(socket, frame);
                    }
                } else {
                    // 分片起始帧与附加帧
                    frameArr.push(frame);
                    totalLen += frame.payloadLen;
                }
            });

            socket.on('error', (err) => {
                this.onError(socket, err);
            });

            socket.on('close', (e) => {
                this.onClose(socket, e);
            });
        });
    }

    protected abstract onConnetion(socket: Socket, req: IncomingMessage): void;

    protected abstract onData(socket: Socket, data: Frame): void;

    protected abstract onError(socket: Socket, err: Error): void;

    protected abstract onClose(socket: Socket, err: boolean): void;

    /**
     * 解码操作
     */
    protected decodeWsFrame(data: Buffer) {
        // 游标
        let start = 0;
        // 定义帧字段格式
        const frame: Frame = {
            isFinal: (data[start] & 0x80) === 0x80,
            opcode: data[start++] & 0xf,
            masked: (data[start] & 0x80) === 0x80,
            payloadLen: data[start++] & 0x7f,
            maskingKey: null,
            payloadData: null
        };
        // 接下来的两字节对应的无符号整数作为负载长度
        if (frame.payloadLen === 126) {
            frame.payloadLen = (data[start++] << 8) + data[start++];
        } else if (frame.payloadLen === 127) {
            // 扩展的 8 字节对应的无符号整数作为负载长度
            frame.payloadLen = 0;
            for (let i = 7; i >= 0; --i) {
                frame.payloadLen += data[start++] << (i * 8);
            }
        }

        if (frame.payloadLen) {
            // 如果使用了掩码
            if (frame.masked) {
                // 掩码键
                const maskingKey = [data[start++], data[start++], data[start++], data[start++]];

                frame.maskingKey = maskingKey;
                // 负载数据与四字节的掩码键的每一个字节轮流进行按位抑或运算
                frame.payloadData = data
                    .slice(start, start + frame.payloadLen)
                    .map((byte, idx) => byte ^ maskingKey[idx % 4]);
            } else {
                frame.payloadData = data.slice(start, start + frame.payloadLen);
            }
        }

        return frame;
    }

    // 编码ws帧
    protected encodeWsFrame(data: Pick<Frame, 'isFinal' | 'opcode' | 'payloadData'>) {
        const isFinal = data.isFinal !== undefined ? data.isFinal : true; // 没有 isFinal 字段默认为终止帧
        const opcode = data.opcode !== undefined ? data.opcode : 1; // 默认编码为文本帧
        const payloadData = data.payloadData ? Buffer.from(data.payloadData) : null;
        const payloadLen = payloadData ? payloadData.length : 0;

        const frame: number[] = [];

        // 帧的第一个字节
        if (isFinal) frame.push((1 << 7) + opcode);
        else frame.push(opcode);

        // 帧的负载长度处理
        if (payloadLen < 126) {
            frame.push(payloadLen);
        } else if (payloadLen < 65536) {
            frame.push(126, payloadLen >> 8, payloadLen & 0xff);
        } else {
            frame.push(127);
            for (let i = 7; i >= 0; --i) {
                frame.push((payloadLen & (0xff << (i * 8))) >> (i * 8));
            }
        }

        // 合并头部和负载数据
        const frameData = payloadData ? Buffer.concat([Buffer.from(frame), payloadData]) : Buffer.from(frame);

        console.dir(this.decodeWsFrame(frameData));
        return frameData;
    }

    protected listen() {
        this.server.listen(Listen.WEB_SOCKET_PORT);
    }
}
