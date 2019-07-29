const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const bodyParser = require('body-parser');
const session = require('express-session')
const app = express();
const path = require('path')
const server = require('http').Server(app);
const cookieParser = require('cookie-parser')

mongoose.connect('mongodb+srv://USUARIO:lipperhubteste@cluster0-jpmib.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true
})

app.use((req, res, next) => {
    next()
})

app.use(session({
    name:'some_session',
    secret: 'lalala',
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 365 * 24 * 60 * 60 * 1000,httpOnly: false , domain:'127.0.0.1:3000'},
    
}));
app.use(cors())
app.use(bodyParser.json());
app.use(cookieParser())
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads', 'resized')))
app.use(require('./routes'))
server.listen('3333')
console.log('Servidor rodando na porta 3333')