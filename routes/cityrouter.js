const express = require('express')
const cityrouter = express.Router()
const Multer = require('multer')
const imgUpload = require('../modules/imgUpload')
const connection = require('../db');

cityrouter.get("/getCity", (req, res) => {
    const query = "SELECT * FROM city"
    connection.query(query, (err, rows, field) => {
        if(err) {
            res.status(500).send({message: err.sqlMessage})
        } else {
            res.json(rows)
        }
    })
})
cityrouter.get("/getCity/:id", (req, res) => {
    const id = req.params.id

    const query = "SELECT * FROM city WHERE id = ?"
    connection.query(query, [id], (err, rows, field) => {
        if(err) {
            res.status(500).send({message: err.sqlMessage})
        } else {
            res.json(rows)
        }
    })
})
cityrouter.delete("/deleteCity/:id", (req, res) => {
    const id = req.params.id
    
    const query = "DELETE FROM city WHERE id = ?"
    connection.query(query, [id], (err, rows, fields) => {
        if (err) {
            res.status(500).send({message: err.sqlMessage})
        } else {
            res.send({message: "Delete successful"})
        }
    })
})

module.exports = cityrouter