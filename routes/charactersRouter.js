const router = require('express').Router();

const { Op } = require('sequelize');

const { Character, MovieOrSerie, CharacterMovieOrSerie } = require('../database');

const postValidations = require('../middlewares/charactersValidator');

router.get('/', async (req, res) => {
    const characters = await Character.findAll({
        attributes: [ 'id', 'name', 'image' ]
    });

    return res.status(200).json({ result: 'success', characters });
});

router.get('/search', async (req, res) => {
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

    let moviesOrSeries = movies ? await Character.findAll({ where })
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
});

router.get('/:characterId', async (req, res) => {
    const { characterId } = req.params;

    const character = await Character.findByPk(characterId, {
        include: {
            model: MovieOrSerie,
            through: { attributes: [] }
        }
    });
    if(character.weight) {
        character.weight = parseFloat(character.weight);
    }

    if(!character) {
        return res.status(204).json({ result: 'error', errors: [ `No character found with id ${ characterId}` ]});
    }

    return res.status(200).json({ result: 'success', character });
});

router.post('/', postValidations, async (req, res) => {
    const { errors } = req;
    if(errors.length) {
        return res.status(400).json({ result: 'error', errors });
    }

    const character = await Character.create(req.body);

    return res.status(201).json({ result: 'success', message: 'Character created succesfully', character });
});

router.put('/:characterId', async (req, res) => {
    const { characterId } = req.params;

    if(!characterId) {
        return res.status(400).json({ result: 'error', errors: [ `characterId not specified` ]});
    }

    let character = await Character.findByPk(characterId);
    if(!character) {
        return res.status(204).json({ result: 'error', errors: [ `No character found with id ${ characterId}` ]});
    }

    const { name, age, weight, history, image } = req.body;

    const updateFields = {};
    if(name) updateFields.name = name;
    if(age) updateFields.age = age;
    if(weight) updateFields.weight = weight;
    if(history) updateFields.history = history
    if(image) updateFields.image = image
    
    await character.update(updateFields);
    await character.save();
    
    return res.status(201).json({ result: 'success', message: 'Character updated succesfully', character });
});

router.delete('/:characterId', async (req, res) => {
    const { characterId } = req.params;

    if(!characterId) {
        return res.status(400).json({ result: 'error', errors: [ `characterId not specified` ]});
    }

    let character = await Character.findByPk(characterId);
    if(!character) {
        return res.status(204).json({ result: 'error', errors: [ `No character found with id ${ characterId}` ]});
    }

    character = await Character.destroy({
        where: { id: characterId }
    });

    return res.status(201).json({ result: 'success', message: 'Character deleted succesfully' });
});

module.exports = router;