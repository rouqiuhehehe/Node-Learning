import { Frame } from '@src/models/socket/websocket';

declare module 'net' {
    interface Socket {
        send: (e: Partial<Pick<Frame, 'isFinal' | 'opcode' | 'payloadData'>> & { payloadData: string }) => void;
    }
}
