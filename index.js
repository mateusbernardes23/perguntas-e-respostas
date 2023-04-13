const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/models/Pergunta");

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
            res.render("pergunta", {
                pergunta: pergunta,
            });
        } else {
            res.redirect("/")
        }
    });
});

app.listen(3000, () => {
    console.log("App rodando");
});