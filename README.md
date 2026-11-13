# PetShop Manager

Sistema acadêmico de gerenciamento de um pet shop, desenvolvido para a disciplina de Projeto de Software. A aplicação permite cadastrar tutores e pets, agendar serviços e acompanhar os resultados dos atendimentos em um painel gerencial.

## Identificação

- **Aluno:** Mauro Pincerno Neto
- **RA:** 2203219
- **Modalidade:** trabalho individual
- **Turma:** 202602 - EAD - ADS 5A
- **Professor:** Antonio de Oliveira Dias
- **Prazo da entrega final:** 22/11/2026, conforme comunicado atualizado do professor

## Links do projeto

- [Código-fonte no GitHub](https://github.com/mpincerno/petshop-academico)
- [Board de funcionalidades](https://github.com/users/mpincerno/projects/1/views/1)
- [Vídeo AC1 - Cadastro de clientes](https://drive.google.com/file/d/1nw4AfgRpjcuO3FHbByeYvY4lQcmUJRQV/view)
- [Vídeo AC2 - Pets e tutores](https://drive.google.com/file/d/1atIsMc1nXNJDXH77q1Hls6nopgoURkOs/view)
- [Vídeo AC3 - Agendamento de serviços](https://drive.google.com/file/d/1cv3nLB9xCeryUcpowmvXYErGmSZMDFrw/view)
- [Vídeo final - Conclusão de serviços e painel gerencial](https://drive.google.com/file/d/1l6a0x5A1wSp2ZKZqUzwsr4_9rAFCwXlo/view)

## Funcionalidades

- **Clientes:** cadastro, listagem, busca por nome ou telefone, edição e exclusão de registros sem vínculos.
- **Pets:** cadastro, listagem e edição de animais vinculados aos tutores, além de exclusão quando não há histórico de agendamento.
- **Agenda:** consulta de serviços, agendamento por pet, serviço, data e horário, bloqueio de horários duplicados, cancelamento e filtro por situação.
- **Entrega final:** conclusão de atendimentos e painel com contagens de clientes, pets, agendamentos em aberto, concluídos e cancelados, além de quantidade e receita demonstrativa por serviço.
- **Persistência:** armazenamento em SQLite, preservando os registros após reiniciar a aplicação.

## Arquitetura de três camadas

| Camada | Tecnologias | Responsabilidade |
|---|---|---|
| Front-end | HTML, CSS e JavaScript | Exibir formulários, listas e indicadores; enviar requisições à API. |
| Back-end | Node.js e Express | Receber requisições HTTP, validar dados, aplicar regras de negócio e consultar o banco. |
| Banco de dados | SQLite | Armazenar clientes, pets, serviços e agendamentos, com vínculos e restrições de integridade. |

O navegador se comunica com o servidor por HTTP e JSON. O servidor acessa o banco usando consultas SQL parametrizadas. As três camadas são executadas localmente, com responsabilidades distintas.

## Diagramas

- [Diagramas e explicação técnica em PDF](docs/diagramas/PetShop-Diagramas.pdf)
- [Diagrama de classes em imagem](docs/diagramas/diagrama-classes.png)
- [Diagrama de casos de uso em imagem](docs/diagramas/diagrama-casos-de-uso.png)
- [Fonte editável do diagrama de classes](docs/diagramas/classes.puml)
- [Fonte editável do diagrama de casos de uso](docs/diagramas/casos-de-uso.puml)

O diagrama de classes representa o **modelo conceitual do domínio**, com Cliente, Pet, Servico e Agendamento. As operações descritas nesse modelo são implementadas por funções e rotas Express; não correspondem a classes JavaScript instanciadas. O diagrama de casos de uso apresenta o atendente ou responsável pelo pet shop e as funcionalidades disponíveis.

## Tecnologias e requisitos

- Node.js **24.x**, com npm.
- Express **5.1.0**, conforme a dependência definida no projeto.
- SQLite integrado ao Node.js pelo módulo `node:sqlite`.
- Navegador atualizado para acessar a interface.

Não é necessário instalar um servidor de banco de dados separado. A primeira instalação das dependências requer acesso à internet.

## Instalação e execução

No terminal, dentro da pasta que contém `package.json`, execute:

```powershell
npm.cmd install
npm.cmd run final
```

No Windows, `npm.cmd` evita a dependência de execução do arquivo `npm.ps1`. Em outros sistemas, os comandos equivalentes são `npm install` e `npm run final`.

Acesse **http://127.0.0.1:3000** no navegador. O terminal deve permanecer aberto enquanto a aplicação estiver em uso. Para encerrar o servidor, pressione **Ctrl+C**. A página depende do servidor; abrir `public/index.html` diretamente não executa a aplicação completa.

O banco da etapa é criado automaticamente na pasta `data`, com o catálogo inicial de serviços. Clientes, pets e agendamentos começam vazios em uma instalação nova. Para o primeiro atendimento, cadastre um cliente, depois um pet vinculado a ele e, por fim, o agendamento.

## Etapas incrementais

| Etapa | Comando | Funcionalidade acrescentada |
|---|---|---|
| AC1 | `npm.cmd run ac1` | Cadastro e manutenção de clientes. |
| AC2 | `npm.cmd run ac2` | Cadastro de pets vinculados aos tutores. |
| AC3 | `npm.cmd run ac3` | Agenda de serviços, conflito de horário e cancelamento. |
| Final | `npm.cmd run final` | Conclusão de serviços e painel gerencial. |

As funcionalidades são cumulativas. Os comandos selecionam o modo de demonstração e restringem tanto os menus quanto a API aos recursos da etapa. Esses modos fazem parte do mesmo código-fonte e não representam versões históricas separadas. `npm.cmd start` também executa o modo final.

Cada etapa utiliza um banco independente: `data/petshop-ac1.sqlite`, `data/petshop-ac2.sqlite`, `data/petshop-ac3.sqlite` e `data/petshop-final.sqlite`. Trocar de etapa não transfere nem apaga os registros das demais. Para mudar o modo, encerre o servidor atual, execute o comando desejado e recarregue o navegador.

## Regras de negócio e limites

- Nome e telefone com DDD são obrigatórios para clientes; e-mail é opcional.
- Cada pet deve estar vinculado a um tutor existente.
- A exclusão de clientes com pets e de pets com histórico de agendamento é bloqueada.
- O sistema considera uma estação de atendimento, serviços com duração de 60 minutos e horários de início entre 08:00 e 17:00, todos os dias, na hora civil de Brasília.
- Datas entre 2026 e 2100 são aceitas, inclusive datas passadas para registros históricos e demonstração.
- Um mesmo horário não pode ser reservado por dois atendimentos não cancelados.
- Um agendamento em aberto pode ser cancelado ou concluído. Registros encerrados não são reabertos. Cancelar preserva o histórico e libera o horário; para remarcar, é necessário cancelar e criar outro agendamento.
- O catálogo inicial contém Banho (R$ 50,00), Tosa (R$ 70,00) e Banho e tosa (R$ 100,00). A interface não permite editar esse catálogo.
- Os preços são armazenados em centavos e copiados para o agendamento.
- A receita demonstrativa soma apenas serviços concluídos; não representa confirmação de pagamento. O painel considera todo o histórico da etapa, sem filtro por período.
- O escopo é acadêmico e local, sem autenticação, estoque, integração de pagamentos ou múltiplas estações. O servidor escuta em `127.0.0.1`.

## Estrutura do código

```text
public/               Interface: HTML, CSS e JavaScript.
src/app.js            API, validações e regras de negócio.
src/database.js       Abertura da conexão SQLite.
src/schema.sql        Tabelas, relacionamentos, restrições e catálogo inicial.
src/server.js         Inicialização do servidor e seleção da etapa.
test/                 Testes de integração.
data/                 Bancos SQLite gerados localmente e ignorados pelo Git.
docs/                 Documentação de apoio.
docs/diagramas/       PDF, imagens e fontes editáveis dos diagramas.
```

## Testes

```powershell
npm.cmd test
```

Os testes usam bancos em memória ou arquivos temporários, sem alterar os cadastros da aplicação. A suíte verifica cadastros, edição, exclusão, validações, integridade dos vínculos, conflito de horário, cancelamento, conclusão, receita, disponibilidade por etapa e persistência em arquivo.

## Documentação complementar

- [Arquitetura, modelo de dados e API](docs/ARQUITETURA.md)
- [Registro de validação e checklist de testes](docs/VALIDACAO.md)
- [Guia de instalação e uso](docs/COMECE-AQUI.md)
