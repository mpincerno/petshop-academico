# Entregas, vídeos e publicação

## Calendário e prioridade

Referência desta preparação: **07/11/2026, horário de São Paulo**. O enunciado não declarou o ano; confirme com o professor. Se for 2026:

| Entrega | Data | Situação | Evidência que deve ser produzida |
|---|---|---|---|
| AC1 | 14/09/2026 | Prazo passado | Vídeo de clientes |
| AC2 | 13/10/2026 | Prazo passado | Vídeo de pets com tutor |
| AC3 | 08/11/2026 | Vence amanhã | Vídeo de agenda e validação de conflito |
| Final | 01/12/2026 | Planejada, código disponível | Vídeo de conclusão e painel |

Não há garantia de recebimento das ACs atrasadas. Solicite orientação ao professor e apresente o progresso real. Use as datas verdadeiras dos commits e gravações.

### Plano prático de recuperação

**07/11:** executar AC3, aprender o fluxo cliente → pet → agenda, conferir validações, preencher participantes, publicar código e criar board. Reservar aproximadamente 2 a 4 horas, dependendo da instalação e familiaridade. Fazer isso antes de gravar para evitar improvisos.

**Até 08/11:** gravar o vídeo AC3, verificar os links em outra janela, postar os itens exigidos. Separar evidências AC1 e AC2 e enviá-las conforme a orientação para atrasos. A recuperação não deve impedir a entrega atual.

**09 a 22/11:** estudar o código em APRENDIZADO.md, ensaiar explicação das três camadas, validar o modo final e revisar nomes/RA.

**23 a 30/11:** gravar a final, revisar documentação, permissões dos links e checklist; reservar margem para problemas.

**01/12:** confirmar que cada integrante efetivou sua entrega individual.

## Critérios de aceite de cada incremento

**AC1:** salvar cliente válido; listar e buscar; editar; excluir cliente sem vínculos; mostrar telefone inválido recusado; recarregar e demonstrar persistência.

**AC2:** reutilizar conceito da AC1; cadastrar cliente no banco AC2; cadastrar pet escolhendo tutor; conferir relação na listagem; editar pet; mostrar que não é possível apagar tutor com pet; excluir um pet sem histórico se precisar demonstrar exclusão.

**AC3:** cadastrar ou usar cliente e pet no banco AC3; agendar serviço com preço visível; impedir dois atendimentos no mesmo horário; cancelar e reutilizar o horário; filtrar situações; mostrar persistência.

**Final:** usar o modo final; concluir serviço; mostrar mudança nos indicadores; mostrar que cancelados não geram receita; conferir valores e quantidades por serviço.

## Roteiros dos vídeos

Grave **quatro vídeos distintos**, cada um com uma novidade. As durações abaixo são sugestões, não exigências do professor. Grave sua tela com uma ferramenta que já tenha disponível, como o recurso de gravação de tela do Windows, se presente, ou outro gravador de sua preferência. Confira uma gravação curta de 10 segundos para testar microfone e legibilidade.

Antes de gravar: feche notificações e contas pessoais; use dados fictícios; aumente o zoom se o texto ficar pequeno; ensaie os cliques; deixe a pasta do código e o terminal acessíveis. Não precisa instalar um aplicativo adicional se já tiver como gravar.

### AC1 — 2 a 3 minutos

**Preparação:** Ctrl+C em qualquer servidor anterior; `npm.cmd run ac1`; recarregar navegador. Banco AC1 separado.

- **0:00–0:20 — abertura:** “Somos [nomes e RA]. Este é o PetShop Manager. Na AC1 implementamos o cadastro de clientes.”
- **0:20–1:10 — funcionalidade:** cadastrar Ana Demonstração; buscar Ana; editar o telefone; salvar. Dizer: “As informações são enviadas ao servidor e armazenadas no SQLite.”
- **1:10–1:40 — validação:** tentar telefone 123; mostrar mensagem; corrigir. Se demonstrar exclusão, usar outro cliente fictício sem vínculos.
- **1:40–2:10 — persistência:** recarregar e mostrar o cliente salvo; se houver tempo, reiniciar servidor com o mesmo comando.
- **2:10–2:40 — arquitetura e fechamento:** mostrar `public/index.html`, `src/app.js` e `src/schema.sql`; explicar uma frase por camada. Mostrar o card AC1 no board e o código no GitHub, depois que existirem de fato.

