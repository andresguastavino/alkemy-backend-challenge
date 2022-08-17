const router = require('express').Router();

const { Character } = require('../database');

router.get('/', async (req, res) => {
    const characters = await Character.findAll({
        attributes: [ 'id', 'name', 'image' ]
    });

    res.status(200).json({ result: 'success', characters });
});

router.post('/', async (req, res) => {

});

router.put('/:characterId', async (req, res) => {

});

module.exports = router;