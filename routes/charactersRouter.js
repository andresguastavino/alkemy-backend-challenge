const router = require('express').Router();

const { Character, MovieOrSerie } = require('../database');

const { searchCharacter } = require('../helpers/searchHelper');

const fieldsValidations = require('../middlewares/charactersValidator');

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

router.post('/', fieldsValidations, async (req, res) => {
    const { errors } = req;
    if(errors.length) {
        return res.status(400).json({ result: 'error', errors });
    }

    try {
        const character = await Character.create(req.body);
    } catch(error) {
        return res.status(500).json({ result: 'error', errors: [ error ]});
    }

    return res.status(201).json({ result: 'success', message: 'Character created succesfully', character });
});

router.put('/:characterId', fieldsValidations, async (req, res) => {
    const { errors } = req;
    if(errors.length) {
        return res.status(400).json({ result: 'error', errors });
    }

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
    
    try {
        await character.update(updateFields);
        await character.save();
    } catch(error) {
        return res.status(500).json({ result: 'error', errors: [ error ]});
    }
    
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

    try {
        character = await Character.destroy({
            where: { id: characterId }
        });
    } catch(error) {
        return res.status(500).json({ result: 'error', errors: [ error ]});
    }

    return res.status(201).json({ result: 'success', message: 'Character deleted succesfully' });
});

module.exports = router;