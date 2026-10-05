/* Braresults — dados do jogo de luta: 20 armas (3 poderes cada) e 25 acessórios.
 Poder = [nome, tipo, dano/valor, recarga(s), extra, atordoar/lentidão(s)]
 Tipos: P projétil(extra=veloc.) Z projétil gelo(lentidão) M rajada x3 A área(extra=raio) D investida H cura S escudo(extra=duração) B velocidade(valor=%, extra=duração) */
window.FD={W:[
['⚔️','Espada',1.1,['Giro','A',14,6,90],['Onda de Aço','P',12,5,560],['Investida','D',16,8]],
['🪓','Machado',1.25,['Golpe Brutal','A',20,9,80],['Machado Voador','P',16,7,480],['Fúria','B',30,12,4]],
['🔨','Martelo',1.15,['Marretada','A',15,8,90,.9],['Tremor','P',10,6,400,.6],['Impacto','D',18,10,0,.7]],
['🗡️','Adaga',.9,['Facada Dupla','D',12,5],['Facas','M',5,6],['Sombra','B',45,10,3]],
['🏹','Arco',.85,['Flecha','P',13,4,700],['Chuva','M',6,9],['Flecha Gelada','Z',9,9,600,2]],
['🪄','Cajado',.8,['Bola de Fogo','P',17,7,450],['Cura','H',18,12],['Raio','P',11,4,800,.4]],
['🛡️','Escudo',.9,['Muralha','S',25,10,4],['Bater','A',10,6,70,.8],['Contra-ataque','D',12,9,0,.5]],
['🔱','Tridente',1.05,['Perfurar','P',14,5,650],['Maré','A',12,8,110,.5],['Arremesso','P',18,9,500]],
['⛏️','Picareta',1.1,['Escavar','D',14,7,0,.4],['Pedregulho','P',15,6,420],['Terremoto','A',16,10,120,.6]],
['🏏','Taco',1.15,['Home Run','P',15,7,600,.3],['Rebater','A',13,6,80],['Rolada','D',10,4]],
['🔫','Pistola',.8,['Tiro','P',11,3,900],['Rajada','M',5,7],['Recarga','B',35,10,3]],
['💣','Bomba',1,['Explosão','A',19,9,100],['Bomba Lançada','P',16,7,380],['Salto Explosivo','D',13,8]],
['🔥','Chamas',.8,['Jato','M',4,5],['Labareda','P',13,5,500],['Inferno','A',22,12,130]],
['❄️','Gelo',.8,['Estaca','Z',11,5,600,2],['Nevasca','A',9,8,120,1.2],['Armadura Gelo','S',20,10,4]],
['⚡','Raio',.8,['Faísca','P',9,3,900,.3],['Trovão','A',17,9,100,.7],['Teleporte','D',12,7]],
['🥷','Katana',1,['Iaijutsu','D',20,9],['Shuriken','M',5,5],['Esquiva','B',40,9,3]],
['🎸','Guitarra',.9,['Acorde','A',11,6,110,.6],['Onda Sonora','P',12,5,600,.4],['Solo','B',30,11,5]],
['📚','Livro',.8,['Sabedoria','H',15,10],['Palestra','A',10,7,130,1],['Bola de Papel','P',9,3,700]],
['🥊','Luvas',1.3,['Direto','D',17,6],['Combo','A',15,7,70],['Nocaute','A',24,13,75,1]],
['👑','Cetro Real',1,['Decreto','P',18,7,560,.5],['Guarda Real','S',22,11,4],['Tributo','H',14,8]]
],A:[
['🧢','Boné Veloz',{spd:.15}],['👟','Tênis Mola',{jmp:.2}],['🕶️','Óculos Escuros',{dmg:.08}],['🧣','Cachecol',{def:.08}],
['⌚','Relógio',{cdr:.15}],['🩸','Colar Vampiro',{ls:.08}],['💍','Anel Vital',{hp:10}],['🎒','Mochila',{reg:.8}],
['🧤','Luvas de Couro',{acd:.15}],['👢','Botas Pesadas',{kbr:.4}],['🎩','Cartola',{dmg:.05,cdr:.05}],['📿','Terço',{def:.05,reg:.4}],
['🔔','Sino do Dash',{dcd:.3}],['🪖','Capacete',{def:.12,spd:-.05}],['🥇','Medalha',{dmg:.12,def:-.06}],['🧲','Ímã de Poder',{pdm:.15}],
['🪽','Asas',{jmp:.35,spd:.05}],['🧿','Amuleto',{kbr:.3,def:.05}],['🎧','Fone',{cdr:.1,spd:.05}],['🧴','Remédio',{reg:1.2,spd:-.05}],
['💎','Joia Rara',{dmg:.06,def:.06,cdr:.06}],['🦺','Colete',{def:.15,spd:-.08}],['🧨','Pavio Curto',{cdr:.2,def:-.08}],['🍀','Trevo',{crit:.15}],['☕','Café',{spd:.1,dcd:.15}]
],L:{spd:'% velocidade',jmp:'% pulo',dmg:'% dano',def:'% defesa',cdr:'% recarga rápida',ls:'% roubo de vida',hp:' vida',reg:' vida/s',acd:'% soco rápido',kbr:'% resist. empurrão',dcd:'% dash rápido',pdm:'% dano de poderes',crit:'% crítico'},
T:{P:'Projétil',Z:'Projétil gelo',M:'Rajada x3',A:'Área',D:'Investida',H:'Cura',S:'Escudo',B:'Velocidade'}};
FD.desc=s=>Object.keys(s).map(k=>(s[k]>0?'+':'−')+(/^(hp|reg)$/.test(k)?Math.abs(s[k]):Math.round(Math.abs(s[k])*100))+FD.L[k]).join(', ');
/* Mapas: [emoji, nome, céu1, céu2, chão, plataforma, decoração, plataformas[x,largura,y]] */
FD.M=[
['🏛️','Praça Central','#6ab8ff','#d6f0ff','#3f7d4a','#8a6a44',0,[[120,140,305],[540,140,305]]],
['🌃','Capital à Noite','#0c1030','#2a2f6a','#232842','#5a628f',1,[[330,140,295]]],
['🌋','Vulcão','#2a0c0c','#8a2a10','#2d1612','#7a3a22',2,[[100,120,310],[580,120,310],[340,110,240]]],
['🧊','Geleira','#9fd8ff','#e8f6ff','#8fb8d4','#cfeaff',3,[[200,110,305],[490,110,305],[345,100,235]]],
['💜','Arena Neon','#12002a','#3a0a5a','#1a0a30','#00e5ff',4,[[60,130,305],[610,130,305],[335,150,245]]]
];
