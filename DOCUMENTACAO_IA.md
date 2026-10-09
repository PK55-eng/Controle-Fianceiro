
# Documentação do Uso de IA — FinanSee

## Ferramenta utilizada

ChatGPT, utilizado como apoio ao desenvolvimento de software.

## Finalidades

A inteligência artificial auxiliou nas seguintes atividades:

1. Interpretação das diretrizes acadêmicas.
2. Planejamento da arquitetura.
3. Geração e revisão de código.
4. Implementação de funcionalidades.
5. Explicação de comandos do Git, Docker e Node.js.
6. Investigação de erros.
7. Elaboração de testes.
8. Revisão da documentação.

## Processo adotado

O desenvolvimento foi realizado de forma incremental.

As sugestões de código foram incorporadas ao projeto e verificadas por meio da execução local, testes manuais e testes automatizados.

Quando surgiram problemas, os resultados observados foram utilizados para orientar a investigação.

## Exemplo de diagnóstico

Durante um teste, a API retornou HTTP 500.

A investigação mostrou que o contêiner PostgreSQL estava desligado.

Após iniciar o banco com Docker Compose, a API retornou HTTP 200.

Esse caso demonstra a importância de verificar as sugestões e os resultados no ambiente real.

## Testes

Foram utilizados:

- curl para testes manuais da API.
- node:test para testes automatizados.
- Respostas HTTP para verificar o tratamento de erros.

Na última execução, seis testes automatizados foram aprovados.

## Registro detalhado

O histórico de solicitações, refinamentos, decisões e problemas está documentado no arquivo [IA_LOG.md](IA_LOG.md).

## Considerações finais

A inteligência artificial foi utilizada como ferramenta de apoio, não como substituta da validação do sistema.

A dupla deve compreender as funcionalidades implementadas, conferir o código e demonstrar a execução do projeto durante a apresentação.
