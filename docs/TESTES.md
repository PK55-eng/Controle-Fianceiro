# Testes da API — FinanSee

## 1. Objetivo

Verificar o funcionamento da API REST do FinanSee, incluindo consultas, validação de dados, tratamento de erros e filtros por período.

Os testes foram realizados manualmente, utilizando `curl`, e automaticamente, utilizando o módulo nativo `node:test` do Node.js.

## 2. Ambiente de testes

- Node.js 22
- Express
- Prisma ORM
- PostgreSQL 16
- Docker Compose
- Ferramentas: `curl` e `node:test`

O PostgreSQL precisa estar em execução para que os testes que consultam o banco de dados funcionem.

## 3. Testes manuais realizados

### Teste 01 — Consulta de transações

**Endpoint:** `GET /api/transacoes`

**Resultado esperado:** HTTP 200 e lista de transações em JSON.

**Resultado obtido:** HTTP 200, inicialmente com seis transações retornadas.

**Status:** APROVADO.

### Teste 02 — Valor negativo

**Endpoint:** `POST /api/transacoes`

**Entrada:** transação com valor negativo de R$ 50,00.

**Resultado esperado:** HTTP 400, impedindo o cadastro.

**Resultado obtido:** HTTP 400, com a mensagem "O valor deve ser maior que zero."

**Status:** APROVADO.

### Teste 03 — Categoria incompatível

**Endpoint:** `POST /api/transacoes`

**Entrada:** transação do tipo RECEITA utilizando uma categoria do tipo DESPESA.

**Resultado esperado:** HTTP 400, impedindo o cadastro.

**Resultado obtido:** HTTP 400.

**Status:** APROVADO.

### Teste 04 — Edição de transação inexistente

**Endpoint:** `PUT /api/transacoes/999999`

**Resultado esperado:** HTTP 404.

**Resultado obtido:** HTTP 404, com a mensagem "Transação não encontrada."

**Status:** APROVADO.

### Teste 05 — Exclusão de transação inexistente

**Endpoint:** `DELETE /api/transacoes/999999`

**Resultado esperado:** HTTP 404.

**Resultado obtido:** HTTP 404, com a mensagem "Transação não encontrada."

**Status:** APROVADO.

### Teste 06 — Filtro por período

**Endpoint:** `GET /api/transacoes?dataInicial=2026-10-01&dataFinal=2026-10-01`

**Resultado esperado:** retornar somente as transações de 01/10/2026.

**Resultado inicial:** o sistema retornou indevidamente uma transação de 02/10/2026.

**Causa identificada:** diferença entre o fuso horário local utilizado na construção do filtro e as datas armazenadas em UTC no banco.

**Correção aplicada:** utilização explícita de UTC na definição dos limites inicial e final do período.

**Resultado após correção:** HTTP 200, retornando a transação "Salário", no valor de R$ 2.500,00, com data de 01/10/2026.

**Status:** APROVADO APÓS CORREÇÃO.

## 4. Testes automatizados

Os testes automatizados estão implementados no arquivo `test/api.test.js`.

Para executá-los:

```bash
npm test
```

### Casos automatizados

| Nº | Teste | Resultado |
|---|---|---|
| 01 | Consultar transações | APROVADO |
| 02 | Rejeitar valor negativo | APROVADO |
| 03 | Rejeitar descrição vazia | APROVADO |
| 04 | Consultar dashboard | APROVADO |
| 05 | Editar transação inexistente | APROVADO |
| 06 | Excluir transação inexistente | APROVADO |
| 07 | Filtrar transações de um único dia | APROVADO |
| 08 | Rejeitar data inválida | APROVADO |
| 09 | Rejeitar período invertido | APROVADO |

### Resultado da última execução

```text
tests 9
pass 9
fail 0
cancelled 0
skipped 0
duration_ms 1447.83722
```

**Conclusão:** os nove testes automatizados foram aprovados.

Os testes de valor negativo e descrição vazia produzem mensagens `ZodError` no terminal porque enviam dados inválidos propositalmente. As respostas HTTP 400 foram verificadas e são o comportamento esperado.

**Limitação:** os testes atuais não cobrem todos os cenários possíveis. O teste automatizado de período verifica se as transações retornadas pertencem à data solicitada, mas não exige que exista pelo menos uma transação nessa data.

## 5. Teste do gráfico sem internet

O Chart.js foi disponibilizado localmente no projeto, por meio do arquivo `public/vendor/chart.umd.js`.

**Procedimento realizado:**

1. Abrir o dashboard do FinanSee.
2. Desativar temporariamente a conexão com a internet.
3. Atualizar a página.
4. Verificar se o gráfico continuava sendo exibido.

**Resultado obtido:** o gráfico continuou funcionando sem conexão com a internet.

**Status:** APROVADO.

## 6. Teste dos dados de demonstração

O arquivo `prisma/seed.js` foi atualizado para incluir transações fictícias de agosto, setembro e outubro de 2026 em instalações novas.

Foi executado o comando:

```bash
npm run db:seed
```

Como o banco local já continha transações, o script informou que os dados existentes foram preservados.

**Status:** APROVADO para a preservação dos dados existentes.

**Observação:** a criação das 14 transações em um banco vazio ainda deverá ser verificada durante o teste de instalação limpa.

## 7. Ocorrência — Banco de dados desligado

Durante os testes iniciais, a API retornou HTTP 500 porque o contêiner PostgreSQL não estava em execução.

O problema foi resolvido com:

```bash
docker compose up -d
```

Após iniciar o banco, a consulta retornou HTTP 200.

**Conclusão:** a API depende da disponibilidade do PostgreSQL para consultar e persistir as transações.

## 8. Testes ainda recomendados

- Validar a instalação em ambiente limpo.
- Conferir a criação dos dados iniciais em banco vazio.
- Testar filtros combinados por tipo, categoria e período.
- Conferir os cálculos do dashboard com valores conhecidos.
- Verificar os fluxos de cadastro, edição e exclusão pela interface.

## 9. Conclusão

Os testes realizados confirmaram o funcionamento dos principais endpoints da API e permitiram identificar e corrigir um problema real no filtro de datas.

Na última execução, todos os nove testes automatizados foram aprovados. Permanecem pendentes as verificações complementares descritas neste documento.