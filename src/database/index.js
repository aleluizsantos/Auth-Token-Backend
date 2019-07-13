const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/noderest', { useNewUrlParser: true });
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);

module.exports = mongoose;