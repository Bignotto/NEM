const mongoose = require('mongoose');
const _config = require('../credentials');

mongoose.connect(_config.database.dataBaseUrl,{ useNewUrlParser: true, useCreateIndex: true }, (err) => {
    if(err) console.log(err);
});
mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;

module.exports = mongoose;