const router = require('express').Router();
const bcrypt = require('bcryptjs');

const validateAuth = require('../middlewares/authValidator');
const { createToken } = require('../utils/token');
const sendEmailTo = require('../helpers/sendEmail');

const { User } = require('../database');

router.post('/register', validateAuth, async (req, res) => {
    const { errors } = req;
	if(errors.length) {
		return res.status(400).json({ result: 'error', errors });	
	}
    
    const email  = req.body.email.toLowerCase();
    let user = await User.findOne({ 
        where: { email }
    });
    if(user) {
        return res.status(409).json({ result: 'error', errors: [ `Email address ${ email } is already in use` ]});
    }

    req.body.password = bcrypt.hashSync(req.body.password, 10);
    req.body.email = email;

    try {
        user = await User.create(req.body);
    } catch(error) {
        return res.status(500).json({ result: 'error', errors: [ error ]});
    }

    sendEmailTo(email);

    const access_token = createToken(user);

    return res.status(201).json({ result: 'success', access_token });
});

router.post('/login', validateAuth, async (req, res) => {
    const { errors } = req;
	if(errors.length) {
		return res.status(400).json({ result: 'error', errors });	
	}

    const user = await User.findOne({ 
        where: { email: req.body.email.toLowerCase() }
    });

	if(user) {
		if(!bcrypt.compareSync(req.body.password, user.password)) {
			return res.status(400).json({ result: 'error', errors: [ 'Invalid email and/or password' ]});
		}
	} else {
		return res.status(400).json({ result: 'error', errors: [ 'Invalid email and/or password' ]});
	}

    const access_token = createToken(user);

    return res.status(200).json({ result: 'success', access_token });
});

module.exports = router;