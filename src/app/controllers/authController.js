const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

const _config = require('../../credentials');

const router = express.Router();

function generateToken(params = {}) {
    return jwt.sign(params, _config.database.passwordHashSecret, {
        expiresIn: 86400,
    });
}

router.post('/register', async (req,res) => {
    const { email } = req.body;
    try {
        if(await User.findOne({ email }))
            return res.status(400).send({ error: 'User already exists!'});

        const user = await User.create(req.body);
        user.password = undefined;

        res.send({user,
            token: generateToken({id: user.id})});
    } catch (err) {
        console.log(err);
        return res.status(400).send({error: 'Register failed'});
    }
});

router.post('/authenticate', async (req,res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if(!user)
        return res.status(401).send({error: 'User not found'});

    if(!await bcrypt.compare(password, user.password))
        return res.status(400).send({error: 'Wrong password'});

    user.password = undefined;


    res.send({user,
        token: generateToken({id: user.id})});
});

router.post('/forget', async (req,res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if(!user)
            return res.status(400).send({ error: 'User not found' });

        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1);

        await User.findOneAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now
            }
        });

        mailer.sendMail({
            to: email,
            from: 'happy@code.com.br',
            template: 'forget',
            context: { token },
        }, (err) => {
            if(err) {
                console.log(err);
                return res.status(400).send({ error: 'Cant send email' });
            }
            res.send();
        });

        // console.log(token, now);
        // res.send({ deu:'certo' });
    } catch (error) {
        console.log(error);
        return res.status(400).send({error: 'I cant... some error happend'});
    }
});

router.post('/reset', async (req,res) => {
    const { email, token, password } = req.body;
    try {
        const user = await User.findOne({ email })
            .select('+passwordResetToken passwordResetExpires');
        
        if(!user)
            return res.status(400).send({ error: 'User not found...' });
        
        if(!token)
            return res.status(400).send({ error: 'Invalid token...' });
        
        const now = new Date();
        if(now > user.passwordResetExpires)
            return res.status(400).send({ error: 'Token expired...' });
        
        user.password = password;
        await user.save();
        res.send();

    } catch (error) {
        if(error) {
            console.log(error);
            return res.status(400).send({ error: error });
        }
    }
});

module.exports = app => app.use('/auth', router);