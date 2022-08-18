const checkValidationResult = (valid, errors, errorMessage) => {
    if(!valid) errors.push(errorMessage);
}

const validateNotNull = (value, errors, errorMessage) => {
    let valid = typeof(value) !== 'undefined' && typeof(value) !== 'null';
    if(valid && typeof(value) === 'string')
        valid = value.length > 0;
    checkValidationResult(valid, errors, errorMessage);
}

const validateRegex = (value, regExp, errors, errorMessage) => {
    const valid = regExp.test(value);
    checkValidationResult(valid, errors, errorMessage);
}

const validateType = (value, type, errors, errorMessage) => {
    const valid = typeof(value) === type;
    checkValidationResult(valid, errors, errorMessage);
}

const validateMinLength = (value, min, isStrict = true, errors, errorMessage) => {
    if(!value) return;
    const valid = value && isStrict ? value.length > min : value.length >= min;
    checkValidationResult(valid, errors, errorMessage);
}

const validateMaxLength = (value, max, isStrict = true, errors, errorMessage) => {
    if(!value) return;
    const valid = value && isStrict ? value.length < max : value.length <= max;
    checkValidationResult(valid, errors, errorMessage);
}

const validateLength = (value, min, max, errors, errorMessage) => {
    const valid = value && value.length > min && value.length < max;
    checkValidationResult(valid, errors, errorMessage);
}

const validateIsNumber = (value, errors, errorMessage) => {
    const valid = !isNaN(value);
    checkValidationResult(valid, errors, errorMessage);
}

const validateStringIsFloat = (value, errors, errorMessage) => {
    const valid = !isNaN(parseFloat(value));
    checkValidationResult(valid, errors, errorMessage);
}

const validateDecimalPlace = (value, decimalParts, errors, errorMessage) => {
    const decimalPart = value.toString().split('.');
    if(decimalPart.length > 1) {
        const valid = decimalPart[1].length <= decimalParts;
        checkValidationResult(valid, errors, errorMessage);
    }
}

const validateIsPositive = (value, errors, errorMessage) => {
    const valid = value > 0;
    checkValidationResult(valid, errors, errorMessage);
}

module.exports = {
    validateNotNull,
    validateRegex,
    validateType,
    validateLength,
    validateMinLength,
    validateMaxLength,
    validateIsNumber,
    validateStringIsFloat,
    validateDecimalPlace,
    validateIsPositive
};