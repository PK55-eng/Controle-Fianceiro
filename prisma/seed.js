const {PrismaClient}=require('@prisma/client');const p=new PrismaClient();
async function main(){
 const conta=await p.conta.upsert({where:{nome:'Conta Corrente'},update:{},create:{nome:'Conta Corrente',tipo:'Conta corrente'}});
 for(const [nome,tipo] of [['Salário','RECEITA'],['Moradia','DESPESA'],['Alimentação','DESPESA'],['Transporte','DESPESA'],['Lazer','DESPESA'],['Saúde','DESPESA']])
  await p.categoria.upsert({where:{nome},update:{},create:{nome,tipo}});
 if(await p.transacao.count()===0){const c=Object.fromEntries((await p.categoria.findMany()).map(x=>[x.nome,x.id]));
  await p.transacao.createMany({data:[
   {descricao:'Salário',valor:2500,tipo:'RECEITA',data:new Date('2026-10-01'),contaId:conta.id,categoriaId:c['Salário']},
   {descricao:'Aluguel',valor:1200,tipo:'DESPESA',data:new Date('2026-10-02'),contaId:conta.id,categoriaId:c['Moradia']},
   {descricao:'Supermercado',valor:600,tipo:'DESPESA',data:new Date('2026-10-05'),contaId:conta.id,categoriaId:c['Alimentação']},
   {descricao:'Transporte',valor:200,tipo:'DESPESA',data:new Date('2026-10-08'),contaId:conta.id,categoriaId:c['Transporte']},
   {descricao:'Streaming',valor:55,tipo:'DESPESA',data:new Date('2026-10-10'),contaId:conta.id,categoriaId:c['Lazer']},
   {descricao:'Farmácia',valor:80,tipo:'DESPESA',data:new Date('2026-10-12'),contaId:conta.id,categoriaId:c['Saúde']}
  ]});}}
main().finally(()=>p.$disconnect());
