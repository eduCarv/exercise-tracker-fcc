require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const CryptoJS = require("crypto-js");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))
app.use(cors())

const arrayDados = [];

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

app.post('/api/users', (req, res) => {
  const usuario = req.body.username;

  const id = geraHash(usuario);
  
  //Salva no "Banco"
  arrayDados.push({username: usuario, _id: id});    

  console.log(arrayDados);

  
  res.json({
    username: usuario,
    _id: id
  });
  
  console.log('usuario', usuario);
});

app.get('/api/users', (req, res) => {
  
  
  
  res.json(arrayDados);
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
 {}