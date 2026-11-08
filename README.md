# PetShop Manager — projeto acadêmico

Sistema local para uma disciplina de Projeto de Software, com **front-end, back-end e banco de dados**. Grupo de 1 a 7 alunos. O código está pronto para estudo, execução e demonstração; os alunos devem entender e conferir as funcionalidades antes de entregar.

## Comece aqui

1. Leia [COMECE-AQUI.md](docs/COMECE-AQUI.md): instalação e primeiro cadastro, sem exigir experiência.
2. Execute a etapa AC3 para preparar a entrega de 08/11.
3. Use [ENTREGAS.md](docs/ENTREGAS.md) para vídeos, GitHub, board e Classroom.
4. Estude [APRENDIZADO.md](docs/APRENDIZADO.md) para entender e modificar o código por etapas.
5. Consulte [ARQUITETURA.md](docs/ARQUITETURA.md) para tabelas, regras e API.

## Stack

- HTML, CSS e JavaScript puro: telas e formulários.
- Node.js **24.x**, Express **5.1.0**: servidor e regras.
- SQLite integrado ao Node (`node:sqlite`): banco em arquivo, sem instalar servidor de banco.
- Testes com o executor nativo do Node, sem biblioteca adicional.
- Nenhum serviço pago, conta externa ou chave é necessário para rodar localmente.

Referências oficiais: [Node.js e SQLite](https://nodejs.org/api/sqlite.html), [instalação do Express](https://expressjs.com/en/starter/installing/). Fixamos a dependência no projeto para manter a reprodução dos testes.

## Instalação rápida

Instale o Node.js 24.x com npm pelo [site oficial](https://nodejs.org/en/download). No terminal, dentro da pasta que contém este README:

```powershell
npm.cmd install
npm.cmd run ac3
```

Abra **http://127.0.0.1:3000** no navegador. Use **Ctrl+C** no terminal para encerrar. Não abra `index.html` com duplo clique: a aplicação depende do servidor.

Alternativa para quem já usa pnpm: `pnpm install --frozen-lockfile` e `pnpm run ac3`. O arquivo de versões travadas incluído é `pnpm-lock.yaml`; npm também funciona e gera `package-lock.json`. Escolha um gerenciador e mantenha seu arquivo de versões no GitHub.

## Entregas incrementais

| Etapa | Data informada, considerada 2026 | Comando | Funcionalidade nova |
|---|---|---|---|
| AC1 | 14/09/2026 — passada | `npm.cmd run ac1` | Cadastrar, listar, buscar, editar e excluir clientes |
| AC2 | 13/10/2026 — passada | `npm.cmd run ac2` | Cadastrar, listar, editar e excluir pets vinculados a clientes |
| AC3 | 08/11/2026 — amanhã em 07/11 | `npm.cmd run ac3` | Serviços, agendamento, conflito de horário, cancelamento e filtro |
| Final | 01/12/2026 | `npm.cmd run final` | Concluir serviço e exibir painel com indicadores e receita demonstrativa |

As etapas são cumulativas. A implementação final já está disponível. Os comandos limitam menus **e API** aos recursos da etapa. São modos de demonstração do mesmo código, **não versões históricas desenvolvidas nas datas passadas**.

Cada modo tem seu próprio arquivo: `data/petshop-ac1.sqlite`, `petshop-ac2.sqlite`, `petshop-ac3.sqlite` ou `petshop-final.sqlite`. Começam vazios; os três serviços são criados automaticamente. Dados de uma etapa não aparecem nas outras.

Para continuar com os dados da AC3 na final: encerre o servidor e copie `data/petshop-ac3.sqlite` para `data/petshop-final.sqlite` **somente se a final ainda não tiver dados que queira preservar**. Antes, faça backup de qualquer arquivo existente. A troca de modo não migra dados automaticamente.

## Funcionalidades e limites

- Validação no servidor, vínculos por chaves estrangeiras e consultas com parâmetros.
- Exclusão bloqueada quando há dependências; pets com histórico de atendimento são preservados.
- Uma estação de atendimento, todos os serviços de 60 minutos, horários de 08:00 a 17:00, todos os dias. Encerramento até 18h. Datas/horas seguem a hora civil de Brasília.
- Datas passadas são aceitas para demonstração e histórico, entre os anos de 2026 e 2100.
- Cancelar libera o horário. Concluir preserva o horário e o histórico. Para remarcar, cancelar e cadastrar outro.
- Preço do serviço é registrado no agendamento em centavos. Receita demonstrativa soma apenas concluídos e não comprova pagamentos.
- Catálogo inicial: banho R$ 50, tosa R$ 70, banho e tosa R$ 100. Sem edição de catálogo na interface.
- Painel considera todo o histórico da etapa; sem filtro de período.
- Escopo acadêmico local, sem login, estoque, pagamentos, mensagens, múltiplas estações ou hospedagem. Servidor escuta apenas no próprio computador.

## Estrutura

```text
public/              front-end: index.html, style.css, app.js
src/app.js           API, validações e regras de negócio
src/database.js      abertura do SQLite
src/schema.sql       tabelas, vínculos, índice e catálogo inicial
src/server.js        inicialização e seleção da etapa
test/                testes de integração
data/                arquivos SQLite gerados (ignorados pelo Git)
docs/                tutorial, arquitetura, board, vídeos e entregas
```

## Verificação

```powershell
npm.cmd test
```

O teste usa banco temporário, não apaga os seus cadastros. Verifica fluxo completo, exclusões, validações, conflitos, cancelamento, receita, restrições por etapa e persistência. Consulte [VALIDACAO.md](docs/VALIDACAO.md) para evidências e teste manual.

## Participantes e links — preencher antes da entrega

- Integrantes (nome completo e RA): **PREENCHER**.
- Turma e professor: **PREENCHER**.
- GitHub: **PREENCHER COM URL REAL**.
- Board: **PREENCHER COM URL REAL**.
- Vídeo AC1: **PREENCHER COM URL REAL**.
- Vídeo AC2: **PREENCHER COM URL REAL**.
- Vídeo AC3: **PREENCHER COM URL REAL**.
- Vídeo final: **PREENCHER QUANDO GRAVADO**.

Nenhum repositório remoto, board ou vídeo foi criado automaticamente. Confirme com o professor o ano do calendário e como regularizar as ACs atrasadas. Não altere datas de commits para simular entregas antigas.
