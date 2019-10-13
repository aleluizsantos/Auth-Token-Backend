const express = require('express');
const authMiddleware = require('../middleware/auth')

const Projects = require('../models/project');
const Task = require('../models/task');

const router = express.Router();

//Interceptador - toda requisição que chegar é verificado o token 
router.use(authMiddleware);

//Listar todos os projetos
router.get('/', async (req, res) => {
    try {
        //.populare('user') é para o mongo listar também os usuários do relacionamento
       const projects = await Projects.find().populate(['user', 'tasks']) ;

       return res.send( { projects } )

    } catch (error) {
        return res.status(400).send( { error: 'Error loading project' } );
    }
});
//Listar um Projeto específico
router.get('/:projectId', async (req, res) => {
    try {
        const project = await Projects.findById(req.params.projectId).populate(['user', 'tasks']);

        return res.send( { project } );

    } catch (error) {
        return res.status(400).send( { error: 'Error loading project.' } );
    }
});
//Criar um Projeto
router.post('/', async (req, res) => {
    try {
        //Receber os parametros passados
        const { title, description, tasks } = req.body;

        //Além de receber todos os parametros no body temos que pegar o req.userId passado pelo middleware
        //...req.body, user: req.userId }
        const project = await Projects.create( { title, description, user: req.userId } );

        //Como o Tasks que é recebida é um array, vamos percorrer este array
        //Para que ele não salve antes de percorrer todas as interações usaremos
        //await Promise.All
        await Promise.all(tasks.map(async task => {
            const projectTask = new Task( { ...task, project: project._id } );

            await projectTask.save();
            project.tasks.push(projectTask);
        }));

        //Salvar tudo no projeto
        await project.save();

        return res.send( { project } );

    } catch (error) {
        //console.log(error);
        return res.status(400).send( { error: 'Error creating new project' } );
    }
});
//Atualizar o Projeto
router.put('/:projectId', async (req, res) => {
    try {
        //Receber os parametros passados
        const { title, description, tasks } = req.body;

        //Recebendo o parametro projectId na requisição e usuando a função findByIdAndUpdate 
        //localiza e atualiza, o new: true faz com que retorna o projeto já atualizado
        const project = await Projects.findByIdAndUpdate( req.params.projectId, { 
            title, 
            description, 
        }, { new: true, useFindAndModify: false } );

        //Remover todas as Tasks
        project.tasks = [];
        await Task.deleteOne( { project: project._id } );

        //Como o Tasks que é recebida é um array, vamos percorrer este array
        //utilizaremos await Promise.all para aguardar todas a interações para passar para proxima instrução
        await Promise.all(tasks.map(async task => {
            const projectTask = new Task( { ...task, project: project._id } );

            await projectTask.save();
            project.tasks.push(projectTask); //push adicionar um objeto no array
        }));

        //Salvar tudo no projeto
        await project.save();

        return res.send( { project } ); //Retorna o projeto

    } catch (error) {
        //console.log(error);
        return res.status(400).send( { error: 'Error Updating new project' } );
    }
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