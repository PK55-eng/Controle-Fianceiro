const p = require("../lib/prisma");
const { z } = require("zod");

const transacaoSchema = z.object({
    descricao: z
        .string()
        .min(2, "A descrição deve ter pelo menos 2 caracteres."),

    valor: z.coerce
        .number()
        .positive("O valor deve ser maior que zero."),

    tipo: z.enum(["RECEITA", "DESPESA"]),

    data: z.coerce.date(),

    contaId: z.coerce
        .number()
        .int()
        .positive(),

    categoriaId: z.coerce
        .number()
        .int()
        .positive()
});


// ========================================
// LISTAR TRANSAÇÕES + FILTROS
// ========================================

async function listar(req, res, next) {
    try {
        const {
            tipo,
            categoriaId,
            dataInicial,
            dataFinal
        } = req.query;

        const where = {};

        // FILTRO POR TIPO
        if (
            tipo === "RECEITA" ||
            tipo === "DESPESA"
        ) {
            where.tipo = tipo;
        }

        // FILTRO POR CATEGORIA
        if (categoriaId) {
            const id = Number(categoriaId);

            if (!Number.isNaN(id)) {
                where.categoriaId = id;
            }
        }

        // FILTRO POR PERÍODO
        if (dataInicial || dataFinal) {
            where.data = {};

            if (dataInicial) {
                where.data.gte =
                    new Date(`${dataInicial}T00:00:00`);
            }

            if (dataFinal) {
                where.data.lte =
                    new Date(`${dataFinal}T23:59:59.999`);
            }
        }

        const transacoes =
            await p.transacao.findMany({
                where,

                include: {
                    conta: true,
                    categoria: true
                },

                orderBy: {
                    data: "desc"
                }
            });

        res.json(transacoes);

    } catch (erro) {
        next(erro);
    }
}


// ========================================
// CRIAR TRANSAÇÃO
// ========================================

async function criar(req, res, next) {
    try {
        const dados =
            transacaoSchema.parse(req.body);

        const categoria =
            await p.categoria.findUnique({
                where: {
                    id: dados.categoriaId
                }
            });

        if (!categoria) {
            return res.status(404).json({
                erro: "Categoria não encontrada."
            });
        }

        const conta =
            await p.conta.findUnique({
                where: {
                    id: dados.contaId
                }
            });

        if (!conta) {
            return res.status(404).json({
                erro: "Conta não encontrada."
            });
        }

        if (categoria.tipo !== dados.tipo) {
            return res.status(400).json({
                erro:
                    "A categoria selecionada não corresponde ao tipo da transação."
            });
        }

        const transacao =
            await p.transacao.create({
                data: {
                    descricao: dados.descricao,
                    valor: dados.valor,
                    tipo: dados.tipo,
                    data: dados.data,
                    contaId: dados.contaId,
                    categoriaId:
                        dados.categoriaId
                },

                include: {
                    conta: true,
                    categoria: true
                }
            });

        res.status(201).json(transacao);

    } catch (erro) {
        next(erro);
    }
}


// ========================================
// ATUALIZAR TRANSAÇÃO
// ========================================

async function atualizar(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                erro: "ID inválido."
            });
        }

        const existente =
            await p.transacao.findUnique({
                where: { id }
            });

        if (!existente) {
            return res.status(404).json({
                erro: "Transação não encontrada."
            });
        }

        const dados =
            transacaoSchema.parse(req.body);

        const categoria =
            await p.categoria.findUnique({
                where: {
                    id: dados.categoriaId
                }
            });

        if (!categoria) {
            return res.status(404).json({
                erro: "Categoria não encontrada."
            });
        }

        const conta =
            await p.conta.findUnique({
                where: {
                    id: dados.contaId
                }
            });

        if (!conta) {
            return res.status(404).json({
                erro: "Conta não encontrada."
            });
        }

        if (categoria.tipo !== dados.tipo) {
            return res.status(400).json({
                erro:
                    "A categoria selecionada não corresponde ao tipo da transação."
            });
        }

        const transacao =
            await p.transacao.update({
                where: { id },

                data: {
                    descricao: dados.descricao,
                    valor: dados.valor,
                    tipo: dados.tipo,
                    data: dados.data,
                    contaId: dados.contaId,
                    categoriaId:
                        dados.categoriaId
                },

                include: {
                    conta: true,
                    categoria: true
                }
            });

        res.json(transacao);

    } catch (erro) {
        next(erro);
    }
}


// ========================================
// EXCLUIR TRANSAÇÃO
// ========================================

async function remover(req, res, next) {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                erro: "ID inválido."
            });
        }

        const existente =
            await p.transacao.findUnique({
                where: { id }
            });

        if (!existente) {
            return res.status(404).json({
                erro: "Transação não encontrada."
            });
        }

        await p.transacao.delete({
            where: { id }
        });

        res.status(204).send();

    } catch (erro) {
        next(erro);
    }
}


module.exports = {
    listar,
    criar,
    atualizar,
    remover
};