module.exports = (database, type) => {
    return database.define('characters_movies_or_series', {
        movie_or_serie_id: {
            type: type.INTEGER,
            references: {
                model: 'movies_or_series',
                key: 'id'
            }
        },
        character_id: {
            type: type.INTEGER,
            references: {
                model: 'characters',
                key: 'id'
            }
        }
    }); 
};