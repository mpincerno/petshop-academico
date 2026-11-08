import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { abrirBanco } from '../src/database.js';
import { criarApp } from '../src/app.js';

async function ambiente(t, etapa = 'final', arquivo = ':memory:') {
  const db = abrirBanco(arquivo);
  const servidor = criarApp(db, etapa).listen(0, '127.0.0.1');
  await once(servidor, 'listening');
  t.after(async () => { await new Promise(resolve => servidor.close(resolve)); db.close(); });
  const base = 'http://127.0.0.1:' + servidor.address().port;
  const request = async (rota, method = 'GET', dados) => {
    const r = await fetch(base + '/api/' + rota, { method, headers: dados === undefined ? {} : { 'content-type': 'application/json' }, body: dados === undefined ? undefined : JSON.stringify(dados) });
    return { status: r.status, body: await r.json() };
  };
  return { db, request, base };
}
const cliente = { nome: 'Ana Teste', telefone: '(11) 99999-1234', email: 'ana@example.com' };

test('fluxo completo: vínculos, conflito, cancelamento, conclusão e receita', async t => {
  const { request: r, base } = await ambiente(t);
  assert.equal((await fetch(base)).status, 200);
  assert.equal((await r('painel')).body.receita_centavos, 0);
  assert.equal((await r('clientes','POST',{...cliente,nome:'  '})).status,400);
  assert.equal((await r('clientes','POST',{...cliente,telefone:'123'})).status,400);
  assert.equal((await r('clientes','POST',{...cliente,email:'inválido'})).status,400);
  const c = (await r('clientes','POST',cliente)).body.id;
  assert.equal((await r('clientes/' + c,'PUT',{...cliente,nome:'Ana Silva'})).status,200);
  assert.equal((await r('clientes')).body[0].nome,'Ana Silva');
  assert.equal((await r('pets','POST',{cliente_id:999,nome:'Luna',especie:'Gato'})).status,404);
  const p = (await r('pets','POST',{cliente_id:c,nome:'Luna',especie:'Gato',raca:'SRD'})).body.id;
  assert.equal((await r('clientes/' + c,'DELETE')).status,409);
  assert.equal((await r('pets/' + p,'PUT',{cliente_id:c,nome:'Luna Maria',especie:'Gato'})).status,200);
  assert.equal((await r('pets')).body[0].cliente_nome,'Ana Silva');
  const agenda = {pet_id:p,servico_id:1,inicio:'2026-11-08T09:00'};
  for (const inicio of ['2026-02-30T09:00','2026-11-08T09:30','2026-11-08T18:00']) {
    assert.equal((await r('agendamentos','POST',{...agenda,inicio})).status,400);
  }
  const a = (await r('agendamentos','POST',agenda)).body.id;
  assert.equal((await r('agendamentos','POST',agenda)).status,409);
  assert.equal((await r('pets/' + p,'DELETE')).status,409);
  assert.equal((await r('agendamentos/' + a + '/status','PATCH',{status:'Cancelado'})).status,200);
  const b = (await r('agendamentos','POST',agenda)).body.id;
  assert.equal((await r('agendamentos/' + b + '/status','PATCH',{status:'Concluído'})).status,200);
  assert.equal((await r('agendamentos/' + b + '/status','PATCH',{status:'Cancelado'})).status,409);
  assert.equal((await r('agendamentos/' + a + '/status','PATCH',{status:'Concluído'})).status,409);
  const painel = (await r('painel')).body;
  assert.equal(painel.receita_centavos,5000);
  assert.equal(painel.cancelados,1);
  assert.equal(painel.concluidos,1);
  assert.equal(painel.abertos,0);
  assert.equal(painel.servicos[0].quantidade,1);
  assert.equal((await r('agendamentos','POST',agenda)).status,409);
  assert.equal((await r('clientes/abc','DELETE')).status,400);
  assert.equal((await r('clientes/9999','DELETE')).status,404);
  assert.equal((await r('clientes','POST')).status,400);
  assert.equal((await r('clientes','POST',[])).status,400);
  const origin = await fetch(base+'/api/clientes',{method:'POST',headers:{origin:'https://exemplo.invalid','content-type':'application/json'},body:JSON.stringify(cliente)});
  assert.equal(origin.status,403);
  const invalido = await fetch(base+'/api/clientes',{method:'POST',headers:{'content-type':'application/json'},body:'{'});
  assert.equal(invalido.status,400);
});

test('exclusão funciona para cadastros sem vínculos',async t => {
  const {request:r}=await ambiente(t);
  const c=(await r('clientes','POST',cliente)).body.id;
  const p=(await r('pets','POST',{cliente_id:c,nome:'Bob',especie:'Cachorro'})).body.id;
  assert.equal((await r('pets/'+p,'DELETE')).status,200);
  assert.equal((await r('clientes/'+c,'DELETE')).status,200);
  assert.deepEqual((await r('clientes')).body,[]);
});

for (const [etapa,nivel] of [['ac1',1],['ac2',2],['ac3',3],['final',4]]) {
  test('recursos disponíveis na etapa '+etapa,async t=>{
    const {request:r}=await ambiente(t,etapa);
    assert.equal((await r('config')).body.nivel,nivel);
    assert.equal((await r('clientes')).status,200);
    assert.equal((await r('pets')).status,nivel>=2?200:403);
    assert.equal((await r('agendamentos')).status,nivel>=3?200:403);
    assert.equal((await r('painel')).status,nivel>=4?200:403);
    if(nivel===3){
      const c=(await r('clientes','POST',cliente)).body.id;
      const p=(await r('pets','POST',{cliente_id:c,nome:'Bob',especie:'Cachorro'})).body.id;
      const a=(await r('agendamentos','POST',{pet_id:p,servico_id:2,inicio:'2026-11-08T10:00'})).body.id;
      assert.equal((await r('agendamentos/'+a+'/status','PATCH',{status:'Concluído'})).status,403);
      assert.equal((await r('agendamentos/'+a+'/status','PATCH',{status:'Cancelado'})).status,200);
    }
  });
}
test('SQLite conserva os dados depois de fechar e reabrir',()=>{
  const pasta=mkdtempSync(join(tmpdir(),'petshop-test-'));
  try{
    const arquivo=join(pasta,'teste.sqlite');
    let db=abrirBanco(arquivo);
    db.prepare('INSERT INTO clientes(nome,telefone,email) VALUES (?,?,?)').run(cliente.nome,cliente.telefone,cliente.email);
    db.close();
    db=abrirBanco(arquivo);
    assert.equal(db.prepare('SELECT nome FROM clientes').get().nome,cliente.nome);
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM servicos').get().n,3);
    db.close();
  }finally{rmSync(pasta,{recursive:true,force:true});}
});
