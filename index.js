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

function getUsernameById(userId){
  const dados = arrDados.filter(obj => obj._id == userId);

  return dados;
}

function getExercisesById(userId) {
  const dados = arrExercicios.filter(obj => obj._id == userId);

  return dados;
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
  const duration = Number(req.body.duration);
  const date = (req.body.date) ? new Date(req.body.date).toDateString() : (new Date()).toDateString();

  let filtroDados = getUsernameById(idCadastro);
  
  let filtroExercicios = getExercisesById(idCadastro);

  // console.log('filtroExercicios', filtroExercicios);

  if (filtroExercicios.length > 0) {
    filtroExercicios[0].exercises.push({
      description: desc,
      duration: duration,
      date: date,
    });
  } else {
    arrExercicios.push({ _id: idCadastro, exercises: [] });
    filtroExercicios = getExercisesById(idCadastro);

    filtroExercicios[0].exercises.push({
      description: desc,
      duration: duration,
      date: date,
    });
    // console.log('filtroExercicios2',filtroExercicios);
  }  

  const obj = {
    _id: idCadastro,
    username: filtroDados[0].username,
    description: desc,
    duration: duration,
    date: date
  };

  // console.log('objeto', obj);
  res.json(obj);

});

//Exibe exercício especifico
app.get('/api/users/:_id/logs', (req, res) => {
  const idCadastro = req.params._id;

  const {from, to, limit} = req.query;
  
  
  let filtroDados = getUsernameById(idCadastro);
  let filtroLog = getExercisesById(idCadastro);     
  
  filtroLog = filtroLog[0].exercises;
  
  if (from) {
    const fromDate = new Date(from);    
    filtroLog = filtroLog.filter(exe => new Date(exe.date) > fromDate);
  }

  if (to) {
    const toDate = new Date(to);    
    filtroLog = filtroLog.filter(exe => new Date(exe.date) < toDate);
  }

  if (limit) {
    filtroLog = filtroLog.slice(0, limit);
  }
 
  const log = {
    username: filtroDados[0].username,
    count: Number(filtroLog.length),
    _id: idCadastro,
    log: filtroLog
  };

  console.log('log', log);  
  
  res.json(log);
});




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
{ }