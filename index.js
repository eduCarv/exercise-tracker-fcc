require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const CryptoJS = require("crypto-js");
// const mongoose = require('mongoose');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))
app.use(cors())

const arrDados = [];
const arrExercicios = [];


function geraHash(username) {
  // Gera o hash SHA-1 do nome de usuário
  const hash = CryptoJS.SHA1(username).toString();

  // Obtém os primeiros 24 caracteres do hash
  const id = hash.substr(0, 24);

  return id;
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

//Cria usuário
app.post('/api/users', (req, res) => {
  const usuario = req.body.username;
  const id = geraHash(usuario);

  //Salva no "Banco"
  arrDados.push({ username: usuario, _id: id });

  // console.log(arrDados);

  res.json({
    username: usuario,
    _id: id
  });
});

//Lista usuários
app.get('/api/users', (req, res) => {
  res.json(arrDados);
});

//Cria exercício
app.post('/api/users/:_id/exercises', (req, res) => {
  const idCadastro = req.params._id;
  const desc = req.body.description;
  const duration = req.body.duration;
  const date = (req.body.date) ? new Date(req.body.date).toDateString() :  (new Date()).toDateString();

  const filtroDados = arrDados.filter(obj => obj._id == idCadastro);  
  let filtroExercicios = arrExercicios.filter(obj => obj._id == idCadastro);

  // console.log('filtroExercicios', filtroExercicios);

  if (filtroExercicios.length > 0) {
    filtroExercicios[0].exercises.push({
      description: desc,
      duration: duration,
      date: date,
    });    
  } else {
    arrExercicios.push({_id: idCadastro, exercises: []});    
    filtroExercicios = arrExercicios.filter(obj => obj._id == idCadastro);

    filtroExercicios[0].exercises.push({
      description: desc,
      duration: duration,
      date: date,
    });        
    // console.log('filtroExercicios2',filtroExercicios);
  }

  filtroExercicios = arrExercicios.filter(obj => obj._id == idCadastro);

  const obj =  {
    _id: idCadastro,
    username: filtroDados[0].username,
    description: desc,
    duration: Number(duration),
    date: date
  };

  // console.log('objeto', obj);
  res.json(obj);

});



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
{ }