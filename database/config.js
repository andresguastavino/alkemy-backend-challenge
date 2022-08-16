module.exports = (process) => {
    const { 
        DATABASE_NAME_DEV, 
        DATABASE_NAME_TEST, 
        DATABASE_NAME_PROD, 
        DATABASE_USERNAME, 
        DATABASE_PASSWORD, 
        DATABASE_HOST, 
        DATABASE_PORT,
        DATABASE_DIALECT
    } = process.env;

    return {
        dev: {
            name: DATABASE_NAME_DEV,
            username: DATABASE_USERNAME,
            password: DATABASE_PASSWORD,
            host: DATABASE_HOST,
            port: DATABASE_PORT,
            dialect: DATABASE_DIALECT
        },
        test: {
            name: DATABASE_NAME_TEST,
            username: DATABASE_USERNAME,
            password: DATABASE_PASSWORD,
            host: DATABASE_HOST,
            port: DATABASE_PORT,
            dialect: DATABASE_DIALECT
        },
        prod: {
            name: DATABASE_NAME_PROD,
            username: DATABASE_USERNAME,
            password: DATABASE_PASSWORD,
            host: DATABASE_HOST,
            port: DATABASE_PORT,
            dialect: DATABASE_DIALECT
        }
    };
};