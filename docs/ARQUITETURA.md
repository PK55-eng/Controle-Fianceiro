
# Arquitetura do FinanSee

## Visão geral

O FinanSee utiliza uma arquitetura web cliente-servidor, com separação entre interface, API, regras de negócio e persistência de dados.

## Fluxo da aplicação

```text
Usuário
   |
   v
Frontend (HTML, CSS e JavaScript)
   |
   | Requisições HTTP
   v
API REST (Node.js + Express)
   |
   v
Rotas
   |
   v
Controllers
   |
   +---- Services (cálculos do dashboard)
   |
   v
Prisma ORM
   |
   v
PostgreSQL 16
   |
   v
Docker Compose
```

## Tecnologias utilizadas

- HTML, CSS e JavaScript: interface do usuário.
- Node.js: ambiente de execução do backend.
- Express: criação da API REST.
- Prisma ORM: comunicação com o banco de dados.
- PostgreSQL 16: armazenamento dos dados.
- Docker Compose: execução do banco de dados.
- Zod: validação dos dados recebidos pela API.
- Chart.js: visualização dos gráficos.
- Git e GitHub: versionamento do projeto.

## Organização do código

### Frontend

Localizado na pasta `public/`.

Responsável por apresentar o dashboard, os formulários, os gráficos e o histórico de transações.

### Rotas

Localizadas em `src/routes/`.

Definem os endpoints da API e encaminham as requisições aos controllers.

### Controllers

Localizados em `src/controllers/`.

Recebem as requisições HTTP, validam os dados, executam operações e retornam respostas JSON com códigos HTTP apropriados.

### Services

Localizados em `src/services/`.

Concentram cálculos e regras de negócio, especialmente os indicadores do dashboard.

### Persistência

O Prisma ORM realiza o acesso ao PostgreSQL.

Os modelos do banco estão definidos em `prisma/schema.prisma`.

## Principais endpoints

| Método | Endpoint | Finalidade |
|--------|----------|------------|
| GET | /api/dashboard | Consultar resumo financeiro |
| GET | /api/transacoes | Listar e filtrar transações |
| POST | /api/transacoes | Cadastrar transação |
| PUT | /api/transacoes/:id | Editar transação |
| DELETE | /api/transacoes/:id | Excluir transação |
| GET | /api/contas | Listar contas |
| POST | /api/contas | Cadastrar conta |
| GET | /api/categorias | Listar categorias |
| POST | /api/categorias | Cadastrar categoria |

## Execução local

O PostgreSQL é iniciado pelo Docker Compose.

O backend é executado com Node.js e disponibiliza a interface web e a API no endereço:

http://localhost:3000

## Justificativa da arquitetura

A separação das responsabilidades facilita a manutenção, os testes e a compreensão do projeto.

O Docker Compose permite reproduzir o ambiente do banco de dados em diferentes computadores.
