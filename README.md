
# FinanSee — Sistema Web de Gestão Financeira Pessoal

O FinanSee é um sistema web desenvolvido para auxiliar no controle financeiro pessoal.

A aplicação permite cadastrar contas, categorias, receitas e despesas, acompanhar o saldo, visualizar gráficos e consultar o histórico de movimentações financeiras.

## Tecnologias utilizadas

### Frontend
- HTML
- CSS
- JavaScript
- Chart.js (armazenado localmente para funcionar sem internet)

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

O arquivo `.env` contém a configuração local de conexão com o banco de dados.

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

Esse comando aplica as migrações existentes no projeto.

### 7. Inserir os dados de demonstração

```bash
npm run db:seed
```

Em um banco sem transações, esse comando cria uma conta, categorias e 14 transações fictícias distribuídas entre agosto, setembro e outubro de 2026.

Os dados permitem demonstrar os indicadores financeiros e o gráfico de evolução mensal.

Se já existirem transações cadastradas, o script preserva os registros existentes e não insere novas transações de demonstração.

### 8. Iniciar a aplicação

```bash
npm run dev
```

Acesse no navegador:

http://localhost:3000

Para encerrar o servidor, pressione `Ctrl + C` no terminal.

## Testes automatizados

Com o PostgreSQL em execução e o banco configurado, execute:

```bash
npm test
```

Os testes utilizam o módulo nativo `node:test`.

Os nove casos implementados verificam:

1. Consulta de transações.
2. Rejeição de valor negativo.
3. Rejeição de descrição vazia.
4. Consulta do dashboard.
5. Tentativa de edição de transação inexistente.
6. Tentativa de exclusão de transação inexistente.
7. Filtro de transações por um único dia.
8. Rejeição de data inválida.
9. Rejeição de período invertido.

Na última execução registrada, os nove testes foram aprovados, sem falhas.

Os resultados detalhados estão documentados em `docs/TESTES.md`.

## API REST

| Método | Endpoint | Descrição |
|---|---|---|
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

Exemplo de filtro por tipo:

```text
/api/transacoes?tipo=DESPESA
```

Exemplo de filtro por período:

```text
/api/transacoes?dataInicial=2026-10-01&dataFinal=2026-10-31
```

As datas dos filtros devem ser informadas no formato `AAAA-MM-DD`.

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
│   ├── vendor/
│   │   └── chart.umd.js
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
├── package-lock.json
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
- `TESTES.md`: registro dos testes manuais e automatizados.

O uso de inteligência artificial está documentado em:

- `IA_LOG.md`
- `DOCUMENTACAO_IA.md`

## Segurança e dependências

A aplicação utiliza validação de dados com Zod e cabeçalhos de segurança configurados com Helmet.

Foi realizada uma análise de dependências com `npm audit`.

A biblioteca Morgan foi atualizada para a versão 1.12.1 para corrigir alertas identificados.

Na última análise, permaneceram quatro alertas de severidade alta relacionados às dependências indiretas `deepmerge-ts` e `effect`, utilizadas pela ferramenta Prisma.

Esses alertas permanecem registrados para avaliação. Não foi realizada atualização forçada que pudesse comprometer a compatibilidade do projeto.

## Limites do escopo

Nesta versão, o FinanSee não contempla:

- Autenticação de usuários.
- Integração com bancos.
- Open Finance.
- Aplicativo para dispositivos móveis.
- Processamento de pagamentos.

## Versionamento

O projeto utiliza Git e GitHub.

Os commits registram etapas reais de desenvolvimento, correções, testes e documentação.

Repositório:

https://github.com/PK55-eng/Controle-Fianceiro

## Observações

A aplicação foi desenvolvida para execução local.

Para utilizá-la, é necessário iniciar o PostgreSQL e configurar corretamente as variáveis de ambiente.

Os dados de demonstração são fictícios e utilizados exclusivamente para apresentar as funcionalidades do sistema.
