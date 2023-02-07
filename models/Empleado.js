const mongoose = require('mongoose')

const { Schema } = mongoose
const empleadoSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    telefono: {
        type: Number,
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
})

const Empleado = mongoose.model("Empleado", empleadoSchema)
module.exports = Empleado