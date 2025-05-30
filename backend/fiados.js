// Rotas de fiados para PanificaApp
const express = require('express');
const router = express.Router();
const { loadDB, saveDB } = require('../data');

// GET /api/fiados/usuario/:usuarioId
router.get('/usuario/:usuarioId', (req, res) => {
    const db = loadDB();
    const fiados = db.fiados.filter(f => f.usuario && f.usuario.nome === req.params.usuarioId);
    res.json(fiados);
});

// POST /api/fiados
router.post('/', (req, res) => {
    const { nomeCliente, valor, data, usuario } = req.body;
    if (!nomeCliente || typeof valor !== 'number' || !data || !usuario || !usuario.nome) {
        return res.status(400).json({ message: 'Dados de fiado inválidos.' });
    }
    const db = loadDB();
    const novoFiado = { nomeCliente, valor, data, usuario };
    db.fiados.push(novoFiado);
    saveDB(db);
    res.status(201).json(novoFiado);
});

module.exports = router;
