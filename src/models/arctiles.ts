import { OkPacket } from 'mysql';
import Db from '../bin/db';

interface ArctilesData {
    title: string;
    content: string;
}
const db = new Db();
export default class Arctiles {
    public async all() {
        return await db.asyncQuery('select * from articles');
    }

    public async find(id: string) {
        return await db.asyncQuery('select * from articles where `id` = ?', [id]);
    }

    public async insert(data: ArctilesData) {
        const result = (
            await db.asyncQuery<OkPacket>('insert into articles (`title`, `content`) values (?,?)', [
                data.title,
                data.content
            ])
        ).result;

        if (result.affectedRows === 1) {
            return true;
        } else {
            return false;
        }
    }

    public async delete(id: string) {
        const result = (await db.asyncQuery<OkPacket>('delete from articles where `id` = ?', [id])).result;

        if (result.affectedRows === 1) {
            return true;
        } else {
            return false;
        }
    }
}
