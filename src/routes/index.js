const r = require('express').Router();

const t = require('../controllers/transacaoController');
const c = require('../controllers/catalogoController');
const d = require('../controllers/dashboardController');


// ========================================
// DASHBOARD
// ========================================

r.get('/dashboard', d.resumo);


// ========================================
// TRANSAÇÕES
// ========================================

r.get('/transacoes', t.listar);

r.post('/transacoes', t.criar);

r.put('/transacoes/:id', t.atualizar);

r.delete('/transacoes/:id', t.remover);


// ========================================
// CONTAS
// ========================================

r.get('/contas', c.contas);

r.post('/contas', c.criarConta);


// ========================================
// CATEGORIAS
// ========================================

r.get('/categorias', c.categorias);

r.post('/categorias', c.criarCategoria);


// ========================================
// EXPORTAÇÃO
// ========================================

module.exports = r;