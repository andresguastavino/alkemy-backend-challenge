const router = require('express').Router();

const { Op } = require('sequelize');

const { Character, MovieOrSerie, CharacterMovieOrSerie } = require('../database');

const { searchCharacter } = require('../helpers/searchHelper');

const { postValidations, putValidations, deleteValidations } = require('../middlewares/charactersValidator');

router.get('/', async (req, res) => {
    const characters = await Character.findAll({
        attributes: [ 'id', 'name', 'image' ]
    });

    return res.status(200).json({ result: 'success', characters });
});

router.get('/search', async (req, res) => {
    return await searchCharacter(req, res);
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

    let character = {};
    const { moviesOrSeriesIds } = req.body;
    try {
        character = await Character.create(req.body);

        if(moviesOrSeriesIds?.length) {
            const { id } = character.dataValues;

            await CharacterMovieOrSerie.bulkCreate(moviesOrSeriesIds.map(movieOrSerieId => ({
                movieOrSerieId,
                characterId: id
            })));
        }
    } catch(error) {
        return res.status(500).json({ result: 'error', errors: [ error.message ]});
    }

    character = await Character.findByPk(character.dataValues.id, {
        include: {
            model: MovieOrSerie,
            attributes: []
        }
    });

    return res.status(201).json({ result: 'success', message: 'Character created succesfully', character });
});

router.put('/:characterId', putValidations, async (req, res) => {
    const { errors } = req;
    if(errors.length) {
        return res.status(400).json({ result: 'error', errors });
    }

    const { name, age, weight, history, image, moviesOrSeriesIds } = req.body;
    const { characterId } = req.params;

    const updateFields = {};
    if(name) updateFields.name = name;
    if(age) updateFields.age = age;
    if(weight) updateFields.weight = weight;
    if(history) updateFields.history = history
    if(image) updateFields.image = image

    try {
        await Character.update(updateFields, { where: { id: characterId }});
   
        if(moviesOrSeriesIds) {
            const { add, remove } = moviesOrSeriesIds;

            if(add?.length) {
                await CharacterMovieOrSerie.bulkCreate(add.map(movieOrSerieId => ({
                    movieOrSerieId,
                    characterId
                })));
            }

            if(remove?.length) {
                await CharacterMovieOrSerie.destroy({
                    where: { 
                        [Op.or]: remove.map(movieOrSerieId => ({
                            movieOrSerieId,
                            characterId
                        }))
                    }
                });
            }
        }
    } catch(error) {
        return res.status(500).json({ result: 'error', errors: [ error.message ]});
    }
    
    const character = await Character.findByPk(characterId, {
        include: {
            model: MovieOrSerie,
            through: { attributes: [] }
        }
    });

    return res.status(201).json({ result: 'success', message: 'Character updated succesfully', character });
});

router.delete('/:characterId', deleteValidations, async (req, res) => {
    const { errors } = req;
    if(errors.length) {
        return res.status(400).json({ result: 'error', errors });
    }

    const { characterId } = req.params;
    try {
        await Character.destroy({
            where: { id: characterId }
        });
    } catch(error) {
        return res.status(500).json({ result: 'error', errors: [ error.message ]});
    }

    return res.status(201).json({ result: 'success', message: 'Character deleted succesfully' });
});

module.exports = router;