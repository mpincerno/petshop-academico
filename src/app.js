// Camada de aplicação: recebe HTTP, valida regras e consulta o banco.
import express from 'express';
import { fileURLToPath } from 'node:url';

export const etapas = { ac1: 1, ac2: 2, ac3: 3, final: 4 };
class Erro extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
function texto(valor, campo, max = 100, obrigatorio = true) {
  if (typeof valor !== 'string') throw new Erro(400, `${campo}: informe um texto.`);
  const t = valor.trim();
  if ((obrigatorio && !t) || t.length > max) throw new Erro(400, `${campo}: preencha com até ${max} caracteres.`);
  return t;
}
function id(valor) {
  if (!/^\d+$/.test(String(valor)) || !Number.isSafeInteger(Number(valor)) || Number(valor) < 1)
    throw new Erro(400, 'Identificador inválido.');
  return Number(valor);
}
function clienteValido(b) {
  const nome = texto(b.nome, 'Nome');
  const telefone = texto(b.telefone, 'Telefone', 25);
  if (!/^[\d\s()+-]+$/.test(telefone) || !/^\d{10,11}$/.test(telefone.replace(/\D/g, '')))
    throw new Erro(400, 'Telefone: informe DDD e número, com 10 ou 11 dígitos.');
  const email = texto(b.email ?? '', 'E-mail', 150, false);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Erro(400, 'E-mail inválido.');
  return [nome, telefone, email];
}
function horarioValido(valor) {
  // Data/hora civil do pet shop, sem conversão para UTC; horário de Brasília.
  if (typeof valor !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:00$/.test(valor))
    throw new Erro(400, 'Escolha data e hora inteira entre 08:00 e 17:00.');
  const [ano, mes, dia, hora] = valor.match(/\d+/g).map(Number);
  const d = new Date(Date.UTC(ano, mes - 1, dia, hora));
  if (ano < 2026 || ano > 2100 || d.getUTCFullYear() !== ano || d.getUTCMonth() !== mes - 1 ||
      d.getUTCDate() !== dia || hora < 8 || hora > 17) throw new Erro(400, 'Data ou horário inválido.');
  // Permite datas passadas para demonstrações acadêmicas e lançamento histórico.
  return valor;
}

