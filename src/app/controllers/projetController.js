const express = require('express');
const authMiddleware = require('../middleware/auth')

const Projects = require('../models/project');
const Task = require('../models/task');

const router = express.Router();

router.use(authMiddleware);

//Listar todos os projetos
router.get('/', async (req, res) => {
    try {
        //.populare('user') é para o mongo listar também os usuários do relacionamento
       const projects = await Projects.find().populate('user') ;

       return res.send( { projects } )

    } catch (error) {
        return res.status(400).send( { error: 'Error loading project' } );
    }
});
//Listar um Projeto específico
router.get('/:projectId', async (req, res) => {
    try {
        const project = await Projects.findById(req.params.projectId).populate('user');

        return res.send( { project } );

    } catch (error) {
        return res.status(400).send( { error: 'Error loading project.' } );
    }
});
//Criar um Projeto
router.post('/', async (req, res) => {
    try {
        //Além de receber todos os parametros no body temos que pegar o req.userId passado pelo middleware
        //...req.body, user: req.userId }
        const project = await Projects.create( { ...req.body, user: req.userId } );

        return res.send( { project } );

    } catch (error) {
        return res.status(400).send( { error: 'Error creating new project' } );
    }
});
//Atualizar o Projeto
router.put('/:projectId', async (req, res) => {
    res.send({ user: req.userId });
});
//Deletar o Projeto
router.delete('/:projectId', async (req, res) => {
    try {
        //Erro se não colocar useFindAndModify - (node:11224) DeprecationWarning: Mongoose: `findOneAndUpdate()` 
        //and `findOneAndDelete()` without the `useFindAndModify` option set to false are deprecated. 
        //See: https://mongoosejs.com/docs/deprecations.html#-findandmodify-
        const project = await Projects.findByIdAndRemove(
                req.params.projectId, 
                { useFindAndModify: false });

        return res.send();
        
    } catch (error) {
        return res.status(400).send( { error: 'Error deleting project.' } );
    }
});

module.exports = app => app.use('/projects', router);