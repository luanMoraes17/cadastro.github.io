const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Add this test route
app.get('/test', (req, res) => {
    res.send('Hello World! Server is working.');
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '@Luan050247',
    database: 'client_management'
});


db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
    
    // Create table if it doesn't exist
    const createTable = `
        CREATE TABLE IF NOT EXISTS clients (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            telefone VARCHAR(20) NOT NULL
        )
    `;
    
    db.query(createTable, (err) => {
        if (err) console.error('Error creating table:', err);
    });
});

// Create client
app.post('/clients', (req, res) => {
    const { nome, email, telefone } = req.body;
    db.query('INSERT INTO clients (nome, email, telefone) VALUES (?, ?, ?)',
        [nome, email, telefone],
        (err, result) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(201).json({ id: result.insertId });
        });
});

// Get all clients
app.get('/clients', (req, res) => {
    db.query('SELECT * FROM clients', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// Get single client
app.get('/clients/:id', (req, res) => {
    db.query('SELECT * FROM clients WHERE id = ?', [req.params.id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results[0]);
    });
});

// Update client
app.put('/clients/:id', (req, res) => {
    const { nome, email, telefone } = req.body;
    db.query('UPDATE clients SET nome = ?, email = ?, telefone = ? WHERE id = ?',
        [nome, email, telefone, req.params.id],
        (err) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'Updated successfully' });
        });
});

// Delete client
app.delete('/clients/:id', (req, res) => {
    db.query('DELETE FROM clients WHERE id = ?', [req.params.id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Deleted successfully' });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});