const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);

module.exports = mongoose;