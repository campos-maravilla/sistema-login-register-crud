const express = require('express')
const session = require('express-session')
const flash = require('connect-flash')
const MongoStore = require('connect-mongo')
const passport = require("passport")
const User = require("./models/User");
const { create } = require('express-handlebars')
const home = require('./routes/home')
require('dotenv').config()
const clientDB = require('./database/db')

const app = express()

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    name: "secret-name-pi-pi-pi",
    store: MongoStore.create({
        clientPromise: clientDB,
        dbName: 'SystemRegister',
    })
}))

app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) => done(null, { id: user._id, userName: user.userName }))
passport.deserializeUser(async (user, done) => {
    const userDB = await User.findById(user.id)
    return done(null, { id: userDB._id, userName: userDB.userName })
})


const hbs = create({
    extname: ".hbs",
    partialsDir: ["views/components"],
});



app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");


app.use(express.urlencoded({ extended: true }))
app.use("/", home)
app.use("/auth", require('./routes/auth'))


app.use(express.static(__dirname + "/public"));

const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log('servidor corriendo')