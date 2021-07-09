import { OkPacket } from 'mysql';
import * as db from './db';

interface ArctilesData {
    title: string;
    content: string;
}

export default class Arctiles {
    public static async all() {
        return await db.asyncQuery('select * from articles');
    }

    public static async find(id: string) {
        return await db.asyncQuery('select * from articles where `id` = ?', [id]);
    }

    public static async insert(data: ArctilesData) {
        const result = (await db.asyncQuery('insert into articles (`title`, `content`) values (?,?)', [
            data.title,
            data.content
        ])) as OkPacket;

        if (result.affectedRows === 1) {
            return true;
        } else {
            return false;
        }
    }

    public static async delete(id: string) {
        const result = (await db.asyncQuery('delete from articles where `id` = ?', [id])) as OkPacket;

        if (result.affectedRows === 1) {
            return true;
        } else {
            return false;
        }
    }
}
