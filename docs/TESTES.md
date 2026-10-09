
# Testes da API — FinanSee

## Objetivo

Verificar o funcionamento dos endpoints da API REST, incluindo consultas, validação de dados e tratamento de erros.

## Ambiente

- Node.js 22
- Express
- Prisma
- PostgreSQL 16
- Docker Compose
- Ferramenta de testes: curl

## Teste 01 — Consulta de transações

**Endpoint:** GET /api/transacoes

**Resultado esperado:** HTTP 200 e lista de transações em JSON.

**Resultado obtido:** HTTP 200, com seis transações retornadas.

**Status:** APROVADO.

## Teste 02 — Valor negativo

**Endpoint:** POST /api/transacoes

**Entrada:** transação com valor -50.

**Resultado esperado:** HTTP 400, impedindo o cadastro.

**Resultado obtido:** HTTP 400, com a mensagem "O valor deve ser maior que zero."

**Status:** APROVADO.

## Teste 03 — Categoria incompatível

**Endpoint:** POST /api/transacoes

**Entrada:** transação do tipo RECEITA utilizando uma categoria do tipo DESPESA.

**Resultado esperado:** HTTP 400, impedindo o cadastro.

**Resultado obtido:** HTTP 400.

**Status:** APROVADO.

## Ocorrência — Banco de dados desligado

Durante o primeiro teste, a API retornou HTTP 500 porque o contêiner PostgreSQL não estava em execução.

O problema foi resolvido com:

```bash
docker compose up -d
```

Após iniciar o banco, a mesma consulta retornou HTTP 200.

**Conclusão:** a API depende da disponibilidade do PostgreSQL para consultar as transações.

## Próximos testes

- Descrição vazia
- Conta inexistente
- Edição de transação inexistente
- Exclusão de transação inexistente
- Filtros por período, tipo e categoria
- Cálculos do dashboard
- Testes automatizados
