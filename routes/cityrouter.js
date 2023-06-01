const express = require('express')
const cityrouter = express.Router()
const Multer = require('multer')
const imgUpload = require('../modules/imgUpload')
const connection = require('../db');

const multer = Multer({
    storage: Multer.MemoryStorage,
    fileSize: 5 * 1024 * 1024
})

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

cityrouter.put("/updateCity/:id", (req, res) => {
    const id = req.params.id;
    const { name, description, img } = req.body;
  
    const query = "UPDATE city SET name = ?, description = ?, img = ? WHERE id = ?";
    connection.query(query, [name, description, img, id], (err, result) => {
      if (err) {
        res.status(500).send({ message: err.sqlMessage });
      } else {
        if (result.affectedRows === 0) {
          res.status(404).send({ message: "City not found" });
        } else {
          res.status(200).send({ message: "City updated successfully" });
        }
      }
    });
  });
  
  

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

cityrouter.post('/city', multer.single('img'), imgUpload.uploadToGcs, (req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    let imageUrl = '';

    if (req.file && req.file.cloudStoragePublicUrl) {
        imageUrl = req.file.cloudStoragePublicUrl;
    }

    const query = 'INSERT INTO city (name, description, img) VALUES (?, ?, ?)';
    connection.query(query, [name, description, imageUrl], (err, result) => {
        if (err) {
            res.status(500).send({ message: err.sqlMessage });
        } else {
            res.status(201).send({ message: 'Data inserted successfully', insertId: result.insertId });
        }
    });
});


module.exports = cityrouter