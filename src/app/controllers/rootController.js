const express = require('express');
const authMiddleware = require('../middlewares/auth');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const _config = require('../../credentials');

const router = express.Router();
router.use(authMiddleware);

router.get('/', (req,res) => {
    const userId = req.userId;
    res.send({se: 'chegamos aqui', estamos: 'logados!', userId });
});

module.exports = app => app.use('/', router);
