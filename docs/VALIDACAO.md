# Registro de validação

Preparação em 07/11/2026.

## Verificação executada

Ambiente: Windows, Node.js **24.22.1**, Express **5.1.0**, instalação com pnpm **11.25.0**. Os comandos npm dos guias são scripts equivalentes definidos em package.json; a instalação por npm não foi executada neste ambiente.

Comando: `node --test`.

**Resultado: 7 testes passaram, 0 falhas.**

1. Fluxo completo de cadastro, edição, validações, vínculos, agenda, conflito, cancelamento, conclusão e receita.
2. Exclusão de pet e cliente sem vínculos.
3. Recursos disponíveis na AC1.
4. Recursos disponíveis na AC2.
5. Recursos disponíveis na AC3, inclusive bloqueio de conclusão.
6. Recursos disponíveis na final.
7. Persistência ao fechar e reabrir arquivo SQLite; catálogo não duplica.

Também foram conferidas as sintaxes JavaScript e a resposta HTTP da página inicial.

## Conferência no navegador

Foram observados:
- abertura da interface com os menus da final;
- cadastro de cliente fictício;
- cadastro de pet vinculado à tutora;
- agendamento de banho com data e hora;
- recusa de uma segunda reserva no mesmo horário;
- layout dos formulários e tabelas.

A confirmação nativa do navegador bloqueou a ferramenta de verificação visual. Ela foi substituída por uma confirmação dentro da página. Após esse ajuste, a sintaxe e os testes da API passaram novamente. A ferramenta permaneceu com a aba bloqueada, por isso **a confirmação final da nova caixa e o clique de conclusão devem ser conferidos manualmente**. A conclusão e seus valores no painel foram verificados pela API, sem depender da tela.

A captura `tela-clientes.png` mostra o cadastro fictício usado no teste, não um serviço publicado na internet.

## Teste manual antes de gravar

- [ ] Abrir a AC desejada e conferir o selo da etapa.
- [ ] Salvar e editar cliente; buscar; tentar telefone inválido.
- [ ] Criar pet; editar; conferir tutor.
- [ ] Tentar excluir cliente com pet e observar proteção.
- [ ] Excluir um cadastro sem dependências, conferindo Voltar e Confirmar ação.
- [ ] Agendar horário livre e tentar repetir.
- [ ] Cancelar: clicar Cancelar e depois Confirmar ação.
- [ ] Confirmar liberação do horário e permanência do cancelado no histórico.
- [ ] Na final, concluir: clicar Concluir e depois Confirmar ação.
- [ ] Confirmar que Voltar e Escape fecham a caixa sem mudar o registro.
- [ ] Conferir valor do concluído no painel e ausência de receita dos cancelados.
- [ ] Recarregar e reiniciar o mesmo modo para comprovar persistência.
- [ ] Em janela estreita, conferir que os campos permanecem utilizáveis e que tabelas podem rolar horizontalmente.
- [ ] Gravar somente depois de executar o fluxo que será apresentado.

Os testes são suporte à entrega; não substituem sua demonstração e entendimento do trabalho.
