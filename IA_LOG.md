
# Registro de Uso de Inteligência Artificial — FinanSee

## Objetivo

Este documento registra como a inteligência artificial foi utilizada como ferramenta de apoio durante o desenvolvimento do FinanSee.

As sugestões geradas foram revisadas e testadas durante a implementação. A execução dos comandos, os testes e a verificação dos resultados foram realizados no ambiente local.

## Histórico de utilização

| Etapa | Solicitação à IA | Refinamento ou problema | Decisão tomada |
|---|---|---|---|
| Arquitetura inicial | Analisar a solução como engenheiro de software sênior | A primeira proposta ficou complexa para o contexto acadêmico | Simplificar a arquitetura |
| Versão acadêmica | Produzir código mais compreensível | Foi considerada uma versão Java/JDBC | Priorizar código que a dupla consiga explicar |
| Adequação às diretrizes | Comparar a solução com os requisitos do professor | Java/MySQL não atendia à stack exigida | Utilizar Node.js, Express, PostgreSQL e Docker |
| Definição do escopo | Avaliar a continuidade do sistema financeiro | Necessidade de equilibrar funcionalidades e prazo | Manter o FinanSee e implementar CRUD e dashboard |
| Estrutura do projeto | Gerar uma base organizada e documentada | Necessidade de separar responsabilidades | Organizar rotas, controllers, services e Prisma |
| Cadastro de contas e categorias | Implementar cadastro e listagem | Necessidade de integrar formulários e banco | Utilizar endpoints REST e persistência no PostgreSQL |
| Edição de transações | Implementar a alteração de registros | Necessidade de atualizar interface e dados | Adicionar operação PUT e formulário de edição |
| Filtros de transações | Permitir filtros por tipo, categoria e período | Necessidade de combinar critérios | Implementar parâmetros de consulta na API |
| Publicação no GitHub | Orientar a configuração do Git e a publicação | Configuração inicial de identidade do Git | Configurar o Git e publicar o repositório |
| Testes manuais | Orientar testes da API com curl | Primeira consulta retornou HTTP 500 | Verificar o ambiente antes de alterar o código |
| Banco de dados | Investigar o erro HTTP 500 | PostgreSQL não estava em execução | Iniciar o contêiner com Docker Compose |
| Validação de valores | Testar uma transação com valor negativo | A API deveria rejeitar o cadastro | Confirmado HTTP 400 |
| Validação de categorias | Testar receita com categoria de despesa | A API deveria impedir a combinação | Confirmado HTTP 400 |
| Testes automatizados | Criar testes usando Node.js | O projeto ainda não possuía script npm test | Adicionar testes com node:test |
| Testes de registros inexistentes | Verificar edição e exclusão com ID inexistente | A API deveria retornar HTTP 404 | Confirmados os dois resultados |
| Revisão da documentação | Revisar arquitetura e DER | Documentos estavam resumidos | Detalhar componentes, entidades e relacionamentos |
| Planejamento | Organizar tarefas no GitHub Projects | Quadro ainda não estava criado | Criar o Kanban com quatro colunas |

## Exemplos de solicitações utilizadas

As solicitações abaixo representam os pedidos realizados durante o desenvolvimento, apresentados de forma resumida:

- "Analise o projeto como um engenheiro de software sênior."
- "Compare o projeto com as diretrizes do professor."
- "Quero um código mais simples, que consiga compreender e explicar."
- "Envie os arquivos completos para copiar e colar no VS Code."
- "Vamos testar os erros da API."
- "Como publicar o projeto no GitHub?"
- "Vamos criar testes automatizados."
- "Confira a documentação de arquitetura e DER."

## Testes realizados

Foram executados testes manuais com curl e testes automatizados com o módulo nativo de testes do Node.js.

Entre os resultados observados:

- HTTP 200 na consulta de transações.
- HTTP 400 para valores negativos.
- HTTP 400 para descrição vazia.
- HTTP 400 para categoria incompatível.
- HTTP 404 para edição de transação inexistente.
- HTTP 404 para exclusão de transação inexistente.
- HTTP 200 na consulta do dashboard.

Na última execução registrada, os seis testes automatizados passaram, sem falhas.

Os testes estão implementados em `test/api.test.js`.

## Problema identificado durante os testes

### API retornando HTTP 500

**Situação:** a consulta de transações retornou erro interno do servidor.

**Investigação:** foi utilizado o comando `docker ps` para verificar os contêineres.

**Causa identificada:** o PostgreSQL não estava em execução.

**Solução aplicada:**

```bash id="cd9nb0"
docker compose up -d
```

**Resultado:** após iniciar o banco, a consulta retornou HTTP 200.

**Aprendizado:** verificar a infraestrutura antes de concluir que existe um defeito no código.

## Critérios para aceitar sugestões da IA

As sugestões devem:

- Atender às tecnologias exigidas pelo professor.
- Ser compreensíveis para a dupla.
- Preservar as funcionalidades já implementadas.
- Utilizar validação de dados.
- Permitir execução local.
- Evitar credenciais reais no repositório.
- Ser verificadas por testes.

## Limitações e responsabilidade

A IA foi utilizada como ferramenta de apoio para geração de código, explicações, documentação, diagnóstico de erros e planejamento.

O uso da IA não substitui a necessidade de compreender o projeto, executar os testes e verificar os resultados.

Este documento deverá continuar sendo atualizado caso ocorram novas alterações relevantes.
