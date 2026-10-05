// Braresults — tarefa em segundo plano (Capacitor Background Runner).
// Consulta o TSE para os favoritos, guarda pontos da linha do tempo e envia notificações.
var BASE = 'https://resultados.tse.jus.br/oficial/ele2026';
var ELE = { 1: { f: '6257', e: '6259' }, 2: { f: '6258', e: '6260' } };
var CG = { presidente: '1', governador: '3', senador: '5', 'deputado-federal': '6', 'deputado-estadual': '7' };
var NOME = { presidente: 'Presidente', governador: 'Governador', senador: 'Senador', 'deputado-federal': 'Dep. Federal', 'deputado-estadual': 'Dep. Estadual' };
var T2AB = Date.parse('2026-10-25T08:00:00-03:00');
var RE2 = /2[ºo°]\s*turno|segundo turno/i;

function num(v) { var x = +String(v == null ? '' : v).replace(',', '.'); return isFinite(x) ? x : 0; }
function pc(v) { return v.toFixed(2).replace('.', ',') + '%'; }
async function kvGet(k, d) { try { var r = await CapacitorKV.get(k); var v = r && r.value !== undefined ? r.value : r; return v ? JSON.parse(v) : d; } catch (e) { return d; } }
async function kvSet(k, v) { try { await CapacitorKV.set(k, JSON.stringify(v)); } catch (e) {} }
function notify(title, body, extra) {
  try { CapacitorNotifications.schedule([{ id: Math.floor(Math.random() * 2000000000), title: title, body: body, scheduleAt: new Date(Date.now() + 1500), extra: extra || null }]); } catch (e) {}
}

function norm(raw, f, t, ele) {
  var cg = (raw.carg || [])[0] || {}, cs = [];
  (cg.agr || []).forEach(function (a) { (a.par || []).forEach(function (p) { (p.cand || []).forEach(function (c) {
    cs.push({ id: c.sqcand, nome: c.nmu || c.nm, partido: p.sg, votos: num(c.vap), pct: num(c.pvapn != null ? c.pvapn : c.pvap), eleito: c.e === 's', sit: c.st || '' });
  }); }); });
  cs.sort(function (a, b) { return b.votos - a.votos || a.nome.localeCompare(b.nome); });
  var s = raw.s || {}, e = raw.e || {}, v = raw.v || {};
  return {
    cargo: f.cargo, turno: t, nome: NOME[f.cargo], esc: { t: f.mun ? 'mun' : f.uf ? 'uf' : 'br', nome: f.label || '' },
    tse: ((raw.dt || raw.dg || '') + ' ' + (raw.ht || raw.hg || '')).trim(), vagas: num(cg.nv) || 1,
    st: num(s.ts), sz: num(s.st), sp: num(s.pstn != null ? s.pstn : s.pst), el: num(e.te), cp: num(e.c), cpp: num(e.pcn != null ? e.pcn : e.pc),
    ab: num(e.a), abp: num(e.pan != null ? e.pan : e.pa), va: num(v.vv), br: num(v.vb), brp: num(v.pvbn != null ? v.pvbn : v.pvb),
    nu: num(v.tvn), nup: num(v.ptvnn != null ? v.ptvnn : v.ptvn), c: cs
  };
}
async function fetchRes(f, t) {
  var ele = f.cargo === 'presidente' ? ELE[t].f : ELE[t].e, cd = CG[f.cargo];
  if (f.cargo === 'deputado-estadual' && f.uf === 'df') cd = '8';
  var p = ele + '/dados/' + (f.uf || 'br') + '/' + (f.uf ? f.uf + (f.mun ? ('00000' + f.mun).slice(-5) : '') : 'br') + '-c' + ('000' + cd).slice(-4) + '-e' + ('000000' + ele).slice(-6) + '-u.json';
  var res = await fetch(BASE + '/' + p);
  if (!res.ok) throw new Error('http ' + res.status);
  return norm(await res.json(), f, t, ele);
}

