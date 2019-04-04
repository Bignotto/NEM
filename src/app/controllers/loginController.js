const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

const _config = require('../../credentials');

const router = express.Router();

router.get('/', (req,res) => {
    const userId = req.userId;
    const errorMessage = req.query.errorMessage;

    res.render('login',{
        userId: userId,
        errorMessage: errorMessage,
        pageTitle: 'Login',
        deu: 'certo!'
    });
});

module.exports = app => app.use('/login', router);