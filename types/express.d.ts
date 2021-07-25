import { UserInfo } from '@src/types/user';

declare global {
    namespace Express {
        type Message = (message: string, type?: string) => void;
        interface Response {
            message: Message;
            error: (message: string) => void;
        }

        interface Request {
            user: UserInfo;
        }
    }
}
export {};
