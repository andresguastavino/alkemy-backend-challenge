module.exports = (database, type) => {
    return database.define('genres', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: type.STRING(50),
            allowNull: false
        },
        movies_or_series: type.JSON,
        image: type.STRING
    });
};