const express = require('express')
const historyrouter = express.Router()
const Multer = require('multer')
const imgUpload = require('../modules/imgUpload')
const connection = require('../db');

const multer = Multer({
    storage: Multer.MemoryStorage,
    fileSize: 5 * 1024 * 1024
})

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

historyrouter.post('/history', multer.single('img'), imgUpload.uploadToGcs, (req, res) => {
    const { user_id } = req.body;
    const imageUrl = req.file ? req.file.cloudStoragePublicUrl : '';
  
    const query = 'INSERT INTO history (user_id, img) VALUES (?, ?)';
    connection.query(query, [user_id, imageUrl], (err, result) => {
      if (err) {
        res.status(500).send({ message: err.sqlMessage });
      } else {
        res.status(201).send({ message: 'History inserted successfully', insertId: result.insertId });
      }
    });
  });
module.exports= historyrouter