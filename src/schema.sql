PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS clientes (
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS pets (
  id INTEGER PRIMARY KEY,
  cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
  nome TEXT NOT NULL,
  especie TEXT NOT NULL CHECK(especie IN ('Cachorro', 'Gato', 'Outro')),
  raca TEXT NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS servicos (
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  preco_centavos INTEGER NOT NULL CHECK(preco_centavos >= 0)
);
CREATE TABLE IF NOT EXISTS agendamentos (
  id INTEGER PRIMARY KEY,
  pet_id INTEGER NOT NULL REFERENCES pets(id) ON DELETE RESTRICT,
  servico_id INTEGER NOT NULL REFERENCES servicos(id) ON DELETE RESTRICT,
  inicio TEXT NOT NULL,
  preco_centavos INTEGER NOT NULL CHECK(preco_centavos >= 0),
  status TEXT NOT NULL DEFAULT 'Agendado' CHECK(status IN ('Agendado', 'Concluído', 'Cancelado'))
);
-- Uma estação de atendimento: todos os serviços ocupam uma hora inteira.
CREATE UNIQUE INDEX IF NOT EXISTS horario_ocupado
ON agendamentos(inicio) WHERE status <> 'Cancelado';
INSERT OR IGNORE INTO servicos VALUES (1, 'Banho', 5000), (2, 'Tosa', 7000), (3, 'Banho e tosa', 10000);
