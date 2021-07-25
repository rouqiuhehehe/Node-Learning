declare module 'express-session' {
    interface sessionMessages {
        type: string;
        message: string;
    }
    export interface SessionData {
        messages: sessionMessages[];
        uid: number;
        authorization: string;
    }
}

export {};
