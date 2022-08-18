require('dotenv').config();
const { NODE_ENV } = process.env;

const router = require('express').Router();

const authRouter = require('./authRouter');
const charactersRouter = require('./charactersRouter');
const seedRouter = require('./seedRouter');

router.use('/auth', authRouter);
router.use('/characters', charactersRouter);

NODE_ENV !== 'prod' && router.use('/seed', seedRouter);

module.exports = router;