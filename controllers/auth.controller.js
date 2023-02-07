const User = require("../models/User")
const { validationResult } = require('express-validator');
const { nanoid } = require('nanoid')

const registerForm = (req, res) => {
    res.render('register', { mensajes: req.flash("mensajes") })
}
const loginForm = (req, res) => {
    res.render('login', { mensajes: req.flash("mensajes") })
}

const register = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash("mensajes", errors.array())
    }
    const { userName, email, password, tokenConfirm } = req.body
    try {

        let user = await User.findOne({ email })
        if (user) throw new Error("Ya existe el usuario")

        user = new User({
            userName, email, password, tokenConfirm: nanoid()
        })
        await user.save()
        res.redirect("/auth/login")
    } catch (error) {
        console.log(error)
        req.flash("mensajes", [{ msg: error.message }])
        return res.redirect("/auth/register")
    }
}

const loginUsuario = async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash("mensajes", errors.array())
    }
    const { password, email } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) throw new Error("No existe el correo")


        if (!await user.comparePassword(password)) throw new Error("Contraseña incorrecta")
        req.login(user, function (err) {
            if (err) throw new Error('Error al crear la session')
            return res.redirect("/")
        })

    } catch (error) {
        req.flash("mensajes", [{ msg: error.message }])
        return res.redirect("/auth/login")
    }
}

const cerrarSession = (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err) }
        res.redirect('/auth/login')

    })
}

module.exports = {
    loginForm,
    registerForm,
    register,
    loginUsuario,
    cerrarSession
}