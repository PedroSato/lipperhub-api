const User = require('../models/User')
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

var sess
module.exports = {



    async login(req, res) {

        try {

            const { email, password } = req.body

            const user = await User.findOne({ email })

            if (!user) {
                return res.status(404).send('Usuário não encontrado')
            }


            user.comparePassword(password, user.password, function (err, isMatch) {
                if (err) {
                    console.log(err)
                    return res.status(401).send('erro')
                }

                if (!isMatch) {
                    return res.status(404).send('Senha Inválida')
                }

                if (isMatch && isMatch === true) {
                    req.session.user = user

                    sess = req.session                    
                    console.log(user)
                    req.session.save()
                    return res.status(200).send(user)
                }
            })

        } catch{
            console.log(err)
        }
    },
    //metodo temporario remover ao finalizar
    async listarUsuarios(req, res) {

        const users = await User.find().sort('-timestamps')

        return res.status(200).send(users)
    },

    async adresses(req, res) {
        if (!sess.user) {
           
            return res.status(401).send('Usuário não logado')

        } else {    
            console.log(sess.user)
            return res.status(200).send(sess.user)
        }

    },


    async logout(req, res) {
        req.session.destroy()

        return res.status(200).send('usuário deslogado')
    },


    async updateUser(req, res) {

        const id = await req.session.user._id
        if (req.file) {
            var { filename: image } = await req.file
        }



        if (req.file) {

            const [name] = image.split('.')
            var fileName = `${name}.jpg`

            await sharp(req.file.path)
                .resize(200)
                .jpeg({ quality: 50 })
                .toFile(path.resolve(req.file.destination, 'resized', fileName))

            fs.unlinkSync(req.file.path)
        }

        User.findOne({ _id: id }, (err, foundUser) => {

            if (err) {
                console.log(err)
                res.status(500).send('Erro ao atualizar dados')

            } else {

                if (!foundUser) {
                    res.status(404).send('Usuário não encontrado')

                } else {
                    if (req.body.name) {
                        foundUser.name = req.body.name
                    }

                    if (req.body.adresses) {
                        foundUser.adresses = req.body.adresses
                    }

                    if (req.body.gender) {
                        foundUser.gender = req.body.gender
                    }

                    if (req.body.birthdate) {
                        foundUser.birthdate = req.body.birthdate
                    }
                    if (fileName) {
                        foundUser.image = fileName
                    }

                    foundUser.save((err, updatedUser) => {
                        if (err) {
                            console.log(err)
                            res.status(500).send()
                        } else {
                            res.status(200).send(updatedUser)
                        }
                    })
                }
            }
        })

    },

    async register(req, res) {

        const { email, password } = req.body

        const newUser = new User()

        newUser.email = email
        newUser.password = password

        newUser.save(function (err, savedUser) {

            if (err) {
                console.log(err)
                return res.status(500).send()
            }
            console.log(savedUser)
            return res.status(200).send(savedUser)

        })


    },


}