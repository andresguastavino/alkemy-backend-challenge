require('dotenv').config();
const { JWT_ENCODING_KEY } = process.env;

const jwt = require('jwt-simple');
const moment = require('moment');

const createToken = (user) => {
	const payload = {
		userId: user.id,
		createdAt: moment().unix(),
		expiresAt: moment().add(60, 'minutes').unix()
	};

	return jwt.encode(payload, JWT_ENCODING_KEY);
};

const checkToken = () => {
    
}

module.exports = {
    createToken,
    checkToken
};