module.exports = (database, type) => {
    return database.define('moviesOrSeries', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: type.STRING(100),
            allowNull: false
        },
        createdDate: type.DATE,
        rating: type.INTEGER.UNSIGNED,
        image: type.STRING(250)
    });
};