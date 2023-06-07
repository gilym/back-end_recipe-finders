const express = require('express')
const usersrouter = express.Router()
const Multer = require('multer')
const imgUpload = require('../modules/imgUpload')
const connection = require('../db');
const jwt = require('jsonwebtoken');



const multer = Multer({
    storage: Multer.MemoryStorage,
    fileSize: 5 * 1024 * 1024
})

usersrouter.get("/users", verifyToken, (req, res) => {
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

// usersrouter.post('/users', multer.single('img'), imgUpload.uploadToGcs, (req, res) => {
//     const { username, password, preferences } = req.body;
//     const imageUrl = req.file ? req.file.cloudStoragePublicUrl : '';
  
//     const query = 'INSERT INTO users (username, password, preferences, img) VALUES (?, ?, ?, ?)';
//     connection.query(query, [username, password, preferences, imageUrl], (err, result) => {
//       if (err) {
//         res.status(500).send({ message: err.sqlMessage });
//       } else {
//         res.status(201).send({ message: 'User inserted successfully', insertId: result.insertId });
//       }
//     });
//   });

// Register User
usersrouter.post("/users/register", (req, res) => {
  const {name, username, password} = req.body;
  const query = 'INSERT INTO users (name, username, password) VALUES (?, ?, ?)';
  connection.query(query, [name, username, password], (err, result) => {
    if (err) {
      res.status(500).send({ message: err.sqlMessage });
    } else {
      res.status(201).send({ message: 'Registration Successful', insertId: result.insertId });
    }
  });
});

// Login User
usersrouter.post("/users/login", (req, res) => {
  const {username, password} = req.body;
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  connection.query(query, [username, password], (err, rows) => {
    if (err) {
      res.status(500).send({ message: err.sqlMessage });
    } else {
      if (rows.length === 0) {
        res.status(404).send({ message: 'User not found' });
      } else if (rows.length > 0) {
        const user = rows[0];
        const token = jwt.sign({id : user.id}, 'secret_key')
        res.status(200).send({ message: 'Login Successful', data: rows[0], token: token });
      }
    }
  });
});



  usersrouter.put('/edit_Pass/:id', (req, res) => {
    const id = req.params.id;
    const { password } = req.body;
    const query = 'UPDATE users SET password = ? WHERE id = ?';
    connection.query(query, [password, id], (err, result) => {
      if (err) {
        res.status(500).send({ message: err.sqlMessage });
      } else {
        if (result.affectedRows === 0) {
          res.status(404).send({ message: 'User not found' });
        } else {
          res.status(200).send({ message: 'User password updated successfully' });
        }
      }
    });
  });

  usersrouter.put('/users/:id', multer.single('img'), imgUpload.uploadToGcs, (req, res) => {
    const id = req.params.id;
    const { username, preferences } = req.body;
    let imageUrl = '';
  
    if (req.file && req.file.cloudStoragePublicUrl) {
      imageUrl = req.file.cloudStoragePublicUrl;
    }
  
    const query = 'UPDATE users SET username = ?, preferences = ?, img = ? WHERE id = ?';
    connection.query(query, [username, preferences, imageUrl, id], (err, result) => {
      if (err) {
        res.status(500).send({ message: err.sqlMessage });
      } else {
        if (result.affectedRows === 0) {
          res.status(404).send({ message: 'Users not found' });
        } else {
          res.status(200).send({ message: 'Users updated successfully' });
        }
      }
    });
  });


// Verify Token untuk autentikasi setelah melakukan login
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).send({ message: 'You are not logged in' });
}
jwt.verify(token, 'secret_key', (err, decoded) => { 
  if (err) {
      return res.status(500).send({ message: 'Failed to authenticate token' })
  }
  req.userId = decoded.id // Menyimpan ID pengguna yang terotentikasi dalam objek permintaan (request)
  next()
})
}

  

  
  


module.exports=usersrouter