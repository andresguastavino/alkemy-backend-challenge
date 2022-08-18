const router = require('express').Router();

const { MovieOrSerie, Character } = require('../database');

const { searchMovie } = require('../helpers/searchHelper');

router.get('/', async (req, res) => {
    const moviesOrSeries = await MovieOrSerie.findAll({
        attributes: [ 'id', 'title', 'createdDate', 'image' ]
    });

    return res.status(200).send({ result: 'success', moviesOrSeries });
});

router.get('/search', async (req, res) => {
    return await searchMovie(req, res);
});

router.get('/:movieOrSerieId', async (req, res) => {
    const { movieOrSerieId } = req.params;

    const movieOrSerie = await MovieOrSerie.findByPk(movieOrSerieId, {
        include: {
            model: Character,
            through: { attributes: [] }
        }
    });

    if(!movieOrSerie) {
        return res.status(204).json({ result: 'error', errors: [ `No movie or serie found with id ${ movieOrSerieId}` ]});
    }

    return res.status(200).json({ result: 'success', movieOrSerie });
});



module.exports = router;