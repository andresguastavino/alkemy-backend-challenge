module.exports = (database, type) => {
    return database.define('characters_movies_or_series', {
        m_or_s_id: {
            type: type.INTEGER,
            references: {
                model: 'movies_or_series',
                key: 'id'
            },
            allowNull: false
        },
        character_id: {
            type: type.INTEGER,
            references: {
                model: 'characters',
                key: 'id'
            },
            allowNull: false
        }
    }); 
};