const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://developer:dev123@authtest-auk5w.mongodb.net/test?retryWrites=true',{ useNewUrlParser: true, useCreateIndex: true });
mongoose.Promise = global.Promise;

module.exports = mongoose;