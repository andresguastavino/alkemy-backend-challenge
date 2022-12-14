require('dotenv').config();
const { NODE_ENV } = process.env;

const CharacterModel = require('./models/Character');
const GenreModel = require('./models/Genre');
const MovieOrSerieModel = require('./models/MovieOrSerie');
const CharacterMovieOrSerieModel = require('./models/CharacterMovieOrSerie');
const UserModel = require('./models/User');

const Sequelize = require('sequelize');
const database_config = require('./config');
const { database_name, username, password, host, port, dialect } = database_config;
const database = new Sequelize(database_name, username, password, { host, port, dialect});

const Character = CharacterModel(database, Sequelize);
const Genre = GenreModel(database, Sequelize);
const MovieOrSerie = MovieOrSerieModel(database, Sequelize);
const CharacterMovieOrSerie = CharacterMovieOrSerieModel(database, Sequelize);
const User = UserModel(database, Sequelize);

// relation between characters and movies or series
Character.belongsToMany(MovieOrSerie, { through: CharacterMovieOrSerie, foreignKey: 'characterId' });
MovieOrSerie.belongsToMany(Character, { through: CharacterMovieOrSerie, foreignKey: 'movieOrSerieId' });

// relation between genres and movies
Genre.hasMany(MovieOrSerie, {
    foreignKey: {
        name: 'genreId',
        allowNull: true
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
});
MovieOrSerie.belongsTo(Genre, {
    foreignKey: 'genreId'
});

database.sync({ force: NODE_ENV === 'test' });

module.exports = {
    Character,
    Genre,
    MovieOrSerie,
    CharacterMovieOrSerie,
    User
};
