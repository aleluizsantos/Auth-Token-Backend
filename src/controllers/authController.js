const express = require('express');

const User = require('../models/user');

const router = express.Router();

//Método registar um usuário
router.post('/register', async (req, res) => {

    const{ email } = req.body;

    try {

        //Procurar se o usuário já existe
        if(await User.findOne({ email }))
            return res.status(400).send( { error: 'User already exists' });

        //Criar o usuário passado
        const user = await User.create(req.body);

        //Náo retornar o password informado mesmo criptografado
        user.password = undefined;

        return res.send({ user })

    } catch (error) {
        return res.status(400).send( { error: 'Registration failed' } );
    }
});

//Recuperar o app passado pelo index.js aplicação principal
//(app) é o parametro recebido => retornando app.user redefinindo uma ROTA
module.exports = app => app.use('/auth', router);