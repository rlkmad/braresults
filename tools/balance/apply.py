"""Gera www/fight-data.js a partir de fight-data.orig.js + balance.json.
balance.json: {HPB, UL3, wm:[20], dm:[20], po:{"arma.poder":{d,cd,e,s}}, ac:{"hp":x,"reg":x}}
 - d dos poderes (tipos P Z M A D H S) = original * HPB/100 * wm[arma]  (tipo B = % e nao muda)
 - po[...] sobrescreve valores finais (d, cd, e, s) de um poder especifico."""
import re, json, sys, os
HERE = os.path.dirname(os.path.abspath(__file__))
B = json.load(open(os.path.join(HERE, 'balance.json')))
src = open(os.path.join(HERE, 'fight-data.orig.js'), encoding='utf8').read()
HS = B['HPB'] / 100
def num(v):
    v = round(v * 2) / 2 if v < 20 else round(v)
    return str(int(v)) if v == int(v) else str(v)
rowre = re.compile(r"^\['([^']+)','([^']+)',([\d.]+),(.*)\],?$")
powre = re.compile(r"\['([^']+)','([A-Z])',([\d.]+),([\d.]+),([\d.]+),([\d.]+),'(\w+)'\]")
out, wi = [], -1
for ln in src.split('\n'):
    m = rowre.match(ln)
    if m and powre.search(ln):
        wi += 1; wm = B['wm'][wi]; pj = [-1]
        def fp(pm):
            pj[0] += 1
            nm, tp, d, cd, e, s, pid = pm.groups()
            d = float(d); cd = float(cd); e = float(e); s = float(s)
            if tp != 'B': d = d * HS * wm
            o = B.get('po', {}).get(f'{wi}.{pj[0]}', {})
            d = o.get('d', d); cd = o.get('cd', cd); e = o.get('e', e); s = o.get('s', s)
            dv = num(d) if tp != 'B' else (str(int(d)) if d == int(d) else str(d))
            return f"['{nm}','{tp}',{dv},{cd:g},{e:g},{s:g},'{pid}']"
        body = powre.sub(fp, ln)
        # arma: multiplicador de ataque basico
        mm = rowre.match(body)
        a = float(mm.group(3)) * wm if 'a' not in B.get('mel', {}) else 0
        a = B.get('mel', {}).get(str(wi), a)
        body = re.sub(r"^\['([^']+)','([^']+)',[\d.]+,", lambda q: f"['{q.group(1)}','{q.group(2)}',{round(a,2):g},", body)
        out.append(body)
    else:
        out.append(ln)
t = '\n'.join(out)
t = re.sub(r"window\.FD=\{W:\[", f"window.FD={{HPB:{B['HPB']},UL3:{B['UL3']},DM:{json.dumps(B['dm'],separators=(',',':'))},CM:{json.dumps(B.get('cm',{}),separators=(',',':'))},W:[", t, 1)
# acessorios: hp e reg escalam com a vida base
t = re.sub(r"hp:(\d+)\}", lambda q: f"hp:{round(int(q.group(1))*HS*B.get('ac',{}).get('hp',1))}}}", t)
t = re.sub(r"reg:([\d.]+)", lambda q: f"reg:{round(float(q.group(1))*HS*B.get('ac',{}).get('reg',1),1):g}", t)
open(os.path.join(HERE, '..', '..', 'www', 'fight-data.js'), 'w', encoding='utf8').write(t)
print('ok wi=', wi + 1)
