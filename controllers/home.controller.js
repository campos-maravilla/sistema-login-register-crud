const Empleado = require("../models/Empleado")
const { validationResult } = require('express-validator');
const Usuario = require("../models/User")

const getEmpleados = async (req, res) => {

    try {
        const empleados = await Empleado.find({ user: req.user.id }).lean()

        res.render('home', { empleados: empleados, user: req.user, mensajes: req.flash("mensajes") })

    } catch (error) {
        console.log(error)
        console.log('algo falló')
    }

}

const createEmpleados = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash("mensajes", errors.array())
        return res.redirect('/')
    }
    const { nombre, email, telefono, direccion } = req.body

    try {
        const empleado = new Empleado({ nombre, email, telefono, direccion, user: req.user.id })
        await empleado.save()

        req.flash("mensajes", [{ msg: "Empleado agreago con exito." }])
        res.redirect('/')
    } catch (error) {
        console.log(error)

        req.flash("mensajes", [{ msg: error.message }])
        return res.redirect("/")
    }
}

const deleteEmpleados = async (req, res) => {
    const { id } = req.params
    try {
        const empleado = await Empleado.findById(id)

        empleado.remove()
        res.redirect('/')
    } catch (error) {
        console.log(error)
    }
}

const editEmpleadosForms = async (req, res) => {
    const { id } = req.params
    try {
        const empleadoEdit = await Empleado.findById(id).lean()
        console.log(empleadoEdit)
        return res.render('home', { empleadoEdit })
    } catch (error) {
        console.log(error)
        return res.redirect('/')
    }
}

const editEmpleados = async (req, res) => {
    const { id } = req.params
    const { nombre, correo, telefono, direccion } = req.body

    try {

        await Empleado.findByIdAndUpdate(id, { nombre, correo, telefono, direccion })
        res.redirect('/')
    } catch (error) {
        console.log(error)
        return res.redirect('/')
    }
}


module.exports = {
    getEmpleados,
    createEmpleados,
    deleteEmpleados,
    editEmpleadosForms,
    editEmpleados
}