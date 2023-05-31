const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const preferences = require('./routes/preferencesrouter')
const city = require('./routes/cityrouter')
const food = require('./routes/foodrouter')
const recipe = require('./routes/recipesrouter')
const user = require('./routes/usersrouter')
const history = require('./routes/historyrouter')

app.use(bodyParser.urlencoded({extended: true}))
app.use(preferences)
app.use(city)
app.use(food)
app.use(recipe)
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