# Projeto de authenticator e Token usando React 
Projeto criado para fazer autenticação utilizando token

### Para iniciar o projeto:
```
yarn init -y
```

### Instalação dos pacotes necessário para iniciar a aplicação
          * express
          * mongoose
          * bcryptjs
          * body-parser

### Instalação do Mongoose
* Documentação instalação mongoosedb [documentação](https://docs.mongodb.com/manual/installation/).

* [Mongoose](https://www.mongodb.com/download-center/community) -yarn *download do mongoose*

### Instalação pacote jsonwebtoken para trabalhar com token
         
         yarn add jsonwebtoken   ou   $ npm install jsonwebtoken
         

**gerando o token**
Para termos um hash único cria-se uma pasta config e dentro dela um arquivo AUTH.JSON para termos uma chave secreta:


**arquivo: auth.json**

```
{

   "secret": "698DC19D489C4E4DB73E28A713EAB07B"

}
```


     //Gerar o token, passando os parametros id, chaveSecreta e expira em 1 dia
    const token = jwt.sign( { id: user._id }, authConfig.secret, { 
        expiresIn: 86400,
    } );

**Para não ficar adicionando os controller um a um, vamos criar dentro de controle un index.js que depois importamos todas as controles dentro do app**

```
const fs = require('fs');
const path = require('path');

module.exports = app => {
    fs
        .readdirSync(__dirname) //ler o diretório que estamos
        .filter(file => ((file.indexOf('.')) !==0 && (file !== 'index.js')))
        .forEach(file => require(path.resolve(__dirname, file))(app));
}
```

### Instalação dos pacotes trabalhar com email
Para realizar teste de email utiliza [Mailtrap](https://mailtrap.io/) 

          * yarn add nodemailer
          * yarn add nodemailer-express-handlebars   _preencher variaveis em arquivos html_
          
