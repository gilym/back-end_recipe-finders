const express = require('express')
const historyrouter = express.Router()
const Multer = require('multer')
const imgUpload = require('../modules/imgUpload')
const connection = require('../db');

historyrouter.get("/history", (req, res) => {
    const query = "SELECT * FROM history";
    connection.query(query, (err, rows, field) => {
        if(err) {
            res.status(500).send({message: err.sqlMessage});
        } else {
            res.json(rows);
        }
    });
});

historyrouter.get("/history/:id", (req, res) => {
    const id = req.params.id;

    const query = "SELECT * FROM history WHERE id = ?";
    connection.query(query, [id], (err, rows, field) => {
        if(err) {
            res.status(500).send({message: err.sqlMessage});
        } else {
            res.json(rows);
        }
    });
});

// historyrouter for /history/:id endpoint
historyrouter.delete("/history/:id", (req, res) => {
    const id = req.params.id;
    const query = "DELETE FROM history WHERE id = ?";
    connection.query(query, [id], (err, rows, field) => {
        if (err) {
            res.status(500).send({message: err.sqlMessage});
        } else {
            res.send({message: "Delete successful"});
        }
    });
});
module.exports= historyrouter