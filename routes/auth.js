

const express = require("express")
const { body } = require('express-validator');
const { loginForm, registerForm, register, loginUsuario, cerrarSession } = require("../controllers/auth.controller")
const router = express.Router()

router.get("/register", registerForm)

router.post("/register", [
    body("userName", "Ingrese un nombre válido").trim().notEmpty().escape().not().isNumeric()
        .withMessage('Solo se aceptan letras'),
    body("email", "Ingrese un email valido").trim().isEmail().normalizeEmail(),
    body("password", "Contraseña de minimo 6 carácteres")
        .trim()
        .isLength({ min: 4 }).escape().custom((value, { req }) => {
            if (value !== req.body.repitepassword) {
                throw new Error('No coinciden las contraseñas')
            } else {
                return value
            }
        })
], register)
router.get("/login", loginForm)
router.post("/login", [
    body("email", "Ingrese un email valido")
        .trim().isEmail().normalizeEmail(),
    body("password", "Contraseña de minimo 6 carácteres")
        .trim()
        .isLength({ min: 6 }).escape(),
], loginUsuario)

router.get("/logout", cerrarSession)
module.exports = router