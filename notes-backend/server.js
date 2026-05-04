const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

// middleware
app.use(cors());
app.use(express.json());

// koneksi ke database
const db = mysql.createConnection({
  host: '34.172.113.167',
  user: 'admin',
  password: 'mypassword', 
  database: 'notes_123230064'
});

// cek koneksi
db.connect((err) => {
  if (err) {
    console.log('Koneksi gagal:', err);
  } else {
    console.log('Terhubung ke MySQL');
  }
});

// 1. GET semua notes
app.get('/notes', (req, res) => {
  const sql = 'SELECT * FROM notes';

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});


// 2. POST tambah note
app.post('/notes', (req, res) => {
  const { judul, isi } = req.body;

  const sql = 'INSERT INTO notes (judul, isi) VALUES (?, ?)';
  db.query(sql, [judul, isi], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Note berhasil ditambahkan' });
  });
});


// 3. PUT update note
app.put('/notes/:id', (req, res) => {
  const { id } = req.params;
  const { judul, isi } = req.body;

  const sql = 'UPDATE notes SET judul=?, isi=? WHERE id=?';
  db.query(sql, [judul, isi, id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Note berhasil diupdate' });
  });
});


// 4. DELETE note
app.delete('/notes/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM notes WHERE id=?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: 'Note berhasil dihapus' });
  });
});


// start server
app.listen(PORT, () => {
  console.log(`Server jalan di port ${PORT}`);
});