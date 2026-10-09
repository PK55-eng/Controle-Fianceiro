
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
        headers: { 'Content-Type': 'application/json' },
        ...(corpo ? { body: JSON.stringify(corpo) } : {})
      }
    );

    const dados = await resposta.json();

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

test('GET /api/transacoes retorna HTTP 200', async () => {
  const resposta = await requisicao('GET', '/api/transacoes');

  assert.equal(resposta.status, 200);
  assert.ok(Array.isArray(resposta.dados));
});

test('POST /api/transacoes rejeita valor negativo', async () => {
  const resposta = await requisicao('POST', '/api/transacoes', {
    descricao: 'Teste valor negativo',
    valor: -50,
    tipo: 'DESPESA',
    data: '2026-10-09',
    contaId: 1,
    categoriaId: 3
  });

  assert.equal(resposta.status, 400);
  assert.equal(resposta.dados.erro, 'Dados inválidos');
});

test('POST /api/transacoes rejeita descricao vazia', async () => {
  const resposta = await requisicao('POST', '/api/transacoes', {
    descricao: '',
    valor: 50,
    tipo: 'DESPESA',
    data: '2026-10-09',
    contaId: 1,
    categoriaId: 3
  });

  assert.equal(resposta.status, 400);
  assert.equal(resposta.dados.erro, 'Dados inválidos');
});

test('GET /api/dashboard retorna HTTP 200', async () => {
  const resposta = await requisicao('GET', '/api/dashboard');

  assert.equal(resposta.status, 200);
  assert.equal(typeof resposta.dados, 'object');
  assert.notEqual(resposta.dados, null);
});
