# Seu primeiro uso, passo a passo

## 1. O que você vai construir

Um programa que abre no navegador, mas salva informações em um banco no seu computador. Você será capaz de cadastrar Ana como cliente, cadastrar o pet Luna para Ana e agendar um banho para Luna. Na entrega final, poderá concluir o banho e ver R$ 50 no painel.

- **Programa/editor**: onde você lê e altera os arquivos.
- **Pasta do projeto**: contém o README e o arquivo package.json.
- **Terminal**: janela onde você digita comandos e pressiona Enter.
- **Servidor**: programa que precisa ficar ligado no terminal enquanto usa as telas.
- **Banco de dados**: arquivo que guarda os cadastros mesmo depois de fechar o navegador.

## 2. Instale os programas

1. Acesse [Node.js](https://nodejs.org/en/download) e instale a versão **24.x** para Windows com o npm incluído. Se o site oferecer outra versão principal, escolha a linha 24. Aceite as opções padrão do instalador oficial.
2. Instale [Visual Studio Code](https://code.visualstudio.com/) para ler e editar o código. Ele é um editor, não executa o servidor sozinho.
3. Para a etapa de GitHub por comandos, instale [Git para Windows](https://git-scm.com/downloads/win). Você pode deixar isso para depois de fazer o sistema funcionar.
4. Após instalar, feche e reabra o terminal ou o VS Code para reconhecer os programas.

Não precisa instalar SQLite, MySQL, Python, React ou criar uma conta para rodar o sistema.

## 3. Abra a pasta correta

Se recebeu o ZIP, clique com o botão direito e escolha **Extrair tudo**. Trabalhe na pasta extraída, não dentro do ZIP. Se estiver lendo os arquivos já criados no computador, abra a pasta **petshop-academico** entregue nesta conversa.

No VS Code, vá a **Arquivo → Abrir Pasta** e escolha a pasta que contém `package.json`, `README.md`, `src` e `public`. Depois abra **Terminal → Novo Terminal**.

Digite um comando por vez e pressione Enter:

```powershell
node --version
npm.cmd --version
```

O primeiro deve mostrar `v24...`. O segundo mostra a versão do instalador de bibliotecas. Use `npm.cmd` no Windows para evitar bloqueios do arquivo `npm.ps1`.

## 4. Instale a biblioteca e inicie a AC3

No mesmo terminal:

```powershell
npm.cmd install
npm.cmd run ac3
```

O primeiro comando baixa o Express e suas dependências e cria `node_modules`. Precisa de internet. Normalmente basta executar uma vez. O segundo inicia o servidor. O terminal deve mostrar:

```text
PetShop | AC3 | http://127.0.0.1:3000
Banco: .../data/petshop-ac3.sqlite
Para encerrar: Ctrl+C
```

O terminal parecerá ocupado: isso é normal. Mantenha-o aberto. Abra Chrome ou Edge e digite **http://127.0.0.1:3000** na barra de endereços.

## 5. Faça uma demonstração completa

Use dados fictícios para não expor informações de pessoas em vídeos.

1. Em **Clientes**, digite nome **Ana Demonstração**, telefone **(11) 99999-1234** e e-mail **ana@example.com**. Clique **Salvar cliente**.
2. Veja o cliente na tabela. Digite Ana no campo Buscar cliente. Limpe a busca para voltar a ver todos.
3. Clique **Editar**, mude o nome e salve. O mesmo cadastro será atualizado, sem duplicação.
4. Em **Pets**, escolha Ana como tutora. Nome: **Luna**. Espécie: **Gato**. Raça: **SRD**. Clique **Salvar pet**.
5. Em **Agenda**, selecione Luna, serviço **Banho**, data **08/11/2026**, horário **09:00**. Clique **Agendar cuidado**.
6. Tente agendar outro serviço na mesma data e horário. O sistema deve avisar que já está ocupado.
7. Cancele o primeiro agendamento, confirme e agende novamente às 09:00. Agora deve funcionar.
8. Recarregue a página. Seus dados devem continuar visíveis.
9. Encerre o servidor com **Ctrl+C**, execute de novo `npm.cmd run ac3` e abra a página. Os cadastros continuarão lá.

O campo de data depende do idioma do navegador: você pode enxergar dia/mês/ano, mas ele é enviado ao servidor no formato ano-mês-dia.

## 6. Demonstre a entrega final

1. Encerre o servidor da AC3.
2. Execute `npm.cmd run final`.
3. Recarregue o navegador e confira o selo **Entrega final**.
4. O banco é separado: cadastre o cliente, o pet e dois agendamentos, por exemplo banho às 09:00 e tosa às 10:00.
5. Clique **Concluir** no banho e confirme. Cancele a tosa.
6. Abra **Painel**: deve mostrar um concluído, um cancelado e **R$ 50,00** de receita demonstrativa.
7. O cancelamento não soma receita. O painel atualiza após as ações da mesma tela; se outro navegador alterar dados, recarregue.

Se quiser aproveitar o banco AC3, siga a orientação de cópia e backup no README antes de iniciar a final.

## 7. Troque de etapa

Sempre: **Ctrl+C → novo comando → recarregar o navegador**.

```powershell
npm.cmd run ac1
```

Mostra só Clientes. Para AC2, use `npm.cmd run ac2`. Para AC3, `npm.cmd run ac3`. Para final, `npm.cmd run final`. Não execute dois comandos de início ao mesmo tempo na mesma porta. `npm.cmd start` também inicia o modo final.

## 8. Quando algo não funcionar

| Sintoma | O que fazer |
|---|---|
| “node não é reconhecido” | Instale Node 24.x e reabra o VS Code/terminal. |
| “npm.cmd não é reconhecido” | Confira instalação do Node com npm; reabra o terminal. |
| ENOENT / package.json não encontrado | Abra a pasta petshop-academico, aquela que contém package.json. |
| ERR_UNKNOWN_BUILTIN_MODULE / node:sqlite | Confira `node --version`; use Node 24.x. |
| “Cannot find package express” | Rode `npm.cmd install` na pasta do projeto. |
| Página não abre / conexão recusada | Confira se o terminal mostra a URL e se o servidor está ligado. |
| Porta ocupada | Encerre o servidor anterior com Ctrl+C. Se outro programa usa 3000, no PowerShell rode `$env:PORT='3001'` e depois o comando da etapa. Abra a porta 3001. |
| Menu não mudou | Encerre o servidor anterior, execute a etapa correta e recarregue a página. |
| Cliente não aparece em Pets | Salve o cliente primeiro; confira o modo indicado no topo. |
| Dados “sumiram” | Você pode ter trocado de etapa: cada uma usa seu banco. Volte à anterior. |
| Não consegue excluir | Há pet ou histórico vinculado; o sistema impede perder o relacionamento. |
| Horário ocupado | Escolha outra hora ou cancele o atendimento em aberto. Concluídos ficam no histórico. |
| Falha de internet no install | Confira sua conexão e repita a instalação. Não desative proteções do Windows. |

Fechar o navegador não encerra o servidor. Fechar o terminal encerra. Para fazer backup, pare o servidor e copie a pasta `data` para um lugar seguro. Não envie bancos com dados pessoais ao GitHub.
