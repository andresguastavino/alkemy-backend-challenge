module.exports = (database, type) => {
    return database.define('characters_movies_or_series', {
        movieOrSerieId: {
            type: type.INTEGER,
            references: {
                model: 'moviesOrSeries',
                key: 'id'
            },
            allowNull: false
        },
        characterId: {
            type: type.INTEGER,
            references: {
                model: 'characters',
                key: 'id'
            },
            allowNull: false
        }
    }); 
};