### AC2 — 2 a 3 minutos

**Preparação:** iniciar `npm.cmd run ac2`; cadastrar Ana no banco AC2 antes de começar a parte principal.

- **0:00–0:20:** “Na AC2 adicionamos pets vinculados aos clientes, sobre o cadastro apresentado na AC1.”
- **0:20–1:10:** abrir Pets, selecionar Ana, cadastrar Luna, Gato, SRD. Mostrar nome do tutor na tabela.
- **1:10–1:40:** editar a raça ou o nome do pet e salvar. Dizer: “O pet guarda o identificador do cliente; o banco assegura o vínculo.”
- **1:40–2:10:** voltar a Clientes, tentar excluir Ana e mostrar a proteção de vínculo. Não é necessário excluir para concluir a apresentação.
- **2:10–2:40:** recarregar, mostrar o pet; mostrar a tabela `pets` e `REFERENCES clientes(id)` no SQL. Encerrar com board e GitHub reais.

### AC3 — 3 a 4 minutos

**Preparação:** iniciar `npm.cmd run ac3`; usar Ana e Luna no banco AC3. Escolher uma data e horários ainda livres na sua base.

- **0:00–0:25:** “A novidade da AC3 é a agenda de serviços, integrada aos pets e seus tutores.”
- **0:25–1:20:** agendar Luna, Banho, 08/11/2026 às 09:00. Mostrar R$ 50 e situação Agendado.
- **1:20–2:00:** tentar outro agendamento às 09:00 do mesmo dia. Mostrar a mensagem de horário ocupado.
- **2:00–2:40:** cancelar o agendamento, confirmar e agendar às 09:00 novamente. Explicar que o pet shop tem uma estação e cada serviço dura uma hora.
- **2:40–3:10:** filtrar Agendado e Cancelado; voltar a Todas. Recarregar para mostrar que os registros persistem.
- **3:10–3:50:** mostrar índice `horario_ocupado` em `src/schema.sql`, o card AC3 validado no board e o repositório real. Explicar que o banco também garante exclusividade.

### Entrega final — 3 a 4 minutos

**Preparação:** iniciar `npm.cmd run final`; ter cliente, pet, banho às 09h e tosa às 10h. Para mostrar os números exatos abaixo, usar um banco final sem outros atendimentos concluídos.

- **0:00–0:30:** resumir clientes, pets e agenda em uma frase. “Na entrega final acrescentamos conclusão de serviços e painel gerencial.”
- **0:30–1:20:** abrir Painel antes da conclusão; voltar à Agenda e concluir o Banho de R$ 50.
- **1:20–2:00:** abrir Painel: um concluído e R$ 50 de receita demonstrativa. Mostrar linha Banho com quantidade 1.
- **2:00–2:40:** cancelar a Tosa de R$ 70; voltar ao painel. A receita permanece R$ 50; cancelamentos aumentam.
- **2:40–3:15:** dizer que os valores são acadêmicos e que a conclusão não confirma pagamento. Mostrar o resumo SQL em `/api/painel` e explicar que soma apenas concluídos.
- **3:15–3:50:** mostrar testes passando, board atualizado, GitHub e participantes. Encerrar informando os limites e o que aprendeu.

**Depois de gravar:** assista ao vídeo inteiro. Confira som, letras, mensagens e conclusão do fluxo. Salve nomes claros: `AC1-clientes.mp4`, `AC2-pets.mp4`, `AC3-agenda.mp4`, `Final-painel.mp4`. Envie para o local aceito pelo professor e obtenha o link de visualização. Teste o acesso com uma conta/janela que represente o professor. Não use o endereço local do arquivo como link.

## Coloque o código no GitHub

Esta preparação não criou repositório remoto nem publicou dados em sua conta.

