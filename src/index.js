const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const bodyParser = require('body-parser');
const session = require('express-session')
const app = express();
const path = require('path')
const server = require('http').Server(app);
const cookieParser = require('cookie-parser')

mongoose.connect('mongodb+srv://USUARIO:No6wPuwhvEIvKTRO@cluster0-jpmib.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true
})

app.use((req, res, next) => {
    next()
})

app.use(session({
    secret: 'OI23j23h54jkh',
    resave: false,
    saveUninitialized: true
}));
app.use(cors())
app.use(bodyParser.json());
app.use(cookieParser())
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads', 'resized')))
app.use(require('./routes'))
server.listen('3333')
console.log('Servidor rodando na porta 3333')