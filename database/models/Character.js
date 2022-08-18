module.exports = (database, type) => {
    return database.define('characters', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: type.STRING(50),
            allowNull: false
        },
        age: type.INTEGER.UNSIGNED,
        weight: type.DECIMAL(10, 2),
        history: type.STRING(500),
        image: type.STRING(250)
    });
};