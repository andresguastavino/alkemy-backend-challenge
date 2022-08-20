const { 
    validateType, 
    validateMaxLength, 
    validateNotNull, 
    validateIsNumber, 
    validateMinValue,
    validateDecimalPlace, 
    validateIsPositive,
    validIsInteger,
    validateIsArray,
    validateStringIsNumber
} = require('../utils/validations');

const { Character, MovieOrSerie, CharacterMovieOrSerie } = require('../database');
const { Op } = require('sequelize');

const methods = {
    Post: 'Post',
    Put: 'Put',
    Delete: 'Delete'
};

const validations = {
    characterId : [
        async (characterId, errors, method) => {
            if(method !== methods.Put && method !== methods.Delete) return;

            const currentErrors = errors.length;
            validateNotNull(characterId, errors, 'CharacterId needs to be specified');
            if(errors.length > currentErrors) return;
            validateStringIsNumber(characterId, errors, 'CharacterId must be a number');
            if(errors.length > currentErrors) return;

            const character = await Character.findByPk(characterId);
            console.log(character);
            if(character === null) {
                errors.push(`There is no Character with id ${ characterId }`);
            }
        },
    ],
    name: [
        (name, errors, method) => { method === methods.Post && validateNotNull(name, errors, 'Character\'s Name is mandatory'); },
        (name, errors) => { validateType(name, 'string', errors, 'Name must be a string'); },
        (name, errors) => { validateMaxLength(name, 50, false, errors, 'Name\'s length cannot be more than 50 characters'); }
    ],
    age: [
        (age, errors, method) => { method === methods.Post && validateNotNull(age, errors, 'Character\'s Age is mandatory'); },
        (age, errors) => { validateMinValue(age, 0, true, errors, 'Age must be greater than 0'); },
        (age, errors) => { validateIsPositive(age, errors, 'Age must be a positive number'); }
    ],
    weight: [
        (weight, errors, method) => { method === methods.Post && validateNotNull(weight, errors, 'Character\'s Weight is mandatory'); },
        (weight, errors) => { validateIsNumber(weight, errors, 'Weight must be a number'); },
        (weight, errors) => { validateDecimalPlace(weight, 2, errors, 'The Weight can only have 2 decimal places at most'); }
    ],
    history: [
        (history, errors, method) => { method === methods.Post && validateNotNull(history, errors, 'Character\'s History is mandatory'); },
        (history, errors) => { validateType(history, 'string', errors, 'History must be a string'); },
        (history, errors) => { validateMaxLength(history, 500, false, errors, 'History\'s length cannot be more than 500 characters'); }
    ],
    image: [
        (image, errors, method) => { method === methods.Post && validateNotNull(image, errors, 'Character\'s Image is mandatory'); },
        (image, errors) => { validateType(image, 'string', errors, 'Image must be a string'); },
        (image, errors) => { validateMaxLength(image, 250, false, errors, 'Image\'s length cannot be more than 250 characters'); }
    ],
    moviesOrSeriesIds: [
        async (moviesOrSeriesIds, errors, method) => {
            const validation = (moviesOrSeriesIds, errors) => {
                const currentErrors = errors.length;
                validateIsArray(moviesOrSeriesIds, errors, 'MoviesOrSeriesIds must be an array');
                if(errors.length > currentErrors) return;

                moviesOrSeriesIds.forEach(movieOrSerieId => {
                    validateType(movieOrSerieId, 'number', errors, 'Each Movie or Serie Id must be a number');
                    if(errors.length > currentErrors) return;
                    validateIsPositive(movieOrSerieId, errors, 'Each Movie or Serie Id must be a positive number');
                    if(errors.length > currentErrors) return;
                    validIsInteger(movieOrSerieId, errors, 'Each Movie or Serie Id must be an integer');
                });
            }

            if(method === methods.Post) {
                validation(moviesOrSeriesIds, errors);
            } else if(method === methods.Put) {
                const { add, remove } = moviesOrSeriesIds;
                if(add?.length) validation(add, errors);
                if(remove?.length) validation(remove, errors);
            }
        },
        async (moviesOrSeriesIds, errors, method, characterId) => { 
            const validateMoviesExists = async (moviesOrSeriesIds, errors) => {
                const existingMoviesOrSeriesIds = await MovieOrSerie.findAll({ 
                        where: { 
                            id: { [Op.or] : moviesOrSeriesIds } 
                        },
                        attributes: [ 'id' ]
                    })
                    .then(moviesOrSeries => {
                        return moviesOrSeries.map(movieOrSerie => movieOrSerie.dataValues.id);
                    });

                if(existingMoviesOrSeriesIds.length !== moviesOrSeriesIds.length) {
                    const nonExistingMoviesOrSeriesIds = moviesOrSeriesIds.map(movieOrSerieId => {
                            if(!existingMoviesOrSeriesIds.includes(movieOrSerieId)) {
                                return movieOrSerieId;
                            }
                        })
                        .filter(movieOrSerieId => movieOrSerieId !== null && movieOrSerieId !== undefined);

                    errors.push(`The following Movies or Series Ids are wrong and do not reference a MovieOrSerie record: [ ${ nonExistingMoviesOrSeriesIds.join(', ') } ]`);
                }
            }

            const validateMovieIsNotAlreadyRelated = async (moviesOrSeriesIds, errors, characterId) => {
                const existingMoviesOrSeriesIds = await CharacterMovieOrSerie.findAll({
                    where: { 
                        [Op.or]: moviesOrSeriesIds.map(movieOrSerieId => ({
                            movieOrSerieId,
                            characterId
                        }))
                    }
                })
                .then(charactersMoviesOrSeries => {
                    return charactersMoviesOrSeries.map(characterMovieOrSerie => 
                        characterMovieOrSerie.dataValues.movieOrSerieId
                    );
                });

                if(existingMoviesOrSeriesIds.length) {
                    const alreadyExistingMoviesOrSeriesIds = moviesOrSeriesIds.map(movieOrSerieId => {
                        if(existingMoviesOrSeriesIds.includes(movieOrSerieId)) {
                            return movieOrSerieId;
                        }
                    })
                    .filter(movieOrSerieId => movieOrSerieId !== null && movieOrSerieId !== undefined);

                    errors.push(`The following MoviesOrSeries are already related to the Character: [ ${ alreadyExistingMoviesOrSeriesIds.join(', ') } ]`)
                }
            }

            const validateMovieIsRelatedToCharacter = async (moviesOrSeriesIds, errors, characterId) => {
                const existingMoviesOrSeriesIds = await CharacterMovieOrSerie.findAll({
                        where: { 
                            [Op.or]: moviesOrSeriesIds.map(movieOrSerieId => ({
                                movieOrSerieId,
                                characterId
                            }))
                        }
                    })
                    .then(charactersMoviesOrSeries => {
                        return charactersMoviesOrSeries.map(characterMovieOrSerie => {
                            characterMovieOrSerie.dataValues.movieOrSerieId
                        });
                    });

                if(existingMoviesOrSeriesIds.length !== moviesOrSeriesIds.length) {
                    const nonExistingMoviesOrSeriesIds = moviesOrSeriesIds.map(movieOrSerieId => {
                        if(!existingMoviesOrSeriesIds.includes(movieOrSerieId)) {
                            return movieOrSerieId;
                        }
                    })
                    .filter(movieOrSerieId => movieOrSerieId !== null && movieOrSerieId !== undefined);

                    errors.push(`The following MoviesOrSeries are not related to the Character: [ ${ nonExistingMoviesOrSeriesIds.join(', ') } ]`);
                }
            }

            if(method === methods.Post) {
                await validateMoviesExists(moviesOrSeriesIds, errors);
            } else if(method === methods.Put) {
                const { add , remove } = moviesOrSeriesIds;
                if(add?.length) {
                    const currentErrors = errors.length;
                    await validateMoviesExists(add, errors);
                    if(errors.length > currentErrors) return;
                    await validateMovieIsNotAlreadyRelated(add, errors, characterId);
                }
                if(remove?.length) await validateMovieIsRelatedToCharacter(remove, errors, characterId);
            }
        },
    ]
};

