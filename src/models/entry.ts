import redis from '@src/bin/redis';

interface EntryParams {
    title: string;
    body: string;
    username: string;
}

export default class Entry {
    private static key = 'entries';

    // 游标分页
    // public static getRangeBycursor(cursor: number, count: number) {
    //     return new Promise((resolve, reject) => {
    //         redis.scan(cursor.toString(), 'MATCH', '*', 'COUNT', count.toString(), (err, data) => {
    //             if (err) {
    //                 reject(err);
    //             } else {
    //                 resolve(data);
    //             }
    //         });
    //     });
    // }

    public static getRange(
        start: number,
        end: number
    ): Promise<{
        data: EntryParams[];
        total: number;
        hasMore: boolean;
    }> {
        return new Promise((resolve, reject) => {
            redis.lrange(Entry.key, start, end, (err, items) => {
                if (err) {
                    return reject(err);
                }

                redis.llen(Entry.key, (err, reply) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            data: items.map((v) => {
                                return JSON.parse(v);
                            }),
                            total: reply,
                            hasMore: end < reply
                        });
                    }
                });
            });
        });
    }

    public constructor(private obj: EntryParams) {}

    public save() {
        const entryJSON = JSON.stringify(this.obj);

        return new Promise((resolve, reject) => {
            // 将给定值推入列表左侧
            redis.lpush(Entry.key, entryJSON, (err) => {
                if (err) {
                    reject(err);
                }
                resolve(true);
            });
        });
    }
}
