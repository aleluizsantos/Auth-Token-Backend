
const express = require('express')
const bodyParser = require('body-parser');

const app = express();

require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Referenciando os CONTROLLER repassando a app 
//que é nossa aplicação index pega todas os nosso controller
//e coloca na aplicação
require('./app/controllers/index')(app);

app.listen(process.env.PORT || 3000, function() {
    console.log('..:: Servidor online::..')
});