
const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

const app = require('../src/app');

async function requisicao(metodo, caminho, corpo) {
  const servidor = http.createServer(app);

  await new Promise((resolve) => {
    servidor.listen(0, '127.0.0.1', resolve);
  });

  try {
    const porta = servidor.address().port;

    const resposta = await fetch(
      `http://127.0.0.1:${porta}${caminho}`,
      {
        method: metodo,
        headers: {
          'Content-Type': 'application/json'
        },
        ...(corpo !== undefined
          ? { body: JSON.stringify(corpo) }
          : {})
      }
    );

    const texto = await resposta.text();
    const dados = texto ? JSON.parse(texto) : null;

    return {
      status: resposta.status,
      dados
    };
  } finally {
    await new Promise((resolve, reject) => {
      servidor.close((erro) => {
        if (erro) reject(erro);
        else resolve();
      });
    });
  }
}

// TESTE 01 — CONSULTAR TRANSAÇÕES

test('GET /api/transacoes retorna HTTP 200', async () => {
  const resposta = await requisicao(
    'GET',
    '/api/transacoes'
  );

  assert.equal(resposta.status, 200);
  assert.ok(Array.isArray(resposta.dados));
});

// TESTE 02 — REJEITAR VALOR NEGATIVO

test('POST /api/transacoes rejeita valor negativo', async () => {
  const resposta = await requisicao(
    'POST',
    '/api/transacoes',
    {
      descricao: 'Teste valor negativo',
      valor: -50,
      tipo: 'DESPESA',
      data: '2026-10-09',
      contaId: 1,
      categoriaId: 3
    }
  );

  assert.equal(resposta.status, 400);
  assert.equal(resposta.dados.erro, 'Dados inválidos');
});

// TESTE 03 — REJEITAR DESCRIÇÃO VAZIA

test('POST /api/transacoes rejeita descricao vazia', async () => {
  const resposta = await requisicao(
    'POST',
    '/api/transacoes',
    {
      descricao: '',
      valor: 50,
      tipo: 'DESPESA',
      data: '2026-10-09',
      contaId: 1,
      categoriaId: 3
    }
  );

  assert.equal(resposta.status, 400);
  assert.equal(resposta.dados.erro, 'Dados inválidos');
});

// TESTE 04 — CONSULTAR DASHBOARD

test('GET /api/dashboard retorna HTTP 200', async () => {
  const resposta = await requisicao(
    'GET',
    '/api/dashboard'
  );

  assert.equal(resposta.status, 200);
  assert.equal(typeof resposta.dados, 'object');
  assert.notEqual(resposta.dados, null);
});

// TESTE 05 — EDITAR TRANSAÇÃO INEXISTENTE

test('PUT /api/transacoes/999999 retorna HTTP 404', async () => {
  const resposta = await requisicao(
    'PUT',
    '/api/transacoes/999999',
    {
      descricao: 'Teste inexistente',
      valor: 100,
      tipo: 'DESPESA',
      data: '2026-10-09',
      contaId: 1,
      categoriaId: 3
    }
  );

  assert.equal(resposta.status, 404);
  assert.equal(
    resposta.dados.erro,
    'Transação não encontrada.'
  );
});

// TESTE 06 — EXCLUIR TRANSAÇÃO INEXISTENTE

test('DELETE /api/transacoes/999999 retorna HTTP 404', async () => {
  const resposta = await requisicao(
    'DELETE',
    '/api/transacoes/999999'
  );

  assert.equal(resposta.status, 404);
  assert.equal(
    resposta.dados.erro,
    'Transação não encontrada.'
  );
});
