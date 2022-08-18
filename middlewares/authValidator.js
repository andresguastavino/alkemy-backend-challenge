const { validateNotNull, validateRegex, validateType, validateMinLength } = require('../utils/validations');

const methods = {
    Register: 'Register',
    Login: 'Login'
};

const validations = {
    email: [
        (email, errors) => { validateNotNull(email, errors, 'Email is mandatory'); },
        (email, errors, method) => { method === methods.Register && validateType(email, 'string', errors, 'Email has to be a string'); },
        (email, errors, method) => { method === methods.Register && validateRegex(email, /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, errors, 'Email has to be a valid email address'); }
    ],
    password: [
        (password, errors) => { validateNotNull(password, errors, 'Password is mandatory'); },
        (password, errors, method) => { method === methods.Register && validateType(password, 'string', errors, 'Password has to be a string'); },
        (password, errors, method) => { method === methods.Register && validateMinLength(password, 6, true, errors, 'Password must have a minimum length of 6 characters and a maximum length of 20 characters'); },
        (password, errors, method) => { method === methods.Register && validateRegex(password, /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/, errors, 'Password must contain at least one lower case letter, one upper case letter and a number'); }
    ]
};

const validateEmail = (email, errors, method) => {
    validations.email.forEach(validation => validation(email, errors, method));
}

const validatePassword = (password, errors, method) => {
    validations.password.forEach(validation => validation(password, errors, method));
}

module.exports = (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];
    validateEmail(email, errors, methods.Register);
    validatePassword(password, errors, methods.Register);
    req.errors = errors;
    next();
};