// Situação do candidato: 'e' eleito, '2' vai ao 2º turno. No 1º turno de presidente/governador
// o TSE marca os dois do 2º turno com a flag "eleito": só vale quem passou de 50% dos válidos.
function stc(r, c, rk) {
  if (RE2.test(c.sit || '')) return '2';
  if (!(c.eleito || /^eleito/i.test(c.sit || ''))) return '';
  if (!((r.cargo === 'presidente' || r.cargo === 'governador') && r.turno === 1)) return 'e';
  if (c.pct > 50) return 'e';
  return (rk == null ? r.c.indexOf(c) : rk) < 2 ? '2' : '';
}
function ver(r) {
  var c0 = r.c[0], c1 = r.c[1], c2 = r.c[2], dec = r.cargo === 'presidente' ? r.esc.t === 'br' : r.esc.t === 'uf';
  if (!dec) return { k: 'local' };
  var el = r.c.filter(function (c) { return stc(r, c) === 'e'; });
  if (r.cargo.indexOf('deputado') === 0) return { k: 'disp' };
  if (el.length) return { k: 'eleito', of: 1, e: el };
  var fin = r.c.filter(function (c) { return stc(r, c) === '2'; });
  if (fin.length) return { k: '2t', of: 1, f: fin };
  if (!c0 || r.sp < 60 || r.va <= 0) return { k: 'disp' };
  var rest = r.sp >= 100 ? 0 : r.va * ((100 - r.sp) / r.sp) * 1.2;
  if ((r.cargo === 'presidente' || r.cargo === 'governador') && r.turno === 1) {
    if (c0.votos > 0.5 * (r.va + rest)) return { k: 'eleito', e: [c0] };
    if (c1 && c0.votos + rest < 0.5 * (r.va + rest) && c1.votos > (c2 ? c2.votos : 0) + rest) return { k: '2t', f: [c0, c1] };
    return { k: 'disp' };
  }
  var k = Math.max(1, r.vagas), u = r.c[k - 1];
  if (u && u.votos > (r.c[k] ? r.c[k].votos : 0) + rest / k) return { k: 'eleito', e: r.c.slice(0, k) };
  return { k: 'disp' };
}
function evs(r, st) {
  var c0 = r.c[0];
  if (!c0) return { m: [], ns: st || { lead: '', vk: 'x', ms: 0 } };
  var v = ver(r), lead = c0.id, vk = v.of && v.k === 'eleito' ? 'e' + v.e.map(function (x) { return x.id; }).join() : v.of && v.k === '2t' ? '2t' : 'x';
  var ms = [100, 90, 75, 50, 25].find(function (x) { return r.sp >= x; }) || 0, m = [], nm = r.nome + ' · ' + r.esc.nome;
  if (st) {
    if (vk !== st.vk && vk !== 'x') {
      m.push(v.k === 'eleito'
        ? '✔ ' + nm + ': ' + v.e.map(function (c) { return c.nome; }).join(' e ') + (v.e.length > 1 ? ' eleitos' : ' eleito(a)')
        : '⚑ ' + nm + ': vai ao 2º turno — ' + v.f.map(function (c) { return c.nome; }).join(' × '));
    } else if (st.lead && lead !== st.lead && r.cargo.indexOf('deputado') !== 0) {
      m.push('🔄 ' + nm + ': ' + c0.nome + ' assumiu a liderança');
    }
    if (!m.length && ms > st.ms) m.push('📊 ' + nm + ': ' + ms + '% apurado — ' + c0.nome + ' lidera com ' + pc(c0.pct));
  }
  return { m: m, ns: { lead: lead, vk: vk, ms: ms } };
}
function quiet(q, d) {
  if (!q) return false;
  var p = String(q).split('-'), a = +p[0], b = +p[1], h = (d || new Date()).getHours();
  if (isNaN(a) || isNaN(b) || a === b) return false;
  return a > b ? (h >= a || h < b) : (h >= a && h < b);
}
function snapOf(r) {
  var a = r.tse.split(' '), d = (a[0] || '').split('/');
  return {
    t: r.tse, ts: Date.parse(d[2] + '-' + d[1] + '-' + d[0] + 'T' + (a[1] || '00:00:00') + '-03:00') || 0,
    sp: r.sp, st: r.st, sz: r.sz, el: r.el, cp: r.cp, cpp: r.cpp, ab: r.ab, abp: r.abp, va: r.va, br: r.br, brp: r.brp, nu: r.nu, nup: r.nup,
    c: r.c.slice(0, 15).map(function (c) { return [c.id, c.votos, c.pct, c.eleito ? 1 : 0, c.sit]; })
  };
}

async function check() {
  var cfg = await kvGet('cfg', null);
  if (!cfg || !cfg.on || !cfg.favs || !cfg.favs.length) return;
  if (cfg.ele) ELE = cfg.ele;
  var snaps = await kvGet('snaps', []), now2 = Date.now() >= T2AB;
  var fg = !!cfg.fg && Date.now() - cfg.fg < 150000, qt = quiet(cfg.qh), pend = await kvGet('pend', []), pchg = false;
  if (!qt && !fg && pend.length) {
    notify('Braresults', 'Durante o horário silencioso:\n' + pend.slice(-4).map(function (p) { return p.m; }).join('\n'), pend[pend.length - 1].x);
    pend = []; pchg = true;
  }
  for (var i = 0; i < cfg.favs.length; i++) {
    var f = cfg.favs[i], t = now2 && (f.cargo === 'presidente' || f.cargo === 'governador') ? 2 : 1;
    try {
      var r = await fetchRes(f, t), k = [f.cargo, f.regiao, f.uf, f.mun, t].join('|');
      var ult = await kvGet('ult:' + k, '');
      if (ult !== r.tse) { snaps.push({ k: k, s: snapOf(r) }); await kvSet('ult:' + k, r.tse); }
      var o = evs(r, await kvGet('st:' + k, null));
      await kvSet('st:' + k, o.ns);
      if (o.m.length && !fg) {
        var ex = { cargo: f.cargo, regiao: f.regiao || '', uf: f.uf || '', mun: f.mun || '' };
        if (qt) { pend.push({ m: o.m.join('\n'), x: ex }); pchg = true; } else notify('Braresults', o.m.join('\n'), ex);
      }
    } catch (e) {}
  }
  await kvSet('snaps', snaps.slice(-300));
  if (pchg) await kvSet('pend', pend.slice(-20));
}

addEventListener('check', async function (resolve) { try { await check(); } catch (e) {} resolve(); });
addEventListener('config', async function (resolve, reject, args) { await kvSet('cfg', args || {}); resolve({ ok: true }); });
addEventListener('drain', async function (resolve) { var s = await kvGet('snaps', []); await kvSet('snaps', []); resolve({ snaps: s }); });
addEventListener('notify', async function (resolve, reject, args) { notify((args && args.title) || 'Braresults', (args && args.body) || ''); resolve({ ok: true }); });
