const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypt = require('crypto');
const mailer = require('../../modules/mailer');

const authConfig = require('../../config/auth')

const User = require('../models/user');

const router = express.Router();

//Função Gerar o token, passando os parametros id, chaveSecreta e expira em 1 dia
function generateToken(params = {}) {
    return jwt.sign( params, authConfig.secret, { 
        expiresIn: 86400,
    });
}

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

        return res.send({ 
            user,
            token: generateToken( { id: user.id })
         })

    } catch (error) {
        return res.status(400).send( { error: 'Registration failed' } );
    }
});

//Metodo para criar um token
router.post('/authenticate', async (req, res) => {
    //Quando o usuario se autentica recebo o email e o password
    const { email, password } = req.body;

    //buscar o usuário para verificar se existe 
    //Como foi definido no schemaUser que o password seja select= false 
    //não se exibido, usaremos .select('+password') para exibir o password
    const user = await User.findOne( { email } ).select('+password'); 

    //Caso o usuario não for encontrado
    if(!user)
        return res.status(400).send({ error: 'User not found'});

    //Realizar a verificação se a senha que foi enviada é a mesma que esta cadastrada
    if(!await bcrypt.compare(password, user.password))
        return res.status(400).send({ error: 'Invalid password'});
    
    //Para não exibir o password na listagem vasmos retira-lo
    user.password = undefined;

    //Retornar o usuario localizado
    res.send( { 
        user, 
        token: generateToken( { id: user.id }) 
    });
});

//Esqueci minha senha
router.post('/forgot_password', async (req, res) => {

    const { email } = req.body;

    try {
        //Verificar se realmente este email esta cadastrado na base de dados
        const user = await User.findOne( { email } );
        //Usuario não localizado
        if(!user)
            return res.status(400).send({ error: 'User not found' });

        //Gerar um token
        const token = crypt.randomBytes(20).toString('hex');
        //Definir a data de expiração para o token, acrescentar uma hora na data atual
        const now = new Date();
        now.setHours(now.getHours() + 1);
        //Atualizar o banco de dados do usuário com as informações token e expires.
        await User.findOneAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        }, { useFindAndModify: false });
        
        //Enviando um email de recuperação de senha
        mailer.sendMail({
            from: 'aleluizsantos@gmail.com',
            to: email,
            subject: 'Forgot password email',
            html: token,
            //template: 'auth/forgot_password',
            //context: { token },
        }, (err) => {
            console.log(err);
            if(err)
                return res.status(400).send({ error: 'Cannot send forgot password email' });

            return res.send();
        });
        
    } catch (err) {
        return res.status(400).send({ error: 'Erro on forgot password, try again' });
    }
});

router.post('/reset_password', async (req, res) => {
    const { email, token, password } = req.body;

    try {
        const user = await User.findOne({ email })
             .select('+passwordResetToken passwordResetExpires');
        
        //Usuario não localizado
        if(!user)
            return res.status(400).send({ error: 'User not found' });
        //Verificar se o token é igual a do usuario
        if(token !== user.passwordResetToken)
            return res.status(400).send({ error: 'Token invalid' });

        //Verificar se o token expirou
        const now = new Date();

        if(now > user.passwordResetExpires)
            return res.status(400).send({ error: 'Token expired, generate new one.' });

        user.password = password;

        await user.save();

        res.send();


    } catch (error) {
        return res.status(400).send({ error: 'Erro on Reset password, try again' });
    }
});
//Recuperar o app passado pelo index.js aplicação principal
//(app) é o parametro recebido => retornando app.user redefinindo uma ROTA
module.exports = app => app.use('/auth', router);