
# FinanSee — Sistema Web de Gestão Financeira Pessoal

O FinanSee é um sistema web desenvolvido para auxiliar no controle financeiro pessoal.

A aplicação permite cadastrar contas, categorias, receitas e despesas, além de acompanhar o saldo, visualizar gráficos e consultar o histórico de movimentações.

## Tecnologias utilizadas

### Frontend
- HTML
- CSS
- JavaScript
- Chart.js

### Backend
- Node.js 22
- Express
- Prisma ORM
- Zod

### Banco de dados
- PostgreSQL 16
- Docker Compose

### Desenvolvimento
- Git e GitHub
- Testes automatizados com node:test

## Funcionalidades

- Cadastro e listagem de contas financeiras.
- Cadastro e listagem de categorias.
- Cadastro de receitas e despesas.
- Edição de transações.
- Exclusão de transações.
- Histórico de movimentações financeiras.
- Filtros por tipo, categoria e período.
- Visualização de saldo, receitas e despesas.
- Dashboard com indicadores financeiros.
- Gráficos de evolução financeira.
- Visualização de despesas por categoria.
- Validação dos dados enviados à API.

## Requisitos para executar

É necessário ter instalado:

- Node.js 22
- npm
- Docker
- Docker Compose V2
- Git

## Instalação e execução

### 1. Clonar o repositório

```bash
git clone https://github.com/PK55-eng/Controle-Fianceiro.git
```

Entrar na pasta:

```bash
cd Controle-Fianceiro
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar as variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

O arquivo `.env` contém a configuração local de conexão com o banco.

Não publique credenciais reais no GitHub.

### 4. Iniciar o PostgreSQL

```bash
docker compose up -d
```

Verifique o contêiner:

```bash
docker ps
```

O contêiner `finansee-postgres` deverá aparecer em execução.

### 5. Gerar o cliente Prisma

```bash
npx prisma generate
```

### 6. Aplicar as migrações do banco

```bash
npx prisma migrate deploy
```

Esse comando aplica as migrações já existentes no projeto.

### 7. Inserir os dados iniciais

```bash
npm run db:seed
```

Esse comando executa o script de dados iniciais do projeto.

### 8. Iniciar a aplicação

```bash
npm run dev
```

Acesse no navegador:

http://localhost:3000

## Testes automatizados

Com o PostgreSQL em execução e o banco configurado, execute:

```bash
npm test
```

Os testes utilizam o módulo nativo `node:test`.

Os casos implementados verificam:

1. Consulta de transações.
2. Rejeição de valor negativo.
3. Rejeição de descrição vazia.
4. Consulta do dashboard.
5. Tentativa de edição de transação inexistente.
6. Tentativa de exclusão de transação inexistente.

Na última execução registrada, os seis testes foram aprovados.

## API REST

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/dashboard | Consultar resumo financeiro |
| GET | /api/transacoes | Listar transações |
| POST | /api/transacoes | Cadastrar transação |
| PUT | /api/transacoes/:id | Editar transação |
| DELETE | /api/transacoes/:id | Excluir transação |
| GET | /api/contas | Listar contas |
| POST | /api/contas | Cadastrar conta |
| GET | /api/categorias | Listar categorias |
| POST | /api/categorias | Cadastrar categoria |

### Filtros de transações

O endpoint `GET /api/transacoes` permite filtrar por:

- `tipo`
- `categoriaId`
- `dataInicial`
- `dataFinal`

Exemplo:

```text
/api/transacoes?tipo=DESPESA
```

## Estrutura do projeto

```text
Controle-Fianceiro/
├── docs/
│   ├── ARQUITETURA.md
│   ├── DER.md
│   ├── KANBAN_PLANEJAMENTO.md
│   ├── PROTOTIPO.md
│   ├── REQUISITOS.md
│   ├── TESTES.md
│   └── VISAO.md
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.js
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── src/
│   ├── controllers/
│   ├── lib/
│   ├── middlewares/
│   ├── routes/
│   ├── services/
│   ├── app.js
│   └── server.js
├── test/
│   └── api.test.js
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
├── IA_LOG.md
├── DOCUMENTACAO_IA.md
└── README.md
```

## Documentação acadêmica

Os documentos do projeto estão na pasta `docs/`:

- `VISAO.md`: visão geral e objetivos.
- `REQUISITOS.md`: requisitos funcionais e não funcionais.
- `ARQUITETURA.md`: arquitetura e tecnologias.
- `DER.md`: modelo de dados e relacionamentos.
- `PROTOTIPO.md`: planejamento e evidências do protótipo.
- `KANBAN_PLANEJAMENTO.md`: planejamento das atividades.
- `TESTES.md`: registro dos testes.

O uso de inteligência artificial está documentado em:

- `IA_LOG.md`
- `DOCUMENTACAO_IA.md`

## Limites do escopo

Nesta versão, o FinanSee não contempla:

- Autenticação de usuários.
- Integração com bancos.
- Open Finance.
- Aplicativo para dispositivos móveis.
- Processamento de pagamentos.

## Versionamento

O projeto utiliza Git e GitHub.

Os commits registram etapas reais de desenvolvimento, testes e documentação.

## Observações

A aplicação foi desenvolvida para execução local.

Para utilizá-la, é necessário iniciar o banco PostgreSQL e configurar corretamente as variáveis de ambiente.
