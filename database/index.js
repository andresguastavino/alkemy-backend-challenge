require('dotenv').config();
const { NODE_ENV } = process.env;

const CharacterModel = require('./models/Character');
const GenreModel = require('./models/Genre');
const MovieOrSerieModel = require('./models/MovieOrSerie');
const UserModel = require('./models/User');

const Sequelize = require('sequelize');
const database_config = require('./config')(process);
const database = new Sequelize(database_config[NODE_ENV]);

const Character = CharacterModel(database, Sequelize);
const Genre = GenreModel(database, Sequelize);
const MovieOrSerie = MovieOrSerieModel(database, Sequelize);
const User = UserModel(database, Sequelize);

database.sync({ force: NODE_ENV === 'test' });

module.exports = {
    Character,
    Genre,
    MovieOrSerie,
    User
};