const postValidations = async (req, res, next) => {
    const { name, age, weight, history, image, moviesOrSeriesIds } = req.body;

    const valuesByValidationsNames = {
        name: name,
        age: age,
        weight: weight,
        history: history,
        image: image
    };

    if(moviesOrSeriesIds) valuesByValidationsNames.moviesOrSeriesIds = moviesOrSeriesIds;

    const errors = [];
    const objectKeys = Object.keys(valuesByValidationsNames);

    for(let i = 0; i < objectKeys.length; i++) {
        const key = objectKeys[i];
        const fieldValidations = validations[key];

        for(let j = 0; j < fieldValidations.length; j++) {
            const value = valuesByValidationsNames[key];
            await fieldValidations[j](value, errors, methods.Post);
        }
    }

    req.errors = errors;

    next();
}

const putValidations = async (req, res, next) => {
    const { name, age, weight, history, image, moviesOrSeriesIds } = req.body;
    const { characterId } = req.params;

    const valuesByValidationsNames = {};
    if(characterId) valuesByValidationsNames.characterId = characterId;
    if(name) valuesByValidationsNames.name = name;
    if(age) valuesByValidationsNames.age = age;
    if(weight) valuesByValidationsNames.weight = weight;
    if(history) valuesByValidationsNames.history = history;
    if(image) valuesByValidationsNames.image = image;
    if(moviesOrSeriesIds) valuesByValidationsNames.moviesOrSeriesIds = moviesOrSeriesIds;

    const errors = [];
    const objectKeys = Object.keys(valuesByValidationsNames);

    for(let i = 0; i < objectKeys.length; i++) {
        const key = objectKeys[i];
        const fieldValidations = validations[key];

        for(let j = 0; j < fieldValidations.length; j++) {
            const value = valuesByValidationsNames[key];
            await fieldValidations[j](value, errors, methods.Put, characterId);
        }
    }

    req.errors = errors;

    next();
}

const deleteValidations = async (req, res, next) => {
    const { characterId } = req.params;

    const errors = [];
    await validations.characterId[0](characterId, errors, methods.Delete);
    req.errors = errors;

    next();
}

module.exports = {
    postValidations,
    putValidations,
    deleteValidations
};