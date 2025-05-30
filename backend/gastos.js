// Rotas de gastos para PanificaApp
const express = require('express');
const router = express.Router();
const { loadDB, saveDB } = require('../data');

// GET /api/gastos/usuario/:usuarioId
router.get('/usuario/:usuarioId', (req, res) => {
    const db = loadDB();
    const gastos = db.gastos.filter(g => g.usuario && g.usuario.nome === req.params.usuarioId);
    res.json(gastos);
});

// POST /api/gastos
router.post('/', (req, res) => {
    const { descricao, valor, data, usuario } = req.body;
    if (!descricao || typeof valor !== 'number' || !data || !usuario || !usuario.nome) {
        return res.status(400).json({ message: 'Dados de gasto inválidos.' });
    }
    const db = loadDB();
    const novoGasto = { descricao, valor, data, usuario };
    db.gastos.push(novoGasto);
    saveDB(db);
    res.status(201).json(novoGasto);
});

module.exports = router;
