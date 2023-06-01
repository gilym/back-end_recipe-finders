const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const preferences = require('./routes/preferencesrouter')
const food = require('./routes/foodrouter')
const user = require('./routes/usersrouter')
const history = require('./routes/historyrouter')

app.use(bodyParser.json()); // Middleware untuk mem-parsing body request dalam format JSON
app.use(bodyParser.urlencoded({extended: true})); // Middleware untuk mem-parsing body request dalam format application/x-www-form-urlencoded
app.use(preferences)
app.use(food)

app.use(user)
app.use(history)

app.get("/", (req, res) => {
    console.log("Response success")
    res.send("Response Success!")
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log("Server is up and listening on " + PORT)
})
