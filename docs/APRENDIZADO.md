# Aprenda o projeto por etapas

O projeto já está escrito; você não precisa redigitar centenas de linhas. “Do zero” aqui significa saber instalar, rodar, localizar cada responsabilidade e alterar algo com segurança. Leia o código com o VS Code e execute um incremento de cada vez.

## 1. Conheça os arquivos antes de editar

Abra `package.json`. Ele lista:
- nome e versão do projeto;
- Node esperado;
- comandos em `scripts`;
- Express em `dependencies`.

`npm.cmd install` lê esse arquivo e baixa as bibliotecas. `npm.cmd run ac1` executa o texto do script ac1: `node src/server.js --etapa=ac1`. Você não precisa escrever servidor do zero em cada entrega.

Abra `src/server.js`. Ele lê a etapa, abre o banco, constrói a aplicação e escuta uma porta. A porta 3000 é como uma entrada local para o navegador. A URL 127.0.0.1 significa seu próprio computador.

## 2. AC1 — entenda um cadastro completo

Execute `npm.cmd run ac1`.

1. Abra `public/index.html` e encontre `form-cliente`. O atributo `name="nome"` dá nome ao valor do campo. `required` pede preenchimento no navegador.
2. Abra `public/app.js` e procure `Object.fromEntries(new FormData(form))`. Isso transforma os campos em um objeto JavaScript.
3. Procure a função `api`. Ela usa `fetch` para pedir algo ao servidor. JSON é a forma de escrever os dados que serão enviados.
4. Abra `src/app.js` e procure `app.post('/api/clientes'`. Esta é a entrada que recebe o pedido de cadastro.
5. Leia `clienteValido`. O servidor verifica o formulário de novo. Isso é necessário porque alguém pode enviar um pedido sem usar a tela.
6. Observe `INSERT INTO clientes(nome, telefone, email) VALUES (?, ?, ?)`. INSERT significa inserir; os pontos de interrogação recebem valores separadamente do comando.
7. Abra `src/schema.sql` e leia `CREATE TABLE ... clientes`. A tabela descreve como os dados serão guardados.
8. Procure o GET de clientes. SELECT busca registros. ORDER BY organiza a lista.
9. Compare PUT, que altera, e DELETE, que remove um cadastro sem vínculos.

**Explique com suas palavras:** “Eu preencho o formulário; JavaScript envia dados por HTTP; Express valida; SQLite guarda; o navegador atualiza a lista.”

**Exercício pequeno:** em `public/index.html`, mude “Novo cliente” para “Cadastrar tutor”, salve e recarregue. O JavaScript também define esse título ao limpar formulários: procure “Novo cliente” em `public/app.js` e mantenha os dois coerentes. Uma mudança visual não deveria alterar o banco.

## 3. AC2 — entenda o relacionamento

Encerre AC1, execute `npm.cmd run ac2` e recarregue. Este banco começa vazio.

1. Cadastre um cliente.
2. Cadastre um pet para esse tutor.
3. Em `schema.sql`, leia `cliente_id ... REFERENCES clientes(id)`.
4. Em `src/app.js`, leia `petValido`: o servidor procura o tutor antes de salvar.
5. Encontre o SELECT de pets com JOIN. JOIN junta a tabela de pets com clientes para exibir o nome do tutor.
6. Tente remover o tutor na tela. O banco recusa porque há um pet dependente.

**Explique:** “O pet guarda o ID do cliente, não uma cópia independente do contato. Assim consigo relacionar vários pets ao mesmo tutor.”

**Exercício:** altere uma raça e confira que o nome do tutor continua correto. Mostre por que duas pessoas com o mesmo nome continuam sendo registros distintos: possuem IDs diferentes.

## 4. AC3 — entenda a regra da agenda

Execute `npm.cmd run ac3`, recarregue e cadastre cliente/pet no banco AC3.

1. Abra `schema.sql` e confira os três serviços inseridos.
2. Em `public/app.js`, localize a formação de `dados.inicio`, combinando data e hora.
3. Em `src/app.js`, leia `horarioValido`. Ela confere formato, calendário e faixa de horário.
4. Leia o POST de agendamentos: o preço vem do catálogo no banco, e o servidor registra uma cópia desse preço.
5. Em `schema.sql`, leia o índice `horario_ocupado`. Um índice único impede dois valores iguais; a condição exclui os cancelados dessa exclusividade.
6. Faça duas tentativas no mesmo horário. Veja que a API retorna conflito e a interface mostra uma mensagem.
7. Leia a rota PATCH de status. Ela só muda um atendimento que ainda está Agendado.
8. Cancele e tente o horário novamente.

**Explique:** “Bloquear duas reservas é uma regra do negócio. O banco também a garante, então duas requisições concorrentes não podem criar a mesma vaga.”

**Exercício:** tente datas e horários diferentes; depois cancele um agendamento e filtre Cancelado. Não mude a duração de um serviço sem revisar a regra de conflito: o sistema inteiro assume uma hora.

## 5. Final — entenda contagens e soma

Execute `npm.cmd run final`, prepare um banho e uma tosa, conclua só o banho.

1. Encontre `/api/painel` no back-end.
2. COUNT conta linhas. SUM soma valores. CASE seleciona o que deve entrar na soma.
3. Leia o trecho que inclui preço somente quando o status é Concluído.
4. Veja o LEFT JOIN com serviços: o catálogo continua no relatório mesmo quando uma modalidade tem zero atendimentos.
5. No front-end, veja `desenharPainel` e `dinheiro`. O banco guarda 5000 centavos; a tela exibe R$ 50,00.
6. Cancele a tosa. O número de cancelamentos muda e a receita não.

**Explique:** “O painel consulta dados já cadastrados. Concluir um atendimento muda seu status, e a soma dos concluídos passa a incluí-lo. Isto não integra pagamentos.”

## 6. Faça sua primeira alteração e registre

1. Encerre o servidor quando for alterar arquivos do back-end. Edite uma mudança pequena.
2. Salve o arquivo.
3. Execute `npm.cmd test`. Leia se algum teste falhou.
4. Inicie o modo desejado. Alterações em HTML/CSS/JS do navegador aparecem ao recarregar. Alterações em `src` precisam reiniciar o servidor.
5. Demonstre manualmente o fluxo alterado.
6. Confira `git diff`, faça um commit com descrição verdadeira e atualize seu board.

O esquema usa CREATE TABLE IF NOT EXISTS: mudar o texto de uma tabela no SQL não modifica automaticamente tabelas existentes. Alterações de estrutura exigem migração e backup. Para este trabalho, mantenha o esquema pronto e faça primeiro exercícios na interface.

## 7. Perguntas para ensaiar antes do vídeo

- O que cada camada faz e em quais arquivos está?
- Onde os dados ficam salvos?
- O que acontece entre clicar Salvar e aparecer uma linha na tabela?
- Por que um pet precisa de cliente_id?
- Por que o servidor valida mesmo com required no HTML?
- Como o sistema evita horário duplicado?
- Qual a diferença entre Cancelado e Concluído?
- O que a receita demonstrativa mede?
- Qual funcionalidade foi acrescentada em cada entrega?
- Quais funcionalidades ainda não existem?

Se não souber responder, volte ao arquivo correspondente e acompanhe um cadastro. Se usar auxílio de IA, siga a política da disciplina e descreva sua participação com transparência.
