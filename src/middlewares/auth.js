const jwt = require('jsonwebtoken');
const _config = require('../credentials');

module.exports = (req, res, next) => {
    const authHandler = req.headers.authorization;
    if(!authHandler)
        return res.status(401).send({ error: 'No Token Provided' });

    const parts = authHandler.split(' ');

    if(!parts.length === 2)
        return res.status(401).send( {error: 'Token error'});

    const [scheme,token] = parts;
    if(!/^Bearer$/i.test(scheme))
        return res.status(401).send( {error: 'Bad, bad token'});

    jwt.verify(token,_config.database.passwordHashSecret, (err,decoded) => {
        if(err)
            return res.status(401).send({error: 'Invalid Token'});
            
        req.userId = decoded.id;

        return next()
    });
}