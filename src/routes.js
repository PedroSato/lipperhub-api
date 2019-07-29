const express = require('express')
const UserController = require('./controllers/UserController')
const routes = new express.Router()
const multer = require('multer')
const uploadConfig = require('./config/upload')
const upload = multer(uploadConfig)

routes.post('/register', UserController.register)
routes.post('/login', UserController.login)
routes.get('/logout', UserController.logout)

routes.put('/update', upload.single('image'), UserController.updateUser)

routes.get('/listar', UserController.listarUsuarios)
routes.get('/adresses', UserController.adresses)

module.exports = routes