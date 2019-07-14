const express = require('express')
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Referenciando o authController repassando para controller o app 
//que é nossa aplicação
require('./app/controllers/authController')(app);
require('./app/controllers/projetController')(app);

app.listen(process.env.PORT || 3000, function() {
    console.log('..:: Servidor online::..')
});