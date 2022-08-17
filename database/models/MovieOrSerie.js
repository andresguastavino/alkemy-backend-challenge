module.exports = (database, type) => {
    return database.define('movies_or_series', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: type.STRING(100),
            allowNull: false
        },
        created_date: type.DATE,
        rating: type.INTEGER.UNSIGNED,
        image: type.STRING
    });
};