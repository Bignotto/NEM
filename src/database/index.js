const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://developer:dev123@authtest-auk5w.mongodb.net/test?retryWrites=true',{ useNewUrlParser: true, useCreateIndex: true }, (err) => {
    if(err) console.log(err);
});

mongoose.Promise = global.Promise;

module.exports = mongoose;