export function criarApp(db, etapa = 'final') {
  if (!(etapa in etapas)) throw new Error('Etapa inválida: use ac1, ac2, ac3 ou final.');
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '32kb' }));
  app.use('/api', (req, res, next) => {
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)))
      return res.status(400).json({ erro: 'Envie um objeto JSON válido.' });
    next();
  });
  // Somente o próprio site pode enviar gravações do navegador.
  app.use('/api', (req, res, next) => {
    if (!['GET', 'HEAD'].includes(req.method) && req.headers.origin && req.headers.origin !== `http://${req.headers.host}`)
      return res.status(403).json({ erro: 'Origem não permitida.' });
    next();
  });
  const exige = nivel => (req, res, next) => etapas[etapa] >= nivel ? next() : res.status(403).json({ erro: 'Recurso disponível em uma próxima entrega.' });
  const existe = (tabela, valor) => {
    const n = id(valor);
    if (!db.prepare(`SELECT id FROM ${tabela} WHERE id = ?`).get(n)) throw new Erro(404, 'Registro não encontrado.');
    return n;
  };
  app.get('/api/config', (req, res) => res.json({ etapa, nivel: etapas[etapa] }));
  app.get('/api/clientes', (req, res) => res.json(db.prepare('SELECT * FROM clientes ORDER BY nome, id').all()));
  app.post('/api/clientes', (req, res) => {
    const r = db.prepare('INSERT INTO clientes(nome, telefone, email) VALUES (?, ?, ?)').run(...clienteValido(req.body));
    res.status(201).json({ id: Number(r.lastInsertRowid) });
  });
  app.put('/api/clientes/:id', (req, res) => {
    const n = existe('clientes', req.params.id);
    db.prepare('UPDATE clientes SET nome=?, telefone=?, email=? WHERE id=?').run(...clienteValido(req.body), n);
    res.json({ ok: true });
  });
  app.delete('/api/clientes/:id', (req, res) => {
    db.prepare('DELETE FROM clientes WHERE id=?').run(existe('clientes', req.params.id));
    res.json({ ok: true });
  });

  app.use('/api/pets', exige(2));
  const petValido = b => {
    const cliente = existe('clientes', b.cliente_id);
    const nome = texto(b.nome, 'Nome do pet');
    if (!['Cachorro', 'Gato', 'Outro'].includes(b.especie)) throw new Erro(400, 'Espécie inválida.');
    return [cliente, nome, b.especie, texto(b.raca ?? '', 'Raça', 100, false)];
  };
  app.get('/api/pets', (req, res) => res.json(db.prepare(`SELECT p.*, c.nome AS cliente_nome FROM pets p JOIN clientes c ON c.id=p.cliente_id ORDER BY p.nome, p.id`).all()));
  app.post('/api/pets', (req, res) => {
    const r = db.prepare('INSERT INTO pets(cliente_id, nome, especie, raca) VALUES (?, ?, ?, ?)').run(...petValido(req.body));
    res.status(201).json({ id: Number(r.lastInsertRowid) });
  });
  app.put('/api/pets/:id', (req, res) => {
    const n = existe('pets', req.params.id);
    db.prepare('UPDATE pets SET cliente_id=?, nome=?, especie=?, raca=? WHERE id=?').run(...petValido(req.body), n);
    res.json({ ok: true });
  });
  app.delete('/api/pets/:id', (req, res) => {
    db.prepare('DELETE FROM pets WHERE id=?').run(existe('pets', req.params.id));
    res.json({ ok: true });
  });

  app.use('/api/servicos', exige(3));
  app.use('/api/agendamentos', exige(3));
  app.get('/api/servicos', (req, res) => res.json(db.prepare('SELECT * FROM servicos ORDER BY id').all()));
  app.get('/api/agendamentos', (req, res) => res.json(db.prepare(`SELECT a.*, p.nome AS pet_nome, c.nome AS cliente_nome, s.nome AS servico_nome
    FROM agendamentos a JOIN pets p ON p.id=a.pet_id JOIN clientes c ON c.id=p.cliente_id
    JOIN servicos s ON s.id=a.servico_id ORDER BY a.inicio DESC, a.id DESC`).all()));
  app.post('/api/agendamentos', (req, res) => {
    const pet = existe('pets', req.body.pet_id);
    const servico = existe('servicos', req.body.servico_id);
    const inicio = horarioValido(req.body.inicio);
    const { preco_centavos } = db.prepare('SELECT preco_centavos FROM servicos WHERE id=?').get(servico);
    const r = db.prepare('INSERT INTO agendamentos(pet_id, servico_id, inicio, preco_centavos) VALUES (?, ?, ?, ?)').run(pet, servico, inicio, preco_centavos);
    res.status(201).json({ id: Number(r.lastInsertRowid) });
  });
  app.patch('/api/agendamentos/:id/status', (req, res) => {
    const n = existe('agendamentos', req.params.id);
    const status = req.body.status;
    if (!['Concluído', 'Cancelado'].includes(status)) throw new Erro(400, 'Escolha Concluído ou Cancelado.');
    if (status === 'Concluído' && etapas[etapa] < 4) throw new Erro(403, 'Conclusão disponível na entrega final.');
    const r = db.prepare("UPDATE agendamentos SET status=? WHERE id=? AND status='Agendado'").run(status, n);
    if (!r.changes) throw new Erro(409, 'Somente um agendamento em aberto pode mudar de status.');
    res.json({ ok: true });
  });
  app.get('/api/painel', exige(4), (req, res) => {
    const resumo = db.prepare(`SELECT COUNT(*) AS total,
      COALESCE(SUM(status='Agendado'),0) AS abertos,
      COALESCE(SUM(status='Concluído'),0) AS concluidos,
      COALESCE(SUM(status='Cancelado'),0) AS cancelados,
      COALESCE(SUM(CASE WHEN status='Concluído' THEN preco_centavos ELSE 0 END),0) AS receita_centavos FROM agendamentos`).get();
    const servicos = db.prepare(`SELECT s.nome, COUNT(a.id) AS quantidade,
      COALESCE(SUM(a.preco_centavos),0) AS receita_centavos FROM servicos s
      LEFT JOIN agendamentos a ON a.servico_id=s.id AND a.status='Concluído' GROUP BY s.id ORDER BY s.id`).all();
    res.json({ ...resumo, clientes: db.prepare('SELECT COUNT(*) AS n FROM clientes').get().n,
      pets: db.prepare('SELECT COUNT(*) AS n FROM pets').get().n, servicos });
  });
  app.use('/api', (req, res) => res.status(404).json({ erro: 'Rota não encontrada.' }));
  app.use(express.static(fileURLToPath(new URL('../public', import.meta.url))));
  app.use((err, req, res, next) => {
    if (err.status) return res.status(err.status).json({ erro: err instanceof Erro ? err.message : 'Requisição inválida.' });
    if (err.message?.includes('UNIQUE constraint')) return res.status(409).json({ erro: 'Esse horário já está ocupado. Escolha outra hora ou cancele o agendamento anterior.' });
    if (err.message?.includes('FOREIGN KEY constraint')) return res.status(409).json({ erro: 'Este cadastro possui vínculos. Remova os pets antes do cliente. Pets com histórico de agenda devem ser preservados.' });
    console.error(err);
    res.status(500).json({ erro: 'Não foi possível concluir. Consulte o terminal.' });
  });
  return app;
}
