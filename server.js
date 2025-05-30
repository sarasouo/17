// Servidor Express principal para PanificaApp
const express = require('express');
const cors = require('cors');
const vendasRoutes = require('./backend/vendas');
const gastosRoutes = require('./backend/gastos');
const fiadosRoutes = require('./backend/fiados');

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// Rotas principais
app.use('/api/vendas', vendasRoutes);
app.use('/api/gastos', gastosRoutes);
app.use('/api/fiados', fiadosRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.send('PanificaApp backend rodando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
