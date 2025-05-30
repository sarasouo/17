// Rotas de vendas para PanificaApp
const express = require('express');
const router = express.Router();
const { loadDB, saveDB } = require('../data');

// GET /api/vendas/usuario/:usuarioId
router.get('/usuario/:usuarioId', (req, res) => {
    const db = loadDB();
    const vendas = db.vendas.filter(v => v.usuario && v.usuario.nome === req.params.usuarioId);
    res.json(vendas);
});

// POST /api/vendas
router.post('/', (req, res) => {
    const { descricao, valor, data, usuario } = req.body;
    if (!descricao || typeof valor !== 'number' || !data || !usuario || !usuario.nome) {
        return res.status(400).json({ message: 'Dados de venda inválidos.' });
    }
    const db = loadDB();
    const novaVenda = { descricao, valor, data, usuario };
    db.vendas.push(novaVenda);
    saveDB(db);
    res.status(201).json(novaVenda);
});

module.exports = router;
