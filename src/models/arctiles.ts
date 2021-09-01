import { OkPacket } from 'mysql';
import db from '../bin/db';

interface ArctilesData {
    title: string;
    content: string;
}

export default class Arctiles {
    private db = new db();

    public async all() {
        return await this.db.asyncQuery('select * from articles');
    }

    public async find(id: string) {
        return await this.db.asyncQuery('select * from articles where `id` = ?', [id]);
    }

    public async insert(data: ArctilesData) {
        const result = (
            await this.db.asyncQuery<OkPacket>('insert into articles (`title`, `content`) values (?,?)', [
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
        const result = (await this.db.asyncQuery<OkPacket>('delete from articles where `id` = ?', [id])).result;

        if (result.affectedRows === 1) {
            return true;
        } else {
            return false;
        }
    }
}
