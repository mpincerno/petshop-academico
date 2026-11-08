// Camada de apresentação: lê formulários, chama a API e desenha as telas.
const $ = seletor => document.querySelector(seletor);
const estado = { nivel: 1, clientes: [], pets: [], servicos: [], agendamentos: [] };
const dinheiro = centavos => (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
// Todo dado digitado pelo usuário é escapado antes de entrar em um HTML.
const esc = valor => String(valor ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function aviso(texto, erro = false) {
  const el = $('#mensagem');
  el.textContent = texto; el.className = erro ? 'erro' : ''; el.hidden = false;
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
function confirmar(texto) {
  const dialogo = $('#confirmacao');
  $('#confirmacao-texto').textContent = texto;
  dialogo.returnValue = '';
  return new Promise(resolve => {
    dialogo.addEventListener('close', () => resolve(dialogo.returnValue === 'confirmar'), { once: true });
    dialogo.showModal();
  });
}
async function api(url, metodo = 'GET', dados) {
  const resposta = await fetch('/api/' + url, {
    method: metodo,
    headers: dados ? { 'Content-Type': 'application/json' } : {},
    body: dados ? JSON.stringify(dados) : undefined
  });
  const json = await resposta.json();
  if (!resposta.ok) throw new Error(json.erro || 'Falha na operação.');
  return json;
}
const vazio = (n, texto) => '<tr><td colspan="' + n + '" class="empty">' + texto + '</td></tr>';
function opcoes(seletor, lista, label) {
  const select = $(seletor);
  const atual = select.value;
  select.innerHTML = '<option value="">Selecione…</option>' + lista.map(item =>
    '<option value="' + item.id + '">' + esc(label(item)) + '</option>').join('');
  if (lista.some(item => String(item.id) === atual)) select.value = atual;
}
function botoes(tipo, id) {
  return '<div class="row-actions"><button type="button" class="link-button" data-acao="editar" data-tipo="' + tipo + '" data-id="' + id + '">Editar</button><button type="button" class="link-button danger" data-acao="excluir" data-tipo="' + tipo + '" data-id="' + id + '">Excluir</button></div>';
}
function desenharClientes() {
  const termo = $('#busca-cliente').value.trim().toLocaleLowerCase('pt-BR');
  const linhas = estado.clientes.filter(c => (c.nome + ' ' + c.telefone).toLocaleLowerCase('pt-BR').includes(termo));
  $('#lista-clientes').innerHTML = linhas.map(c => '<tr><td><strong>' + esc(c.nome) +
    '</strong><small>#' + c.id + '</small></td><td>' + esc(c.telefone) + '<small>' + esc(c.email || 'Sem e-mail') +
    '</small></td><td>' + botoes('clientes', c.id) + '</td></tr>').join('') || vazio(3, 'Nenhum cliente encontrado. Cadastre o primeiro tutor.');
}
function desenharPets() {
  $('#lista-pets').innerHTML = estado.pets.map(p => '<tr><td><strong>' + esc(p.nome) + '</strong><small>' +
    esc(p.especie + (p.raca ? ' · ' + p.raca : '')) + '</small></td><td>' + esc(p.cliente_nome) +
    '</td><td>' + botoes('pets', p.id) + '</td></tr>').join('') || vazio(3, 'Nenhum pet cadastrado.');
}
function dataHora(valor) {
  const [data, hora] = valor.split('T');
  return data.split('-').reverse().join('/') + ' às ' + hora;
}
function desenharAgenda() {
  const filtro = $('#filtro-status').value;
  $('#lista-agendamentos').innerHTML = estado.agendamentos.filter(a => !filtro || a.status === filtro).map(a => {
    let acoes = '';
    if (a.status === 'Agendado') {
      if (estado.nivel >= 4) acoes += '<button type="button" class="link-button" data-acao="status" data-id="' + a.id + '" data-status="Concluído">Concluir</button>';
      acoes += '<button type="button" class="link-button danger" data-acao="status" data-id="' + a.id + '" data-status="Cancelado">Cancelar</button>';
    }
    const cor = a.status === 'Concluído' ? 'done' : a.status === 'Cancelado' ? 'cancel' : '';
    return '<tr><td><strong>' + esc(dataHora(a.inicio)) + '</strong><small>' + esc(a.pet_nome) + ' · ' + esc(a.cliente_nome) +
      '</small></td><td>' + esc(a.servico_nome) + '<small>' + dinheiro(a.preco_centavos) + '</small></td><td><span class="badge ' + cor + '">' +
      esc(a.status) + '</span><div class="row-actions">' + acoes + '</div></td></tr>';
  }).join('') || vazio(3, 'Nenhum agendamento para esta situação.');
}
function desenharPainel(p) {
  const itens = [['Clientes', p.clientes], ['Pets', p.pets], ['Agendamentos em aberto', p.abertos],
    ['Serviços concluídos', p.concluidos], ['Cancelamentos', p.cancelados], ['Receita demonstrativa', dinheiro(p.receita_centavos)]];
  $('#indicadores').innerHTML = itens.map(([nome, valor]) => '<div class="metric"><span>' + nome + '</span><strong>' + valor + '</strong></div>').join('');
  $('#lista-resumo').innerHTML = p.servicos.map(s => '<tr><td>' + esc(s.nome) + '</td><td>' + s.quantidade + '</td><td>' + dinheiro(s.receita_centavos) + '</td></tr>').join('');
}
async function atualizar() {
  estado.clientes = await api('clientes');
  desenharClientes();
  if (estado.nivel >= 2) {
    estado.pets = await api('pets');
    opcoes('#form-pet [name=cliente_id]', estado.clientes, c => c.nome + ' (#' + c.id + ')');
    desenharPets();
  }
  if (estado.nivel >= 3) {
    [estado.servicos, estado.agendamentos] = await Promise.all([api('servicos'), api('agendamentos')]);
    opcoes('#form-agendamento [name=pet_id]', estado.pets, p => p.nome + ' — ' + p.cliente_nome + ' (#' + p.id + ')');
    opcoes('#form-agendamento [name=servico_id]', estado.servicos, s => s.nome + ' — ' + dinheiro(s.preco_centavos));
    desenharAgenda();
  }
  if (estado.nivel >= 4) desenharPainel(await api('painel'));
}
function limpar(tipo) {
  const form = $('#form-' + tipo);
  form.reset();
  if (tipo !== 'agendamento') {
    form.elements.id.value = '';
    $('#' + tipo + '-form-titulo').textContent = tipo === 'cliente' ? 'Novo cliente' : 'Novo pet';
  }
}
for (const [tipo, rota] of [['cliente', 'clientes'], ['pet', 'pets'], ['agendamento', 'agendamentos']]) {
  $('#form-' + tipo).addEventListener('submit', async evento => {
    evento.preventDefault();
    const form = evento.currentTarget;
    const botao = form.querySelector('[type=submit]');
    botao.disabled = true;
    try {
      const dados = Object.fromEntries(new FormData(form));
      const registro = dados.id; delete dados.id;
      if (tipo === 'agendamento') {
        dados.inicio = dados.data + 'T' + dados.hora;
        delete dados.data; delete dados.hora;
      }
      await api(rota + (registro ? '/' + registro : ''), registro ? 'PUT' : 'POST', dados);
      limpar(tipo);
      await atualizar();
      aviso(tipo === 'agendamento' ? 'Agendamento registrado.' : 'Cadastro salvo.');
    } catch (erro) { aviso(erro.message, true); }
    finally { botao.disabled = false; }
  });
}
const titulos = {
  clientes: ['Clientes', 'Cadastre quem confia os cuidados do pet a você.'],
  pets: ['Pets', 'Organize os animais e seus tutores.'],
  agenda: ['Agenda', 'Reserve um horário para o próximo cuidado.'],
  painel: ['Painel', 'Acompanhe os resultados dos atendimentos.']
};
document.addEventListener('click', async evento => {
  const botao = evento.target.closest('button');
  if (!botao) return;
  if (botao.dataset.tab) {
    document.querySelectorAll('.page').forEach(p => { p.hidden = p.id !== botao.dataset.tab; });
    document.querySelectorAll('[data-tab]').forEach(b => b.classList.toggle('active', b === botao));
    $('#titulo').textContent = titulos[botao.dataset.tab][0];
    $('#subtitulo').textContent = titulos[botao.dataset.tab][1];
    $('#mensagem').hidden = true;
  }
  if (botao.dataset.limpar) limpar(botao.dataset.limpar);
  if (!botao.dataset.acao) return;
  const { acao, tipo, id: registro, status } = botao.dataset;
  try {
    if (acao === 'editar') {
      const item = estado[tipo].find(i => String(i.id) === registro);
      const singular = tipo === 'clientes' ? 'cliente' : 'pet';
      const form = $('#form-' + singular);
      for (const [campo, valor] of Object.entries(item)) if (form.elements.namedItem(campo)) form.elements.namedItem(campo).value = valor;
      $('#' + singular + '-form-titulo').textContent = singular === 'cliente' ? 'Editar cliente' : 'Editar pet';
      form.elements.nome.focus();
      return;
    }
    if (acao === 'excluir') {
      if (!await confirmar('Excluir este cadastro? Cadastros com vínculos não podem ser removidos.')) return;
      await api(tipo + '/' + registro, 'DELETE');
      limpar(tipo === 'clientes' ? 'cliente' : 'pet');
    }
    if (acao === 'status') {
      if (!await confirmar(status === 'Cancelado' ? 'Cancelar este agendamento e liberar o horário?' : 'Marcar serviço como concluído? Essa ação encerra o atendimento.')) return;
      await api('agendamentos/' + registro + '/status', 'PATCH', { status });
    }
    await atualizar(); aviso('Alteração salva.');
  } catch (erro) { aviso(erro.message, true); }
});
$('#busca-cliente').addEventListener('input', desenharClientes);
$('#filtro-status').addEventListener('change', desenharAgenda);
async function iniciar() {
  try {
    const config = await api('config');
    estado.nivel = config.nivel;
    $('#etapa').textContent = config.etapa === 'final' ? 'Entrega final' : config.etapa.toUpperCase();
    document.querySelectorAll('[data-nivel]').forEach(el => { el.hidden = Number(el.dataset.nivel) > estado.nivel; });
    $('#form-agendamento [name=hora]').innerHTML = Array.from({length:10}, (_, i) => {
      const hora = String(i + 8).padStart(2, '0') + ':00';
      return '<option>' + hora + '</option>';
    }).join('');
    await atualizar();
  } catch (erro) { aviso('Não foi possível carregar o sistema. Confira o servidor no terminal. ' + erro.message, true); }
}
iniciar();
