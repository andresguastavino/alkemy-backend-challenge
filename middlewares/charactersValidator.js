const { 
    validateType, 
    validateMaxLength, 
    validateNotNull, 
    validateIsNumber, 
    validateStringIsFloat, 
    validateDecimalPlace, 
    validateIsPositive 
} = require('../utils/validations');

const validations = {
    name: [
        (name, errors) => validateNotNull(name, errors, 'Character\'s Name is mandatory'),
        (name, errors) => validateType(name, 'string', errors, 'Name must be a string'),
        (name, errors) => validateMaxLength(name, 50, true, errors, 'Name\'s length cannot be more than 50 characters')
    ],
    age: [
        (age, errors) => validateNotNull(age, errors, 'Character\'s Age is mandatory'),
        (age, errors) => validateIsNumber(age, errors, 'Age must be a number'),
        (age, errors) => validateIsPositive(age, errors, 'Age must be a positive number')
    ],
    weight: [
        (weight, errors) => validateNotNull(weight, errors, 'Character\'s Weight is mandatory'),
        (weight, errors) => validateIsNumber(weight, errors, 'Weight must be a number'),
        (weight, errors) => validateDecimalPlace(weight, 2, errors, 'The Weight can only have 2 decimal places at most')
    ],
    history: [
        (history, errors) => validateNotNull(history, errors, 'Character\'s History is mandatory'),
        (history, errors) => validateType(history, 'string', errors, 'History must be a string'),
        (history, errors) => validateMaxLength(history, 500, true, errors, 'History\'s length cannot be more than 500 characters')
    ],
    image: [
        (image, errors) => validateNotNull(image, errors, 'Character\'s Image is mandatory'),
        (image, errors) => validateType(image, 'string', errors, 'Image must be a string'),
        (image, errors) => validateMaxLength(image, 500, true, errors, 'Image\'s length cannot be more than 250 characters')
    ]
};

module.exports = (req, res, next) => {
    const { name, age, weight, history, image } = req.body;

    const valuesByValidationsNames = {
        name,
        age,
        weight,
        history,
        image
    };

    const errors = [];
    console.log(Object.keys(validations));
    Object.keys(validations).forEach(key => {
        validations[key].forEach(validation => validation(valuesByValidationsNames[key], errors));
    });
    req.errors = errors;

    next();
};