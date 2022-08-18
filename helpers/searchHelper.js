const { Op } = require('sequelize');

const { Character, MovieOrSerie, Genre } = require('../database');

const searchCharacter = async (req, res) => {
    const { name, age, weight, movies } = req.query;  
    
    let where = {};
    if(name) {
        where.name = { [Op.like]: [`%${name}%`] };
    }
    if(age) {
        where.age = age;
    }
    if(weight) {
        where.weight = weight;
    }
    if(movies) {
        where.include = {
            model: MovieOrSerie,
            through: { where: { movieOrSerieId: movies }, attributes: [] }
        };
    }

    let moviesOrSeries = movies ? await Character.findAll( where )
        .then(results => {
            let resultsMap = {};
            results.forEach(result => {
                resultsMap[result.id] = result.moviesOrSeries;
            });
            return resultsMap;
        }) : {};
    delete where.include;

    let characters = await Character.findAll({ where })
        .then(characters => {
            return characters.map(character => {
                character.weight = parseFloat(character.weight);

                if(movies && Object.keys(moviesOrSeries).length && moviesOrSeries[character.id].length) {
                    character.dataValues.moviesOrSeries = moviesOrSeries[character.id];
                    return character;
                } else if(!movies) {
                    return character;
                }
            });
        });
    characters = characters.filter(character => { if(character !== null) return character; });

    if(!characters.length) {
        return res.status(204).json({ result: 'error', errorMessage: [ 'No characters found with specified filters' ]});
    }

    return res.status(200).json({ result: 'success', characters });
}

const searchMovie = async (req, res) => {

}

module.exports = { 
    searchCharacter,
    searchMovie
};