const jwt = require('jsonwebtoken');
const queryString = require('querystring');

const _config = require('../../credentials');

module.exports = (req, res, next) => {

    const authHandler = req.headers.authorization;
    
    if(!authHandler) {
        console.log({errorNumber: 1, errorMessage: 'No Token provided.'});
        const query = queryString.stringify({
            errorNumber:1,
            errorMessage: "No Token provided."
        });
        return res.redirect('/login/?' + query);
    }

    const parts = authHandler.split(' ');

    if(!parts.length === 2) {
        const query = queryString.stringify({
            errorNumber:2,
            errorMessage: "Token error! Missing some token parts."
        });
        return res.redirect('/login/?' + query);
    }

    const [scheme,token] = parts;
    if(!/^Bearer$/i.test(scheme)) {
        const query = queryString.stringify({
            errorNumber:3,
            errorMessage: "Bad Token. Something wrong with this token."
        });
        return res.redirect('/login/?' + query);
    }

    jwt.verify(token,_config.database.passwordHashSecret, (err,decoded) => {
        if(err) {
            const query = queryString.stringify({
                errorNumber:4,
                errorMessage: "Invalid Token. JWT: " + err.name
            });
            return res.redirect('/login/?' + query);
        }
            
        req.userId = decoded.id;

        return next()
    });
}