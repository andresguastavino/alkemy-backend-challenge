const validateNotNull = (value, errors, errorMessage) => {
    const valid = typeof(value) !== 'undefined' && typeof(value) !== 'null';
    if(!valid) errors.push(errorMessage);
}

const validateRegex = (value, regExp, errors, errorMessage) => {
    const valid = regExp.test(value);
    if(!valid) errors.push(errorMessage);
}

const validateType = (value, type, errors, errorMessage) => {
    const valid = typeof(value) === type;
    if(!valid) errors.push(errorMessage);
}

const validateMinLength = (value, min, errors, errorMessage) => {
    const valid = value && value.length > min;
    if(!valid) errors.push(errorMessage);
}

const validateLength = (value, min, max, errors, errorMessage) => {
    const valid = value && value.length > min && value.length < max;
    if(!valid) errors.push(errorMessage);
}

module.exports = {
    validateNotNull,
    validateRegex,
    validateType,
    validateLength,
    validateMinLength
};