1. Entre no [GitHub](https://github.com/) com sua conta.
2. Crie um repositório chamado `petshop-academico`.
3. Escolha visibilidade conforme as regras da disciplina. Se privado, garanta acesso do professor; se público, não inclua dados pessoais reais nem bancos.
4. Para o fluxo de comandos abaixo, deixe o repositório remoto vazio, sem README automático.
5. No terminal do VS Code, na pasta do projeto, digite:

```powershell
git init
git branch -M main
git status
git add .
git commit -m "Implementa PetShop acadêmico com entregas incrementais"
```

Se o Git pedir identidade, configure **seu nome e seu e-mail real** somente neste projeto:

```powershell
git config user.name "SEU NOME"
git config user.email "SEU EMAIL DO GITHUB"
```

Depois repita o commit. Esses valores são exemplos a substituir, não dados já configurados.

6. Copie do GitHub a URL HTTPS real do seu repositório. Execute `git remote add origin URL_REAL_COPIADA`, substituindo o último trecho pela URL, sem colchetes.
7. Execute `git push -u origin main` e faça sua autenticação na janela oficial quando solicitada. Não compartilhe senhas ou tokens no chat.
8. Abra o repositório no navegador. Confira README, pastas e código. **data/*.sqlite e node_modules não devem estar publicados.**
9. Copie o endereço da página do repositório para README e para o modelo Classroom.

Se a pasta já for um repositório, confira `git status` e `git remote -v` antes de adicionar um remoto. “origin already exists” indica remoto já configurado: confira o destino, sem substituir às cegas. Se o push for recusado por histórico remoto, não use força; confira se criou o repositório vazio ou peça ajuda com a mensagem exata.

Em atualizações: `git add .`, `git commit -m "Descreva o que mudou"`, `git push`. Não invente commits retroativos. Os modos das ACs não substituem o histórico de desenvolvimento.

## Crie o board

Use Trello, GitHub Projects ou outra ferramenta aceita. Um board é um quadro onde cada cartão descreve uma funcionalidade. Este pacote contém um **modelo**, não um board online.

1. Crie o quadro “PetShop Manager — Projeto de Software”.
2. Crie colunas: **A fazer**, **Em andamento**, **Em validação**, **Concluído**.
3. Abra `docs/BOARD.csv` no editor ou numa planilha e crie os cartões com título, etapa, critério de aceite e responsável. O CSV é referência para cópia; não pressupõe que sua ferramenta permita importação direta.
4. Use etiquetas **AC1**, **AC2**, **AC3**, **Final**.
5. O código pronto pode entrar em **Em validação**. Mova a **Concluído** apenas depois de testar e anexar evidência real.
6. Em cada cartão, inclua responsável, data real, checklist do aceite e link do commit/vídeo quando disponível.
7. Separe cartões de implementação, gravação e postagem. Código pronto não significa entrega já enviada.
8. Gere/copie o link de leitura do quadro e confira o acesso do professor.

Exemplo de cartão:

> **AC3 — Agendar serviço**  
> Como atendente, quero escolher pet, serviço, data e hora para organizar os cuidados.  
> Aceite: pet existente; preço visível; persistência após recarregar; conflito de horário recusado.  
> Responsável: preencher. Situação inicial: Em validação.  
> Evidência: preencher depois do teste e da gravação.

## Checklist individual do Classroom

Cada aluno deve postar, mesmo que outro integrante já tenha enviado.

- [ ] Confirmar ano, atividade correta, prazo e orientação para atrasos.
- [ ] Informar nome completo e RA de **todos** os participantes, entre 1 e 7.
- [ ] Informar turma e nome do projeto.
- [ ] Link real do board com funcionalidades e situação atual.
- [ ] Link real do GitHub com código e README.
- [ ] Vídeo específico da entrega, demonstrando a funcionalidade nova.
- [ ] Conferir se os links abrem e se o professor tem permissão.
- [ ] Conferir se o vídeo tem áudio, tela legível e fluxo funcionando.
- [ ] Preencher e revisar o texto de `MODELO-CLASSROOM.txt`.
- [ ] Anexar ou colar conforme a atividade e clicar para efetivar a entrega.
- [ ] Verificar o estado “Entregue” e guardar o comprovante, se disponível.
- [ ] Repetir individualmente para cada integrante.

Não foram gravados vídeos, criados links externos ou enviados trabalhos por esta preparação.
