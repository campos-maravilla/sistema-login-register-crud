const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
require('dotenv').config()

const clientDB = mongoose.connect(process.env.URI)
    .then((m) => {
        console.log('db conectada')
        return m.connection.getClient()
    })
    .catch((e) => console.log('falló la conexión'))

module.exports = clientDB