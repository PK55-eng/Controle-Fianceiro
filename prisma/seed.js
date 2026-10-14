
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const conta = await prisma.conta.upsert({
    where: { nome: 'Conta Corrente' },
    update: {},
    create: {
      nome: 'Conta Corrente',
      tipo: 'Conta corrente'
    }
  });

  const categorias = [
    ['Salário', 'RECEITA'],
    ['Moradia', 'DESPESA'],
    ['Alimentação', 'DESPESA'],
    ['Transporte', 'DESPESA'],
    ['Lazer', 'DESPESA'],
    ['Saúde', 'DESPESA']
  ];

  for (const [nome, tipo] of categorias) {
    await prisma.categoria.upsert({
      where: { nome },
      update: {},
      create: { nome, tipo }
    });
  }

  const quantidadeTransacoes = await prisma.transacao.count();

  if (quantidadeTransacoes > 0) {
    console.log(
      'Já existem transações cadastradas. Os dados atuais foram preservados.'
    );
    return;
  }

  const categoriasBanco = await prisma.categoria.findMany();

  const categoriaId = Object.fromEntries(
    categoriasBanco.map(categoria => [
      categoria.nome,
      categoria.id
    ])
  );

  const exemplos = [
    // Agosto de 2026
    ['Salário agosto', 2100, 'RECEITA', '2026-08-01', 'Salário'],
    ['Supermercado agosto', 550, 'DESPESA', '2026-08-05', 'Alimentação'],
    ['Aluguel agosto', 1000, 'DESPESA', '2026-08-10', 'Moradia'],
    ['Transporte agosto', 200, 'DESPESA', '2026-08-15', 'Transporte'],

    // Setembro de 2026
    ['Salário setembro', 2400, 'RECEITA', '2026-09-01', 'Salário'],
    ['Supermercado setembro', 600, 'DESPESA', '2026-09-05', 'Alimentação'],
    ['Aluguel setembro', 1100, 'DESPESA', '2026-09-10', 'Moradia'],
    ['Transporte setembro', 250, 'DESPESA', '2026-09-15', 'Transporte'],

    // Outubro de 2026
    ['Salário', 2500, 'RECEITA', '2026-10-01', 'Salário'],
    ['Aluguel', 1200, 'DESPESA', '2026-10-02', 'Moradia'],
    ['Supermercado', 600, 'DESPESA', '2026-10-05', 'Alimentação'],
    ['Transporte', 200, 'DESPESA', '2026-10-08', 'Transporte'],
    ['Streaming', 55, 'DESPESA', '2026-10-10', 'Lazer'],
    ['Farmácia', 80, 'DESPESA', '2026-10-12', 'Saúde']
  ];

  await prisma.transacao.createMany({
    data: exemplos.map(
      ([descricao, valor, tipo, data, categoria]) => ({
        descricao,
        valor,
        tipo,
        data: new Date(`${data}T12:00:00.000Z`),
        contaId: conta.id,
        categoriaId: categoriaId[categoria]
      })
    )
  });

  console.log('Dados de demonstração criados com sucesso!');
  console.log('Foram cadastradas 14 transações de agosto a outubro de 2026.');
}

main()
  .catch(error => {
    console.error('Erro ao executar o seed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
