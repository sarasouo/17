// Banco de dados simples em arquivo JSON para Node.js (robusto)
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'db.json');
const DB_TEMPLATE = { usuarios: [], vendas: [], gastos: [], fiados: [] };

function loadDB() {
    try {
        if (!fs.existsSync(DB_FILE)) {
            fs.writeFileSync(DB_FILE, JSON.stringify(DB_TEMPLATE, null, 2));
            return { ...DB_TEMPLATE };
        }
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        let db = JSON.parse(raw);
        // Garante que todas as coleções existem
        for (const key of Object.keys(DB_TEMPLATE)) {
            if (!db[key]) db[key] = [];
        }
        return db;
    } catch (err) {
        console.error('Erro ao carregar o banco de dados:', err);
        // Em caso de erro, retorna um banco vazio seguro
        return { ...DB_TEMPLATE };
    }
}

function saveDB(db) {
    try {
        // Validação básica
        for (const key of Object.keys(DB_TEMPLATE)) {
            if (!Array.isArray(db[key])) db[key] = [];
        }
        fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
    } catch (err) {
        console.error('Erro ao salvar o banco de dados:', err);
        throw new Error('Falha ao salvar o banco de dados.');
    }
}

module.exports = {
    loadDB,
    saveDB,
    DB_FILE
};
// Para produção, considere usar um lock de arquivo (ex: pacote proper-lockfile) para evitar corrupção em acessos concorrentes.
