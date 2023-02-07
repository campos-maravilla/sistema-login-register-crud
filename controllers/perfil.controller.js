const User = require("../models/User")
const path = require("path");
const fs = require('fs');
const jimp = require("jimp");
const formidable = require("formidable")

module.exports.formPerfil = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        return res.render("perfil", { mensajes: req.flash("mensajes"), user: req.user, imagen: user.imagen, userName: req.user.userName })

    } catch (error) {
        req.flash("mensajes", [{ msg: 'Error al leer el usuario' }])
        return res.render("perfil")
    }
}

module.exports.editarFotoPerfil = async (req, res) => {
    const form = new formidable.IncomingForm()
    form.maxFileSize = 50 * 1024 * 1024

    form.parse(req, async (err, fields, files) => {
        try {
            if (err) {
                throw new Error('Hay problemas con la subida de imagen')
            }
            const file = files.myFile

            if (file.originalFilename === '') {
                throw new Error('Por favor agrega una imagen')
            }

            if (!file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
                throw new Error('Agrega una imagen jpg o png')
            }
            if (file.size > 50 * 1024 * 1024) {
                throw new Error('La imageb no debe exceder de 5 mb')
            }
            const extension = file.mimetype.split("/")[1]
            const dirFile = path.join(__dirname, `../public/img/perfiles/${req.user.id}.${extension}`)
            console.log(dirFile)
            fs.renameSync(file.filepath, dirFile)

            const image = await jimp.read(dirFile)
            image.resize(200, 200).quality(90).writeAsync(dirFile)

            const user = await User.findById(req.user.id)
            user.imagen = `${req.user.id}.${extension}`
            await user.save()

            req.flash("mensajes", [{ msg: 'Imagen subida con exitó' }])
        } catch (error) {
            req.flash("mensajes", [{ msg: error.message }])

        } finally {
            return res.redirect("/perfil")
        }
    })
}

