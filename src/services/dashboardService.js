const p = require('../lib/prisma');

async function obterResumo() {
  const [contas, ts] = await Promise.all([
    p.conta.findMany(),
    p.transacao.findMany({
      include: { categoria: true, conta: true },
      orderBy: { data: 'desc' }
    })
  ]);

  let receitas = 0;
  let despesas = 0;
  const categorias = {};
  const meses = {};
  const inicial = contas.reduce((s, c) => s + Number(c.saldoInicial), 0);

  for (const t of ts) {
    const v = Number(t.valor);

    if (t.tipo === 'RECEITA') {
      receitas += v;
    } else {
      despesas += v;
      categorias[t.categoria.nome] = (categorias[t.categoria.nome] || 0) + v;
    }

    const m = t.data.toISOString().slice(0, 7);
    meses[m] ||= { receitas: 0, despesas: 0 };
    meses[m][t.tipo === 'RECEITA' ? 'receitas' : 'despesas'] += v;
  }

  return {
    saldo: inicial + receitas - despesas,
    receitas,
    despesas,
    categorias,
    meses
  };
}

module.exports = { obterResumo };
