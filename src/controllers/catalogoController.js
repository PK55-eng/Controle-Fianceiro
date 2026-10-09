const p = require('../lib/prisma');
const { z } = require('zod');


// ========================================
// VALIDAÇÃO DE CONTA
// ========================================

const contaSchema = z.object({
  nome: z
    .string()
    .min(2, 'O nome da conta deve ter pelo menos 2 caracteres.'),

  tipo: z
    .string()
    .min(2, 'Informe o tipo da conta.'),

  saldoInicial: z.coerce
    .number()
    .default(0)
});


// ========================================
// VALIDAÇÃO DE CATEGORIA
// ========================================

const categoriaSchema = z.object({
  nome: z
    .string()
    .min(2, 'O nome da categoria deve ter pelo menos 2 caracteres.'),

  tipo: z.enum(['RECEITA', 'DESPESA'])
});


// ========================================
// LISTAR CONTAS
// ========================================

async function contas(req, res, next) {

  try {

    const lista = await p.conta.findMany({
      orderBy: {
        nome: 'asc'
      }
    });

    res.json(lista);

  } catch (e) {

    next(e);
  }
}


// ========================================
// CRIAR CONTA
// ========================================

async function criarConta(req, res, next) {

  try {

    const dados = contaSchema.parse(req.body);

    const conta = await p.conta.create({

      data: {
        nome: dados.nome,
        tipo: dados.tipo,
        saldoInicial: dados.saldoInicial
      }

    });

    res.status(201).json(conta);

  } catch (e) {

    next(e);
  }
}


// ========================================
// LISTAR CATEGORIAS
// ========================================

async function categorias(req, res, next) {

  try {

    const lista = await p.categoria.findMany({
      orderBy: {
        nome: 'asc'
      }
    });

    res.json(lista);

  } catch (e) {

    next(e);
  }
}


// ========================================
// CRIAR CATEGORIA
// ========================================

async function criarCategoria(req, res, next) {

  try {

    const dados = categoriaSchema.parse(req.body);

    const categoria = await p.categoria.create({

      data: {
        nome: dados.nome,
        tipo: dados.tipo
      }

    });

    res.status(201).json(categoria);

  } catch (e) {

    next(e);
  }
}


// ========================================
// EXPORTAÇÕES
// ========================================

module.exports = {
  contas,
  criarConta,
  categorias,
  criarCategoria
};