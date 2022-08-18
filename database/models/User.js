module.exports = (database, type) => {
    return database.define('users', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: type.STRING(100),
        password: type.STRING(250)
    });
};