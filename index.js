const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/models/Pergunta");
const Resposta = require("./database/models/Resposta");

//Database
connection
    .authenticate()
    .then(() => {
        console.log("Conexão com sucesso!");
    })
    .catch((msgErro) => {
        console.log(msgErro);
    });

app.set('view engine', 'ejs'); //Estou dizendo para o express usar o EJS como View engine
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    Pergunta.findAll({raw: true, order: [
        ['id', 'desc']
    ]}).then(perguntas => {
        res.render("index", {
            perguntas: perguntas,
        });
    });
    
});

app.get("/perguntar", (req, res) => {
    res.render("perguntar");
});

app.post("/salvarpergunta", (req, res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    Pergunta.create({
        titulo: titulo,
        descricao: descricao,
    }).then(() => {
       res.redirect("/");
    });
});

app.get("/pergunta/:id", (req, res) => {
    var id = req.params.id;
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if (pergunta != undefined) {
            Resposta.findAll({
                where: {perguntaID: id},
                order: [['id', 'desc']]
            }).then(respostas => {
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas,
                });
            });
        } else {
            res.redirect("/")
        }
    });
});

app.post("/responder", (req, res) => {
    var perguntaId = req.body.pergunta;
    var corpo = req.body.corpo;
    Resposta.create({
        perguntaId: perguntaId,
        corpo: corpo,
    }).then(() => {
        res.redirect("/pergunta/" + perguntaId);
    });
});

app.listen(3000, () => {
    console.log("App rodando");
});