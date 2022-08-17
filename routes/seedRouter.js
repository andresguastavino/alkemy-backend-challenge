require('dotenv').config();
const { DATABASE_USERNAME, DATABASE_PASSWORD } = process.env;

const router = require('express').Router();

const { seedUsers, seedCharacters, seedGenres, seedMovies, seedCharactersWithMoviesOrSeries } = require('../database/seeder');

router.post('/', async (req, res) => {
    const { username, password } = req.body;
    if(username !== DATABASE_USERNAME || password !== DATABASE_PASSWORD) {
        return res.status(401).json({ result: 'error', errors: 'Unauthorized' });
    }

    await seedUsers();
    await seedCharacters();
    await seedGenres();
    await seedMovies();
    await seedCharactersWithMoviesOrSeries();

    return res.status(201).json({ result: 'success', message: 'Database seeded succesfully!' });
});

module.exports = router;