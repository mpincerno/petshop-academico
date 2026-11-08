import { fileURLToPath } from 'node:url';
import { abrirBanco } from './database.js';
import { criarApp, etapas } from './app.js';

const etapa = process.argv.find(a => a.startsWith('--etapa='))?.split('=')[1] ?? 'final';
if (!(etapa in etapas)) throw new Error('Use --etapa=ac1, ac2, ac3 ou final.');
const arquivo = fileURLToPath(new URL(`../data/petshop-${etapa}.sqlite`, import.meta.url));
const db = abrirBanco(arquivo);
const port = Number(process.env.PORT || 3000);
const servidor = criarApp(db, etapa).listen(port, '127.0.0.1', () => {
  console.log(`PetShop | ${etapa.toUpperCase()} | http://127.0.0.1:${port}`);
  console.log(`Banco: ${arquivo}\nPara encerrar: Ctrl+C`);
});
servidor.on('error', e => {
  console.error(e.code === 'EADDRINUSE' ? 'A porta está ocupada. Encerre o servidor anterior com Ctrl+C.' : e.message);
  db.close(); process.exitCode = 1;
});
for (const sinal of ['SIGINT', 'SIGTERM']) process.on(sinal, () => servidor.close(() => { db.close(); process.exit(0); }));
