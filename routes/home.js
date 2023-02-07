
const express = require("express")
const { body } = require('express-validator');
const { getEmpleados, createEmpleados, deleteEmpleados, editEmpleadosForms, editEmpleados } = require("../controllers/home.controller");
const { formPerfil, editarFotoPerfil } = require("../controllers/perfil.controller");
const verificarUsuario = require("../middlewares/verificarUsuario");
const router = express.Router()

router.get("/", verificarUsuario, getEmpleados)
router.post("/", [
    body("nombre", "Ingrese un nombre válido").trim().notEmpty().escape().not().isNumeric()
        .withMessage('Solo se aceptan letras'),
    body("email", "Ingrese un email valido").trim().isEmail().normalizeEmail(),
    body("telefono", "Ingrese un número de telefono").trim().notEmpty().escape().isNumeric()
        .withMessage('Solo se aceptan numeros'),
    body("direccion", "Ingrese una dirección").trim().notEmpty().escape(),
], verificarUsuario, createEmpleados)
router.get("/eliminar/:id", deleteEmpleados)
router.get("/editar/:id", editEmpleadosForms)

router.post("/editar/:id", editEmpleados)

router.get("/perfil", verificarUsuario, formPerfil)
router.post("/perfil", verificarUsuario, editarFotoPerfil)



module.exports = router