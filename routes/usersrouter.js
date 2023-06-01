const express = require('express')
const usersrouter = express.Router()
const Multer = require('multer')
const imgUpload = require('../modules/imgUpload')
const connection = require('../db');


const multer = Multer({
    storage: Multer.MemoryStorage,
    fileSize: 5 * 1024 * 1024
})

usersrouter.get("/users", (req, res) => {
    const query = "SELECT * FROM users";
    connection.query(query, (err, rows, field) => {
        if(err) {
            res.status(500).send({message: err.sqlMessage});
        } else {
            res.json(rows);
        }
    });
});
// usersrouter for /users/:id endpoint
usersrouter.get("/users/:id", (req, res) => {
    const id = req.params.id;

    const query = "SELECT * FROM users WHERE id = ?";
    connection.query(query, [id], (err, rows, field) => {
        if(err) {
            res.status(500).send({message: err.sqlMessage});
        } else {
            res.json(rows);
        }
    });
});
// usersrouter for /users/:id endpoint
usersrouter.delete("/users/:id", (req, res) => {
    const id = req.params.id;

    const query = "DELETE FROM users WHERE id = ?";
    connection.query(query, [id], (err, rows, field) => {
        if (err) {
            res.status(500).send({message: err.sqlMessage});
        } else {
            res.send({message: "Delete successful"});
        }
    });
});

usersrouter.post('/users', multer.single('img'), imgUpload.uploadToGcs, (req, res) => {
    const { username, password, preferences } = req.body;
    const imageUrl = req.file ? req.file.cloudStoragePublicUrl : '';
  
    const query = 'INSERT INTO users (username, password, preferences, img) VALUES (?, ?, ?, ?)';
    connection.query(query, [username, password, preferences, imageUrl], (err, result) => {
      if (err) {
        res.status(500).send({ message: err.sqlMessage });
      } else {
        res.status(201).send({ message: 'User inserted successfully', insertId: result.insertId });
      }
    });
  });
  


module.exports=usersrouter