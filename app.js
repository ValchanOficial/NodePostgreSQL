const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const { Pool } = require('pg');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
//-------------------------------------Connect to Database
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'db',
    password: 'root',
    port: 5433
});
//-------------------------------------CRUD
app.get('/find', (req, res) => {
    pool.query('SELECT * FROM "user" ORDER BY id', (error, result) => {
        if (error) {
            res.status(500).json({ message: error.message || "Some error occurred!" });
        }
        res.status(200).json(result.rows);
    });
});

app.get('/find/:userId', (req, res) => {
    pool.query('SELECT * FROM "user" WHERE id = $1', [req.params.userId], (error, result) => {
        if (error) {
            res.status(500).json({ message: error.message || "Some error occurred!" });
        }
        res.status(200).json(result.rows);
    });
});

app.post('/create', (req, res) => {
    pool.query('INSERT INTO "user" (name, email) VALUES ($1, $2) returning id', [req.body.name, req.body.email], (error, result) => {
        if (error) {
            res.status(500).json({ message: error.message || "Some error occurred!" });
        }
        res.status(200).json("User successfully created! ID: " + result.rows[0].id);
    });
});

app.put('/update/:userId', (req, res) => {
    pool.query('UPDATE "user" SET name = $2, email = $3 WHERE id = $1 returning id', [req.params.userId, req.body.name, req.body.email], (error, result) => {
        if (error) {
            res.status(500).json({ message: error.message || "Some error occurred!" });
        }
        res.status(200).json("User successfully updated! ID: " + result.rows[0].id);
    });
});


app.delete('/delete/:userId', (req, res) => {
    pool.query('DELETE FROM "user" WHERE id = $1', [req.params.userId], (error, result) => {
        if (error) {
            res.status(500).json({ message: error.message || "Some error occurred!" });
        }
        res.status(200).json("User successfully deleted!");
    });
});
//-------------------------------------
app.listen(PORT, () => {
    console.log(`Server is up and running on port: ${PORT}`);
});
