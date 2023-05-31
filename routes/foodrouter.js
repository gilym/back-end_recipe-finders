const express = require('express')
const foodrouter = express.Router()
const Multer = require('multer')
const imgUpload = require('../modules/imgUpload')
const connection = require('../db');

// Router for /food endpoint
foodrouter.get("/food", (req, res) => {
    const query = "SELECT * FROM food";
    connection.query(query, (err, rows, field) => {
        if(err) {
            res.status(500).send({message: err.sqlMessage});
        } else {
            res.json(rows);
        }
    });
});
// foodrouter for /food/:id endpoint
foodrouter.get("/food/:id", (req, res) => {
    const id = req.params.id;

    const query = "SELECT * FROM food WHERE id = ?";
    connection.query(query, [id], (err, rows, field) => {
        if(err) {
            res.status(500).send({message: err.sqlMessage});
        } else {
            res.json(rows);
        }
    });
});
// foodrouter for /food/:id endpoint
foodrouter.delete("/food/:id", (req, res) => {
    const id = req.params.id;

    const query = "DELETE FROM food WHERE id = ?";
    connection.query(query, [id], (err, rows, field) => {
        if (err) {
            res.status(500).send({message: err.sqlMessage});
        } else {
            res.send({message: "Delete successful"});
        }
    });
});

module.exports = foodrouter