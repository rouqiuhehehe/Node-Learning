const enum dbConfig {
    HOST = 'localhost',
    USER = 'root',
    PASSWORD = 'jianv4as',
    DATABASE = 'Node_Learning',
    MULTIPLESTATEMENTS = 'true'
}

const enum dbPoolConfig {
    CONNECTIONLIMIT = 100
}

export default {
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DATABASE,
    multiplestatements: dbConfig.MULTIPLESTATEMENTS,
    connectionLimit: dbPoolConfig.CONNECTIONLIMIT
};
