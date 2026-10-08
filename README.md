# Braresults — apuração das Eleições 2026

App Android (Capacitor). A interface fica em `www/` (HTML/CSS/JS puro) e busca os dados direto do TSE pelo HTTP nativo (sem CORS). Não usa nenhum servidor próprio.

## v1.9.33 - Parte B2b: invocacoes (cao, caveira, espirito) desenhadas
O bloco 'invocar' das criacoes (custom.js) usa SUMD.cao/caveira/espirito no lugar de emoji; tiro, dano e duracao inalterados.

## v1.9.32 - Parte B4 (lote 3): bola de beisebol, estrela ninja, nota musical, papel e decreto desenhados
btRico, ktStar, gtWave, bkPaper e crDecree agora usam dr:'nome' + DRW + EMC (hitbox, dano e efeitos inalterados).

## v1.9.31 - Parte B4 (lote 2): fogo, bola de fogo e pedra desenhados
- Bola de fogo em chamas (stFire), meteoro com cauda (flBall) e pedra irregular que gira (pkRock) deixaram de ser emoji. Brilho reduzido nos três. Dano, trajetória, explosão, fogo no chão e hitbox inalterados. Desenhos em DRW.stFire, DRW.flBall e DRW.pkRock (fight.js).

## v1.9.30 - Parte B4 (lote 1): meia-lua, machado e adagas desenhados
- Meia-lua de aço (swWave) com listras de velocidade, Machado bumerangue (axBoom, gira como antes) e Leque de adagas (dgFan, agora apontadas na direção do voo em vez de girar) deixaram de ser emoji. Brilho reduzido nesses três para o desenho aparecer. Dano, velocidade e hitbox inalterados. Desenhos em DRW.swWave, DRW.axBoom e DRW.dgFan (fight.js).

## v1.9.29 - Parte B3: bomba e mina desenhadas
- Granada (bmGren): bomba preta com brilho, tampa e pavio que vai queimando com faísca; pisca em vermelho no fim do pavio. Mina (bmMine): disco blindado com rebites e luz de LED (âmbar armando, vermelha piscando armada) e bip a cada piscada (novo som sintetizado 'bip' em sfx.js). Lógica, dano, pavio e hitbox inalterados. Desenhos em DRW.bmGren e DRW.bmMine (fight.js).

## v1.9.28 - Parte B2: Guarda Real desenhado (Chamado/crGuard)
- O guarda deixou de ser o emoji: agora é um boneco desenhado em canvas (chapéu alto preto, casaco vermelho com faixa branca, calça escura, fuzil com baioneta), com respiração leve, entrada/saída suaves, recuo e clarão ao atirar, virado para o alvo. Cada tiro toca swing_gun. Tiro, cadência e hitbox inalterados. Desenho em DRW.crGuard (fight.js).

## v1.9.27 - Parte B1: onda d'água desenhada (Tridente)
- Projétil Maré (trTide) agora é desenhado em canvas (crista curva, espuma, gotas, gradiente azul) no lugar do emoji; hitbox inalterada. Novo mapa DRW em fight.js (dr:'nome' no shot2). A onda das criações (custom.js) usa o mesmo desenho.

## v1.9.26 - Símbolos simples também viram ícones
- `icons.js` ganhou 15 ícones para os símbolos de texto: ← → ▶ ◀ ✔ ✖ ✕ ↺ ↻ ● ⬤ ★ ☆ ⚑ ⌖ ▢ ☐ ☑ (voltar, avançar, play, check, fechar, desfazer, refazer, pontos pequeno/grande, estrela cheia/vazia, bandeira, mira, caixas).
- Em atributos (placeholder, title) só os emojis são removidos; os símbolos ficam.
- Textos desenhados no canvas (ex.: "★ 0" sobre a cabeça) continuam como estão.

## v1.9.25 - Ícones próprios (sem emojis nos botões)
- Novo `www/icons.js`: ~70 ícones SVG desenhados à mão (traço, cor do texto) trocam automaticamente os emojis de botões, menus, abas e textos da interface (luta, Treinamento, Minhas criações, Biblioteca e app). Funciona também em telas criadas depois (MutationObserver). Placeholders e títulos perdem o emoji. API: `IC.i('nome')`.
- Emojis fora da lista (ex.: ícone escolhido pelo usuário em uma criação) ficam como estão.
- Canvas: removidos emojis de textos ("DESPERTAR PRONTO", avisos do treino, "Teste"); miniatura de som desenha alto-falante.
- Ainda emoji (Parte B, próximo passo): poderes/projéteis no canvas, guarda real, status sobre a cabeça.

## v1.9.24 - Mira em seta
- O indicador de mira agora é só uma seta pequena ao lado da cabeça do personagem, apontando na direção da mira (branca; vermelha quando o inimigo está na linha de tiro). Sem linha, círculo ou números.

## v1.9.23 - Mira minimalista e mais precisa
- Indicador novo: só uma linha pontilhada que some com a distância (sem círculo, cruz nem graus). Fica sólida e vermelha, com um anel no inimigo, quando a mira está no alvo.
- Ímã no alvo: mirando manualmente, o ângulo trava no inimigo quando passa a ~6 graus dele (opção "Mira: ímã no alvo" em Opções, ligada por padrão).
- Mira suave: o ângulo começa de onde a mira automática estava e acompanha o joystick sem pulos.

## v1.9.22 - Menu principal se adapta à tela
- O menu agora mede o espaço real disponível (em px CSS, que já leva em conta a densidade/dpi do aparelho) e reduz o conteúdo (até 45%) para caber inteiro, sem cortar o título nem o botão "Voltar ao app". Reajusta ao girar a tela ou mudar o tamanho.

## v1.9.21 - Treinamento (etapa c): ferramentas
- Novos botões (só ícones): ⚡ recarga zerada (poderes, dash e despertar), 🐢 velocidade 1×/½×/¼×, ✨ ativar despertar agora, 🎬 disparar a finalização escolhida no boneco, ▢ mostrar caixas de colisão dos lutadores.
- Números de dano sobre os lutadores e contador "dano · dps · maior golpe" (você no boneco; DPS dos últimos 3 s); ↺ zera o contador.

## v1.9.20 - Treinamento (etapa b): catálogo
- Botão 📖 no treino abre o catálogo (painel compacto, só ícones) para trocar na hora, em você ou no boneco: candidato (lista do TSE já carregada), arma, acessório, poder 1/2/3 (qualquer poder de qualquer arma), finalização e despertar (inclui importados e da biblioteca). Tem busca e pré-carrega o sprite antes de trocar.
- Botões do treino menores (só ícones); o texto "TREINO · boneco ... · imortal" mostra o estado.

## v1.9.19 - Treinamento (etapa a)
- Botão "🏋 Treinamento" no menu: escolhe lutador, arma e acessório e entra no Dojo de Treinamento (mapa próprio, só no treino; não aparece na lista de mapas).
- Sem placar, sem fim de rodada e sem derrota. Boneco de teste no lugar do adversário: Parado, Andando, Atacando ou Bloqueando; Imortal (vida volta sozinha) ou Vida normal (revive em ~1,2 s); botão Reviver/resetar.

## v1.9.18 - HUD nítido
- Nome, vida e barra de despertar agora são desenhados em um canvas separado, na resolução real da tela (até 2x), em vez de esticados do canvas do jogo.
- "ROUND · vitórias × vitórias · tempo" saiu do centro e foi para o canto esquerdo, ao lado dos botões Sair e Pause (texto HTML nítido).

## v1.9.17 - Tela de carregar com o visual do menu
- Mesmo fundo (bandeira, holofote, ringue), luvas e título "LUTA / DE CANDIDATOS" do menu; fotos com VS, barra, etapa, dica e bolinha de porcentagem.

## v1.9.16 - Tela de carregar de verdade
- Carrega antes da luta: fotos dos lutadores, sprites de arma e acessório (inclusive os do inimigo, sorteados já na carga), brilhos e um quadro de aquecimento do canvas. Sem esperas falsas.
- Progresso real (tarefas concluídas / total), nome da etapa, bolinha de porcentagem no canto inferior, fotos com VS e dicas que trocam.
- Cada tarefa tem limite de tempo; se uma imagem falhar, a luta segue sem ela.

## v1.9.15 - Tela cortada no jogo girado
- As unidades vh do menu/carregar mediam o lado errado da tela quando o jogo gira (retrato); agora usam a altura real do contêiner (--v).
- Margens de área segura (entalhe/barras) no menu, mapeadas para o lado certo após o giro.
- Botões do menu compactos em telas baixas; tentativa de tela cheia durante o jogo.

## v1.9.14 - Barra de progresso real no download
- Ao adicionar ou testar uma criação da biblioteca, a barra verde segue os bytes que chegam (de 10% a 90%); validar e instalar completam até 100%. Se o aparelho não permitir leitura em fluxo, volta ao comportamento anterior (10% → 90% → 95%).

## v1.9.13 - Seletor de candidato volta para a biblioteca
- Ao baixar um despertar da biblioteca, "✔ Concluir" no seletor volta para a Biblioteca (antes ia para Minhas criações). Pelo botão 👤 em Minhas criações continua voltando para lá.

## v1.9.12 - Tempo do modo "lançar"
- Em `poder_final` com `"lancar": true`, o campo opcional `"espera_s"` (1 a 8, padrão 3) define quantos segundos a esfera fica na mão antes de disparar sozinha.

## v1.9.11 - Despertar vale para vários candidatos
- Na tela de escolher candidato (👤) dá para marcar até 10 candidatos; tocar de novo desmarca; "✔ Concluir" volta. O despertar vale quando qualquer um deles lutar.
- Vínculos antigos (1 candidato) são convertidos sozinhos. Ao exportar, o arquivo leva só o 1º candidato.

## v1.9.10 - Despertar: escolher candidato do TSE
- O despertar importado deixa de depender de um nome digitado: no rascunho e em cada cartão há o botão **👤 Escolher candidato**, que abre a lista do TSE (cargo, UF e busca, a mesma fonte do lobby). O vínculo vale por id do candidato (ou nome igual) e fica em `brc_awc` (não muda o id da criação). Salvar um despertar novo exige escolher o candidato.
- `candidato` no arquivo passou a ser opcional (serve só de sugestão na busca). Exportar grava o nome do candidato escolhido. Despertares salvos na v1.9.9 continuam valendo pelo nome até você escolher um candidato.
- Se o JSON traz `candidato` (ex.: "Manoel Gomes"), vale sem escolher na lista (nome com todas as palavras iguais ao da lista do jogo); o 👤 troca por um candidato exato. Os botões de despertar e 4º poder agora usam as cores da aura.
- **Poder final lançado no botão:** em `poder_final` use `"lancar": true`. Depois da cutscene o poder fica na mão (esfera com as cores da aura) e dispara ao tocar em 🚀 LANÇAR, mirando no momento do toque, ou sozinho após 3 s. Sem `lancar`, dispara logo depois da cutscene.
- O 4º poder de despertar importado já roda a cutscene (2,4 s, nome do poder, rosto do candidato) antes de disparar; conferido em teste.

## v1.9.9 - Despertar importável (tipo "despertar")
- Novo tipo `"despertar"` (pacote brc1, ver_min_app `1.9.9`, até 12 KB): `dados.candidato` (nome; vale para quem tiver TODAS as palavras no nome, ex. "Lula"), `cores` [brilho, aura, sombra], `bonus_poder` (0 a 0,4, mais dano nos poderes durante o despertar), `atrib` (até 5 bônus temporários: spd, jmp, dmg, def, cdr, ls, reg, acd, kbr, dcd, pdm, crit; sem hp), `poder_final` {nome, icone, blocos (até 4, os mesmos blocos das armas; dano total até 90)}.
- Substitui o despertar embutido do candidato (excluir devolve o original). Só vale para o candidato nomeado, jogador ou CPU. Rascunho só vale no teste.
- Teste: 🧪 abre a luta de treino com despertar pronto; toque em 🔥 Despertar e depois no poder final (recarga curta no teste).
- Biblioteca: nova categoria "✨ Despertares". Rode de novo o `supabase-biblioteca.sql` (amplia a regra de tipos).
- Exemplo: `despertar-exemplo.json`.

## v1.9.8 - Etapa 5 (parte 2): Testar na biblioteca e mensagens de erro
- Detalhe de uma criação na Biblioteca ganhou "🧪 Testar sem instalar": baixa os dados, abre como rascunho (Minhas criações) e roda o teste da categoria; lá dá para Salvar. Se já houver rascunho, pede confirmação para substituir.
- Mensagens de erro em português claro por causa (401/403, 404, 400/422, 429, 5xx, sem conexão, demora, resposta inesperada) em lista, adicionar, testar, denunciar e enviar; "sem espaço" agora diz o que fazer.

## v1.9.7 - Etapa 5 (parte 1): espaço usado
- Minhas criações mostra uma barra de espaço do aparelho (estimativa sobre ~5 MB do localStorage: criações, cache da biblioteca) e avisa a partir de 80% (vermelho a partir de 95%). A Biblioteca mostra a mesma barra só quando passa de 80%.
- Botão "Limpar cache da biblioteca" (Minhas criações). Se salvar uma criação falhar por falta de espaço, o app apaga o cache da biblioteca sozinho e tenta de novo uma vez.

## v1.9.4 — Criações (Etapa 2, parte 4: finalização por modelo — fecha a Etapa 2)
- Novo tipo `"finalizacao"` (pacote brc1, ver_min_app `1.9.4`, até 30 KB). Não há cena livre em código: a cena é uma **linha do tempo** `dados.eventos[{t, acao, ...}]` de ações de uma lista permitida, com `duracao_s` (4 a 15 s) e `distancia` (50 a 220, distância do vencedor ao perdedor). Máx. 40 eventos; cada ação tem limite de quantidade e de valores (fora da faixa vira o limite, com aviso em português).
- Ações: `golpes_rapidos`, `corte`, `raio`, `particulas` (fogo, gelo, fumaca, faiscas), `flash`, `tremor`, `escurecer`, `som` (evento da lista embutida, ex. `boom`, `splat`, `pw_lgThunder`), `camera_zoom`, `explosao`, `mordida`, `texto` (até 16 caracteres). Golpes, corte, raio, explosão e mordida tocam um som padrão; `som` acrescenta outro.
- Vencedor, perdedor, sangue (🩸 da tela de luta) e a vinheta/vitória seguem as finalizações existentes; sangue só aparece nas ações que o usam quando está ligado. O perdedor some no fim (por `explosao` ou automaticamente).
- A finalização aparece no seletor **Finalização** da tela antes da luta (números 100 em diante; as 5 originais ficam iguais).
- Teste: botão 🧪 roda a cena inteira com dois bonecos (a luta de treino); chips **Sangue** e **Você vence/perde** na tela Minhas criações; a barra de baixo mostra duração e tempo atual. Sair restaura a finalização que estava escolhida.
- Exemplo: `trovao-sombrio.json`.
- Etapa 2 completa (armas, acessórios, mapas, sons, foto, finalizações). Próxima: Etapa 3 (biblioteca online, Supabase).

## v1.9.3 — Criações (Etapa 2, parte 3: editor de foto)
- Toda criação (arma, acessório, mapa, som) pode ter `foto` (data URI webp/png/jpeg, até 40 KB, tamanho 256x256). O validador confere o formato pelos bytes; foto inválida ou grande demais é ignorada com aviso (a criação continua válida).
- Ao importar, se o arquivo não trouxe foto, o app **gera sozinho** a partir do sprite (arma/acessório), do cenário (mapa) ou do ícone do evento (som).
- Botão **🖼** em cada criação abre o editor: desenhar com o dedo (8 cores, 3 tamanhos, borracha, limpar), **Gerar do sprite** ou **Escolher da galeria** (recorta quadrado e redimensiona); **Usar esta foto** codifica em webp (reduz a qualidade, e depois o tamanho, até caber em 40 KB).
- A foto aparece como miniatura no card e vai junto no Exportar. Não entra no id nem no limite de tamanho da criação.
- Falta da Etapa 2: finalizações por modelo.

## v1.9.2 — Criações (Etapa 2, parte 2: sons importáveis)
- Novo tipo **som** no `brc1`: `dados {evento, audio (base64 de ogg/mp3/wav)}`, até 140 KB e 3 s. Eventos: pulo, dash, esquiva, defesa, reflexo, início do round, "Lutar!", nocaute, explosão, toque nos menus, começar a luta, despertar, vitória e derrota.
- Um som salvo **substitui** o som daquele evento no jogo (o último salvo vence); excluir devolve o original. O arquivo embutido nunca é alterado: `sfx.js` ganhou só uma camada `CU` consultada antes dos arquivos (`SFX.cust/dec/play`).
- **Testar** toca o som e mostra evento, duração e tamanho. O formato é conferido pelos bytes iniciais (não pela extensão).
- Falta da Etapa 2: finalizações por modelo e editor de foto.

## v1.9.1 — Criações (Etapa 2, parte 1: acessórios e mapas)
- `www/custom.js` agora aceita `tipo` **acessorio** e **mapa** (mesmo pacote `brc1`, mesma tela **🧩 Minhas criações**, Testar / Salvar só para mim / Exportar / Excluir).
- Acessório: até 4 bônus entre os 13 atributos do jogo, cada um limitado a uma faixa; bônus fortes demais juntos são reduzidos (orçamento, negativos aumentam o limite). Sprite SVG sanitizado; `ancora` "cabeca" ou "rosto" desenha no lutador, "costas"/"mao" aparecem só nos ícones. Passiva por bloco: ainda não.
- Mapa: tema de fundo (praca, noite, vulcao, geleira, neon), cores do céu/chão/plataformas, até 5 plataformas; checagem automática de alcançabilidade (degrau máx. 120, vão máx. 340; aproximada). Perigos e pontos de início ainda não existem no jogo e são ignorados.
- Testar acessório/mapa usa a luta de treino (adversário parado e imortal). Embutidos intactos (teste de regressão: FD.W/A/M e FS.W/A/gr/ori iguais depois de instalar e apagar).
- Falta da Etapa 2: sons importáveis, finalizações por modelo e editor de foto.

## v1.9.0 — Criações (Etapa 1: armas por dados)
Novo botão **🧩 Minhas criações** no menu do jogo (aba Lutar). Importa uma arma `.json` (formato `brc1`), valida, deixa **Testar** (luta de treino: adversário parado e imortal, recarga rápida) e **Salvar só para mim**. Salvas ficam em `localStorage` (`brc_lib`) e entram na lista de armas. Exportar gera o `.json` de novo. Exemplo: `foice-da-morte.json`.
- Criações são **só dados**: nunca executam código. `www/custom.js` tem o validador (limites numéricos, orçamento de dano por poder, recarga mínima), o sanitizador de SVG (lista branca) e o interpretador de blocos (projetil, onda, investida, chuva, orbita, aura, invocar, status, teleporte, terremoto, atrai, repele, cura, escudo, visual, som).
- As 20 armas embutidas não foram alteradas. Ganchos no `fight.js`: `cast` (handler/som custom, recarga curta no treino), `ai` (parada no treino), `onClick`/`onChange` (data-a `brc*`), botão no menu. `sfx.js` expõe `SFX.tab`; `fight-sprites.js` expõe `FS.clr`.
- Ainda não existe: acessórios/mapas/finalizações/sons importáveis (Etapa 2), biblioteca online com Supabase (Etapas 3–4), foto desenhada no app.

## Gerar o APK (sem instalar nada)
1. Crie um repositório no GitHub e envie o conteúdo desta pasta (inclusive `.github`).
2. Aba **Actions → Build APK → Run workflow** (também roda a cada envio).
3. Baixe **Braresults-APK** em *Artifacts*, extraia e instale o `Braresults.apk`.

## Gerar localmente
`npm ci && npx cap add android && cp -r android-res/* android/app/src/main/res/ && npx cap sync android && cd android && ./gradlew assembleDebug`
(Node 20+, JDK 21 e Android SDK; adicione a permissão POST_NOTIFICATIONS ao AndroidManifest). APK em `android/app/build/outputs/apk/debug/`.

## Roadmap
Todas as ideias de melhoria, com status, estão em [`IDEIAS.md`](IDEIAS.md).

## Notificações e linha do tempo
- ★ no topo favorita a seleção atual. Em **Ajustes**, ligue as notificações.
- `www/runner.js` roda em segundo plano (~a cada 15 min, decisão do Android), consulta o TSE, guarda pontos na linha do tempo e notifica.
- Com o app aberto, avisos aparecem na tela e cada atualização do TSE entra na linha do tempo.

## v1.8.8 — Opções: condições da luta
- Nova seção "Condições da luta" em Lutar > Opções: recarga do despertar (15/30/60/90 s), duração do despertar (10/20/30/45 s), tempo de cada round (60/90/120/180 s), vida dos lutadores (metade, normal, ×1,5, dobro) e recarga dos poderes (metade, normal, ×1,5, dobro), com "Restaurar padrão". Valem para os dois lutadores na próxima luta e ficam salvas em OPT (chaves cAwc, cAwd, cRt, cVid, cCd).
- fight.js: AWDUR/AWC viraram let e são lidos no início da luta; RT, vida (mk) e recarga (cast e anel do HUD) leem OPT. Padrões idênticos aos anteriores, então quem não mexe não percebe diferença. A tela de opções agora mantém a rolagem ao tocar numa opção.

## v1.8.7 — sons estilo anime (Parte 4: poderes)
- 60 sons únicos de poder (www/sfx/pw_<id>.ogg, um por poder, combinando com o tema da arma e o tipo), pw_aw (camada brilhante extra quando despertado), awaken e ult1 a ult5 (poder final, esfera, lançamento e raios).
- sfx.js: SFX.pw toca pw_<id> (variação de ±3% no tom; se despertado, soma pw_aw), SFX.awaken e SFX.ult tocam o arquivo; sem arquivo caem no sintetizado antigo. fight.js e os tempos das cutscenes não mudaram.

## v1.8.6 — sons estilo anime (Parte 3: combate)
- Novos sons gerados do zero (www/sfx/): 16 swings por arma (swing_blade, katana, dagger, heavy, blunt, gun, bow, magic, punch, fire, ice, zap, guitar, shield, spear, throw; Martelo/Picareta/Livro/Cetro reaproveitam o arquivo da família com tom diferente) e 12 impactos (hit_<cut|blunt|shot|elem>_<l|m|h>, nível leve/médio/forte pelo dano e empurrão), mais splat.ogg (reservado às finalizações, Parte 5).
- sfx.js: tabelas SW (arma -> swing) e HF (arma -> família de impacto); SFX.swing e SFX.hit tocam o arquivo com variação aleatória de ±3-4% no tom; sem arquivo caem no som sintetizado antigo. fight.js e a luta não mudaram. Crítico ainda sem som próprio (precisa de gancho em fight.js).

## v1.8.5 — sons estilo anime (Parte 2: movimento e defesa)
- Refeitos jump, dash, dodge (3 variações cada), block e reflect: whooshes com brilho, tinidos metálicos longos, impactos em camadas e eco curto. Só sfx/ mudou desde a v1.8.4.

## v1.8.4 — sons por síntese (Parte 2: movimento e defesa)
- Novos sons gerados do zero (www/sfx/): jump, dash, dodge (cada um com 3 variações _b/_c escolhidas ao acaso), block e reflect. Sem arquivo, cai no som sintetizado antigo.
- Só sfx.js (LIST + escolha de variação) e arquivos de áudio; fight.js e a luta não mudaram.

## v1.8.3 — sons por arquivo (Parte 1: menus)
`sfx.js` toca arquivos de `www/sfx/<nome>.ogg|mp3|wav`; sem arquivo usa o sintetizado. Parte 1: 6 arquivos próprios (ui_tap, ui_toggle, ui_ok, ui_go, round, fight) e os outros nomes reaproveitam um deles com tom diferente (tabela AL). API SFX.* inalterada.

## v1.8.2 — interface do jogo Lutar redesenhada
- Tela de montar a luta compactada: Equipamento e arena lado a lado, lista com mais candidatos visíveis, rodapé com resumo da luta e abas de cargo roláveis.
- Tela de Opções reorganizada em seções (Controles, Tela, Joystick, Som e vibração).
- Nova tela inicial: título em duas linhas, luvas se enfrentando, cenário de ringue com holofote e faixas nas cores do Brasil, e atalho mostrando o último lutador.
- Menu, montagem da luta (seções agrupadas: lutador, equipamento, arena, finalização, dificuldade), cartões e botões de escolha com novo visual verde/ciano; só CSS e marcação, a lógica do jogo não mudou.

## v1.8.1 — jogo Lutar mais fluido (sem baixar a qualidade)
- Enquanto o jogo está aberto, o app por trás (animações, fundos e blur) fica pausado e oculto.
- Sprites de armas e acessórios são pré-renderizados uma vez (antes o SVG era reprocessado a cada quadro) e carregados antes da luta começar.
- O fundo desenha só a parte visível da arena; o canvas é opaco (`alpha:false`).
- A queda automática de resolução ficou bem mais conservadora (ignora os 5 primeiros segundos e só age com média acima de 27 ms).

## v1.8.0 — nova identidade visual
- Nova logo (mapa do Brasil em neon com urna e check): ícone do app (launcher legado, redondo e adaptativo), splash, ícone do cabeçalho (`www/icon.png`) e `www/logo.webp` (usada na abertura e como marca d'água).
- Novo tema padrão **Neon Brasil (logo)** em Ajustes > Aparência (paleta verde, ciano, amarelo e laranja da logo); os temas antigos continuam disponíveis.
- Nova abertura (`intro.js` + bloco v1.8 do `theme.css`): o contorno neon se acende girando, pisca como tubo de neon, anéis e partículas coloridas, nome e ano.
- Menu inferior com 6 colunas (a aba Ajustes não quebra mais de linha).

## Novidades da v1.2 (versão atual do app: 1.5.1)
- Visual novo: temas Neon, Brasil e Aurora (além de Automático/Escuro/Claro), fundo animado, números que contam, borda animada no líder, confete quando alguém é eleito, ícones próprios.
- Novas funções: compartilhar resultado (⤴), puxar para atualizar, selo AO VIVO / FINAL / OFFLINE.
- Dados do TSE: códigos do 2º turno lidos de `comum/config/ele-c.json` (campo `cdt2`), código do município com 5 dígitos, cache de 404 para não ser bloqueado pelo limite do TSE (100 req/s por IP; muitos 404 bloqueiam o IP por 10 min).
- Download do APK: aba **Releases** do repositório (além de Actions → Artifacts).
- v1.4.3: botão voltar do Android, toque na notificação abre o favorito certo, modo leve em Ajustes, `aria-live` no aviso e fallback do `roundRect`. Nova dependência: `@capacitor/app` (rode `npm install` e envie o `package-lock.json` atualizado).
- v1.4.4: mapa com botão **Apurando** (estados ainda apurando em amarelo), notificações só com resultado confirmado pelo TSE (projeção não notifica), **Horário silencioso** em Ajustes, sem notificação duplicada entre o app aberto e o segundo plano, e backoff no Quadro.
- v1.4.5: gráfico de evolução por horário (votos %, votos/min, 1º−2º) com toque para ver valores; comparar dois estados/cidades na aba Análise; replay também no mapa (usa o histórico por estado gravado a partir desta versão).
- v1.4.6: contraste do tema claro ajustado e remoção de código morto no `fx.js`.
- v1.5.0: **replay renovado**. Player flutuante fixo na parte de baixo (continua ao trocar entre Resultados, Análise e Mapa), barra arrastável que mostra a apuração ao vivo enquanto você desliza, marcos na barra (troca de liderança, eleito confirmado, 2º turno) com botões ⏮/⏭ para pular entre eles, velocidades ½×/1×/2×/4×/8× (lembrada), pausa mais longa em cada marco, variação de votos (+N) em relação ao ponto anterior durante o replay, botão AO VIVO e voltar do Android fecha o player. Linha do tempo em cache (replay mais leve).
- v1.5.1: no 1º turno de presidente/governador só é "eleito" quem passou de 50% dos válidos (os dois do 2º turno não aparecem mais como eleitos, nem no Quadro, nas notificações e nos marcos do replay); a atualização automática agora respeita o intervalo escolhido (antes ×6 com 100% apurado); "Linha do tempo" e "Replay" viraram um card só (Replay da apuração).
- v1.5.1 (extra): o botão 1º/2º turno só aparece para Presidente e Governador, e às 17h de 25/10 (início da apuração do 2º turno) o app volta sozinho para o 2º turno, uma única vez; depois vale a sua escolha.

## Jogo de luta (aba "Lutar")
- Tela cheia em paisagem (gira sozinha se o celular estiver em pé). Menu: Jogar / Opções (posição do HUD).
- Candidatos por cargo (Presidente, Governador, Senador, Dep. Federal/Estadual) com busca; arma, acessório e mapa por seletor com setas.
- 20 armas e 25 acessórios com sprites (`www/fight-sprites.js`); modo vs CPU e 2 jogadores (tela dividida).
- Teclado: J1 = WASD, J K L, 1 2 3 · J2 = setas, `,` `.` `/`, 8 9 0. Botão ⏸ pausa. Escolhas ficam salvas.
- **Despertar** (só Flávio Bolsonaro e Lula): carrega durante os primeiros 60 s de luta (botão mostra ⏳ e a barra abaixo da vida enche); quando fica 🔥 PRONTO, o botão (tecla Q no J1 / M no J2) ativa a aura (verde para Flávio, vermelha para Lula) por 20 s. Quando acaba, começa um novo timer de 60 s para usar de novo (cada round recomeça do zero). Os 3 poderes causam +20% (Flávio) / +15% (Lula) de dano e libera o 4º poder (botão ☄️/🌩️, tecla E no J1 / N no J2), 1 vez por despertar, com cutscene. **Frenesi Brasileira** (Flávio, 48 de dano direto, de 300 de vida): fica na mão após a cutscene e é lançada em linha reta pelo botão 🚀 LANÇAR (ou sozinha após 3 s), sem teleguiar; dá para desviar pulando ou com dash. **Tempo Caótico** (Lula): 44 raios caem em pontos aleatórios do mapa todo, cada um avisado por um círculo vermelho no chão por ~0,65 s (11 de dano direto); dá para sair de baixo, usar dash, ou se proteger embaixo de uma plataforma; o próprio Lula não é atingido. A CPU também usa o despertar e tenta desviar (mais ou menos conforme a dificuldade). Constantes no topo de `fight.js` (`AWC`, `AWDUR`, `STN`, `STI`, `STW`, `SR`, `SBS`, `HOLDT`).

- v1.6.1 (Parte 1 do plano de melhorias do jogo): bonecos com ragdoll articulado (cabeça, pescoço, tronco, cotovelos, mãos, joelhos e pés), câmera com zoom automático, mapa 2× maior (1600 de largura), sistema de rounds com contador de vitórias (★) acima da cabeça de cada lutador e K.O. em câmera lenta.
- v1.6.1 (Parte 2A): Despertar carregável em 60 s de luta com recarga de 60 s depois que acaba; Esfera do Brasil lançável (sem teleguiar, desviável); Tempestade Vermelha com raios aleatórios por todo o mapa (sem teleguiar, desviável); dash passa a ter invulnerabilidade curta contra os poderes finais; medidor do Despertar na barra de vida.
- v1.6.1 (Parte 2B): **60 poderes únicos** (20 armas × 3), cada um com mecânica própria (id em `www/fight-data.js`, implementação em `PW` dentro de `www/fight.js`); o tipo da letra (P/Z/M/A/D/H/S/B) agora só orienta a CPU. Novos efeitos: sangramento/queimadura (dano contínuo), silêncio, tontura (controles invertidos), prisão (não anda/pula/dash), marca (+35% dano recebido), fraqueza (−25% dano causado), contra-ataque (reflete o golpe), esquiva (anula 1 golpe), invisibilidade, quebra de guarda, bala perfurante, aura de fogo, muralha, mina, guarda que atira, projéteis com arco/quique/ricochete/bumerangue/curva, telegráficos com aviso no chão (marreta, raios, chuva de flechas, tremor). Ícones de status aparecem acima da cabeça. A descrição de cada poder está na tela de seleção da arma (`FD.PD`).
- v1.6.1 (Parte 3): **mira dos poderes** — o joystick agora também mira (empurrar em diagonal/para cima/para baixo define o ângulo; sem tocar, mira automática no adversário); indicador tracejado com mira e ângulo em graus (fica vermelho 🎯 quando está em cima do alvo); todos os projéteis, o Raio Faísca, o Lança-chamas e a Esfera do Brasil seguem o ângulo; a CPU também mira (com erro conforme a dificuldade). Botões e joystick redesenhados (gradiente, brilho ao tocar, varredura de recarga nos poderes, área de toque do joystick maior, vibração, sem menu de pressionar-e-segurar). Opções novas: indicador de mira, pular empurrando o joystick pra cima (desligado por padrão, pois agora o eixo vertical mira) e vibração. Teclado: R/F mira cima/baixo (jogador 1) e O/P (jogador 2).
- v1.6.2 (Parte 4): **texturas detalhadas** — os 20 sprites de armas e os 25 de acessórios foram redesenhados em SVG com gradientes, brilho, relevo e sombra (`www/fight-sprites.js`); projéteis com halo de luz, rastro e núcleo brilhante; ondas de choque com preenchimento, faíscas e flash; 5 mapas com chão e plataformas texturizados (grama/flores, calçada de tijolos, basalto com rachaduras de lava, gelo com cristais, grade neon) e céu com nuvens/raios/sol sintético; barras de vida com gradiente por faixa (verde/laranja/vermelho pulsante), brilho, marcas de 10% e rastro de dano; botões de poder com ícone do tipo (☄️ ❄️ 🎯 💥 💨 💚 🛡 ⚡); menus com fundo texturizado, botões com relevo e título animado.
- v1.6.2: **editor de HUD livre** (Opções → 🎛 Editar botões livremente): arraste cada botão (joystick, ataque, dash, pulo, defesa, 3 poderes, despertar e poder final) para qualquer ponto da tela e mude o tamanho de cada um com − / +; ↺ Padrão volta ao layout original. Salvo em `OPT.lay` (fração da tela + multiplicador). Vale para 1 jogador; o PvP mantém o layout fixo.
- v1.6.3 (balanceamento de dano): vida base **300** (antes 100); dano, cura e escudo de cada arma recalibrados por simulação (multiplicadores entre 0,18 e 0,34 da escala original); valores fixos do código (sangramento, queimadura, poças de fogo, ataque básico, regeneração, anel de vida) acompanham a vida base; poder final do Flávio/Lula em 20% do valor proporcional anterior; curas do Cajado e do Livro enfraquecidas (15, recarga 14 s e 13 s). **Correção da IA:** zona morta entre 85 e 100 px em que a CPU não avançava nem atacava (causava partidas travadas). Resultado no Normal (IA × IA, 3200 partidas fora da amostra de ajuste): mediana 61 s por round (p10 48 s, p90 90 s), taxa de vitória por arma entre 44% e 56%, ~1,5% de partidas travadas. **Limitações:** o Fácil não foi calibrado (desvio 11,7 pontos); o Despertar segue forte (68–85% de vitória); nada foi testado com humano jogando nem em aparelho Android.
- Ferramentas de balanceamento em `tools/`: `tools/sim` (simulador headless com Playwright: `shard.py`/`runall.sh` rodam o round-robin 20×20 em 4 fatias paralelas, `analyze.py` e `matrix.py` resumem) e `tools/balance` (`balance.json` + `apply.py` geram `www/fight-data.js` a partir de `fight-data.orig.js`; `tune.py` recalibra). O simulador injeta ganchos só numa cópia de `fight.js`; o jogo não contém código de teste. Requer `pip install playwright` e Chromium.
- v1.6.4 (Difícil calibrado): tabela `FD.CM[dificuldade][arma]` multiplica o dano causado **só pela CPU** (jogador e Normal não mudam); hoje só existe `CM[2]` (Difícil). Valores gerados por `tools/balance/tune_df.py` (`python3 tune_df.py DF ITERS`; `balance.json` → campo `cm`). Resultado no Difícil (IA × IA, 3200 partidas fora da amostra de ajuste): taxa de vitória por arma entre 43% e 59% (desvio 3,5 pontos), mediana 79 s por round (p10 58 s, p90 154 s), ~5% de partidas travadas (Cajado 23%, Livro 13%, Katana 10% delas). 20 de 190 confrontos com <20% ou >80%. Normal reavaliado: desvio ~3 a 5 pontos conforme a semente (varia por ruído da amostra).
- v1.7.0: **mapa com todos os municípios** (já vem ligado na aba Mapa; os botões *Estados* e *Municípios* alternam entre os dois mapas). O toque na cidade mostra Presidente, Governador, Senador, Dep. Federal e Dep. Estadual. Os ~5.570 municípios são desenhados em um único `<canvas>` (`munmap.js`), pintados com a cor do partido que venceu em cada um, borda branca fina. Toque na cidade abre o card com os 4 mais votados; *Dar zoom em UF* aproxima o estado; pinça/arrasto sem redesenhar durante o gesto. Malha do IBGE (`intrarregiao=municipio`) simplificada em centésimos de grau e guardada em cache (`mm.geo1`); vencedores guardados em `mm.w:<cargo+turno>` e atualizados em segundo plano (8 requisições simultâneas, só as cidades que ainda não chegaram a 100%). Sem a malha ou com o botão desligado, o mapa de estados continua igual.
- v1.6.5: **limite de tempo por round** (`RT=120` s em `fight.js`): ao acabar, vence quem tem maior % de vida (aparece "TEMPO ESGOTADO" no banner e o relógio ⏱ fica ao lado do ROUND). **Fácil calibrado** (`FD.CM[0]`, mesmo mecanismo do Difícil; só dano da CPU). Validação IA × IA, 3200 partidas por dificuldade com sementes novas, vitória por arma 41% a 57% nas três: Fácil desvio 4,2 (mediana 72 s), Normal 4,3 (mediana 60 s), Difícil 3,6 (mediana 80 s). Rounds que terminam pelo tempo: ~8% no Fácil, ~4% no Normal, ~18% no Difícil; no Difícil o Cajado (76% dos rounds dele) e o Livro (43%) vão ao tempo por serem armas de sustentação, e quem decide é a % de vida. Rodar de novo: `python3 tools/balance/tune_df.py DF ITERS`.
- v1.7.1 (finalizações, parte 2 de 5): **Katana** liberada no lobby. Cutscene de 11,5 s (`finKat` em `www/fight.js`): vencedor se aproxima, cena escurece, katana erguida, avanço relâmpago com rastro de corte, cabeça do perdedor decepada (rola e quica no chão), corpo decapitado cai; com Sangue ligado há jato pulsante no pescoço e poça no chão; vencedor limpa e embainha a lâmina.
- v1.7.2 (finalizações, parte 3 de 5): **Raio da morte** liberado no lobby. Cutscene de 11,5 s (`finRaio`/`rayDraw` em `www/fight.js`): vencedor ergue a mão e carrega uma esfera elétrica (0,7-3 s, cena escurece, raios no céu); aos 3 s o raio atinge o perdedor (feixe da mão + raios do céu, flash, tremor, perdedor pisca como em raio-X); aos 5 s ele se desintegra em cinzas/brasas, deixando marca de queimado no chão; vencedor comemora aos 6,6 s; banner FINALIZAÇÃO! aos 8,4 s. Com sangue ligado, a desintegração solta partículas vermelhas. FIN_OK=[0,1,2,3]; scorch usa `FS2` com campo `c`.
- v1.7.3 (finalizações, parte 4 de 5): **Cães pretos com fogo** liberado no lobby. Cutscene de 11,5 s (`finCaes`/`dogOne`/`dogDraw`/`skDraw` em `www/fight.js`): vencedor recua e ergue a mão (cena avermelhada); 3 cães pretos em chamas brotam do chão (1-2,2 s); de 2,4 a 5 s revezam saltos e mordidas no perdedor (faíscas/sangue com 🩸); aos 5 s os cães avançam sobre ele e o devoram (5-6,4 s, pedaços voando); aos 6,4 s recuam e revelam o **esqueleto do perdedor** deixado no chão (permanece até o próximo round); cães uivam e se dissolvem em fogo (7,2-7,8 s); vitória aos 7,4 s; banner aos 8,4 s. FIN_OK=[0,1,2,3,4]. Teste: tools/sim/smoke_caes.py.
- v1.7.0 (finalizações, parte 1 de 5): cutscene de finalização de **11,5 s** quando alguém é derrotado (estado `rst===3` em `fight.js`, funções `finStart/finU/finDraw/finOv`). **Finalização 1 – Socos:** o vencedor avança, joga o perdedor para o ar e dá uma barragem de socos cada vez mais rápida (impactos, tremor de tela, faixas de cinema); a partir de 6,3 s o corpo começa a esfarelar e aos 8 s se desintegra em ~300 partículas com flash; banner "FINALIZAÇÃO!". **Lobby:** seção "Finalização" logo abaixo dos acessórios (Nenhuma / Socos / 4 travadas 🔒) e botão **🩸 Sangue** (liga/desliga; salvo em `fg.fin`). Sangue só afeta a finalização (gotas, poças no chão, vinheta vermelha). A finalização escolhida vale para quem vencer (jogador, CPU ou amigo). Para liberar uma nova: implementar o ramo em `finU/finStart` e incluir o número em `FIN_OK`. **Não testado:** Android real, desempenho em aparelho fraco, PvP.
- v1.7.4 (finalizações, parte 5 de 5): **Bomba atômica + planeta Terra destruído** liberado no lobby (FK=5). Cutscene de 14 s (`finBomba`/`bombDraw`/`bombOv` em `www/fight.js`): vencedor recua e aciona um botão vermelho (0,9-2 s); marca de alvo pisca no chão e o míssil nuclear cai sobre o perdedor (2-3,6 s); aos 3,6 s flash branco, tremor, onda de choque, detritos (sangue com 🩸), perdedor vaporizado (marca de queimado no chão) e **cogumelo atômico** crescendo; aos 6,4 s a tela vira espaço e mostra a **Terra** rachando com lava (7,2-9,6 s); aos 9,6 s explode em 14 pedaços + faíscas; volta à arena aos 11,4 s, vitória aos 12 s, banner aos 12,4 s. Duração por finalização via `FDUR()`. FIN_OK=[0,1,2,3,4,5]. Teste: tools/sim/smoke_bomba.py.

## Sons (SFX) - v1.7.5
- `www/sfx.js`: efeitos sintetizados por WebAudio (sem arquivos de audio). Interface, pulo/dash, golpes por arma, poderes (som unico por poder), defesa/esquiva/reflexo, despertar, poder final, rounds/K.O. e as 5 finalizacoes (agendadas por tempo de cena).
- Opcoes > Efeitos sonoros: ligar/desligar e volume (0-100%), salvo em `fg.opt` (`vol`, `snd`).
- Para novo som: adicionar em `SND` (simples) ou na API em `sfx.js` e chamar `SFX.p('nome')` no `fight.js`.


## v177 - SFX 3 (sincronia)
- Finalizações: som de K.O. não é mais cortado por SFX.fin (ficava mudo ate 0,9 s); mordidas dos cães agora nos 10 instantes reais (2,40 ... 4,83 s).
- Poder final (4º poder do despertar): subida de 2,1 s casada com o clarão da cutscene (antes durava 1,2 s); Esfera do Brasil ganha som ao aparecer na mão (ult 3) e ao ser lançada (ult 4); Tempestade Vermelha ganha estalo em cada um dos 44 raios (ult 5).
- Pausa: SFX.hold() congela o relógio de áudio (suspend/resume) para não dessincronizar finalizações/cutscene; também congela ao minimizar o app.
- Arquivos: www/sfx.js, www/fight.js (4 linhas).


## v1.8.9 - Sons Parte 5 (final e finalizacoes)
Novos arquivos em www/sfx: ko, boom, boom_b, splat_big, win_good, win_bad, fin1..fin5 (estilo anime, sintetizados). Integracao em sfx.js (LIST, VR boom, playBuf com atraso, SFX.win e SFX.fin). fight.js nao foi alterado.

## v1.9.5 - Etapa 3: Biblioteca online (leitura)
- Botão **📚 Biblioteca** no menu do jogo (`data-a="brclib"`). Novos: `www/lib.js` (window.BRCL), `www/lib-config.js` (URL e chave PÚBLICA do Supabase), `supabase-biblioteca.sql`.
- Lista paginada (12 por vez) só com metadados + foto; busca por nome; ordem (mais baixadas / novas / menores); categorias; detalhe; **Adicionar** baixa só os `dados` e passa pelo MESMO validador de `custom.js` (`BRC.lib.add`); aba **Instaladas**; **Remover**; **Denunciar** (1x por aparelho); contador de downloads via RPC; cache da 1ª página de cada busca (offline mostra o cache); criação que exige app mais novo aparece como "Atualize o app".
- `custom.js`: `BRC.api` ganhou getter, `BRC.lib {has,get,add,del}`, roteamento de `data-a` que começam com `brcl`.
- SQL: criações enviadas entram direto como `aprovado` (decisão do dono); moderação só pelo painel (mudar status para `removido`).

## v1.9.6 - Etapa 4: Envio para a biblioteca
- Botão **📚 Enviar** em cada criação salva e no rascunho (Minhas criações) abre a tela de envio (`www/lib.js`, `data-a` começando com `brcu`): nome, apelido (autor), aceite de termos (1ª vez) e **Enviar agora**. Só habilita depois de **🧪 Testar** na sessão (`BRC.lib.tested`).
- Publica na hora (`status:'aprovado'`, `Prefer: return=minimal`), `hash = pkg.id` (duplicata = 409 "já existe"), `tamanho_bytes` = tamanho dos `dados`. Limites no app: 5 envios/24 h por aparelho, filtro de palavras no nome/apelido, foto obrigatória (gerada se faltar), reenvio da mesma criação bloqueado. Estado local: `brc_nick`, `brc_terms`, `brc_upl`, `brc_sent`.
- SQL atualizado (`supabase-biblioteca.sql`: insert exige hash e foto; limite de tamanho dos dados) e novo `supabase-moderacao.sql` (consultas para remover/restaurar pelo painel).

## v1.9.38 — Ícones desenhados nas criações (B5e)
- Em qualquer campo `icone` de uma criação, além de emoji, dá para escrever o nome de um ícone desenhado (ex.: `raio`, `fogo`, `escudo`, `mira`, `gelo`, `cometa`, `cura`, `explosao`, `tempestade`, `vento`, `soco`, `espada`, `caveira`, `coracao`, `estrela`, `foguete`, `sangue`, `cao`, `bomba`, `coroa`, `vulcao`, ou os nomes de `IC.names()` como `bolt`, `flame`). O app guarda o emoji equivalente, que o `icons.js` troca pelo SVG nas telas.
- Os 8 ícones de poder (PTI) da luta passaram a ser SVG (v1.9.37).

## v1.9.39 — Armas com ataque próprio, Parte 1 (armas de longe)
- `www/fight.js`: nova tabela `WB` (perto de `cast`) com cooldown, multiplicador de dano, alcance e distância preferida da IA por arma. O ataque básico consulta `WB[f.wi]`; arma fora da tabela mantém o golpe antigo (0,45 s / 85 px).
- Pistola (tiro reto, 0,55 s), Arco (flecha, 0,8 s), Cajado (bola de poder, 0,7 s), Chamas (bola de fogo que queima, 0,6 s), Gelo (estilhaço que desacelera, 0,65 s), Raio (raio rápido, 0,5 s). Reaproveitam `shot2`/`PR` dos poderes.
- IA: com arma de longe mantém distância e atira até ~560–700 px.

## v1.9.40 — Armas com ataque próprio, Parte 2 (corpo a corpo)
- `www/fight.js`: tabela `WB` ganhou 9 armas corpo a corpo, via helper `mel` (golpe com atraso de 0,07 s, alcance e empurrão próprios). Adaga .25 s, Luvas .3 s (2 golpes), Espada .35 s, Katana .4 s (alcance 135), Picareta .6 s (ignora defesa), Tridente .6 s (alcance 150 + avanço), Taco .7 s (empurrão forte), Machado .75 s, Martelo .9 s (onda no chão que atordoa).
- IA usa o alcance de cada arma para se aproximar e atacar.

## v1.9.41 — Armas com ataque próprio, Parte 3 (restantes)
- `www/fight.js`: tabela `WB` ganhou Escudo (golpe curto com empurrão, .5 s), Bomba (granada de pavio curto que explode no impacto, .8 s), Guitarra (onda sonora curta que deixa o inimigo tonto 0,8 s, .6 s), Livro (bola de papel, .5 s) e Cetro Real (orbe do decreto, .6 s). Todas as 20 armas agora têm ataque básico próprio.
- Multiplicadores ajustados por simulação (Escudo 1.25, Bomba 1.7, Guitarra .6, Livro 1.15, Cetro .9).

## v1.9.42 — Balanceamento geral das 20 armas
- Multiplicadores de dano (`m` na tabela `WB` de `www/fight.js`) reajustados por simulação (matriz 20x20, 3 sementes por rodada, 9 rodadas). Antes: Pistola 82% e Adaga 19% de vitórias; depois, quase todas entre 44% e 58%.
- Valores atuais (arma:cooldown,mult): 10:{c:.55,m:0.46 4:{c:.8,m:0.52 5:{c:.7,m:1.15 12:{c:.6,m:1.39 13:{c:.65,m:1.33 14:{c:.5,m:0.72 3:{c:.25,m:2.34 18:{c:.3,m:2.1 0:{c:.35,m:1.93 15:{c:.4,m:1.13 8:{c:.6,m:1.55 7:{c:.6,m:1.0 9:{c:.7,m:2.17 1:{c:.75,m:1.71 6:{c:.5,m:1.34 11:{c:.8,m:1.6 16:{c:.6,m:0.51 17:{c:.5,m:0.9 19:{c:.6,m:1.1 2:{c:.9,m:1.3 

## v1.9.43 — Balanceamento nas dificuldades 0, 1 e 2
- Multiplicadores `m` da tabela `WB` reajustados pela média das três dificuldades (matriz 20x20, 4 rodadas). Valores: 10:{c:.55,m:0.48 4:{c:.8,m:0.48 5:{c:.7,m:1.4 12:{c:.6,m:1.49 13:{c:.65,m:1.51 14:{c:.5,m:0.73 3:{c:.25,m:2.53 18:{c:.3,m:2.08 0:{c:.35,m:1.94 15:{c:.4,m:1.12 8:{c:.6,m:1.63 7:{c:.6,m:0.91 9:{c:.7,m:2.05 1:{c:.75,m:1.75 6:{c:.5,m:1.44 11:{c:.8,m:1.74 16:{c:.6,m:0.47 17:{c:.5,m:0.95 19:{c:.6,m:1.09 2:{c:.9,m:1.14 

## v1.9.44 — Projéteis próprios de Arco e Pistola
- `www/fight.js`: novos desenhos `DRW.bala` (bala de latão com rastro luminoso curto) e `DRW.flecha` (haste de madeira, ponta de aço, penas vermelha/branca, gira com a direção do voo). Pistola (10) e Arco (4) na tabela `WB` passaram de `ln` (linha luminosa) para `dr:'bala'` / `dr:'flecha'`. Dano, velocidade, cooldown e hitbox (`sz`) não mudaram, então o balanceamento da v1.9.43 vale igual.

## v1.9.45 — Som próprio de ataque para cada uma das 20 armas
- `www/sfx/`: 6 arquivos novos de swing (`swing_axe`, `swing_hammer`, `swing_pick`, `swing_staff`, `swing_book`, `swing_scepter`), gerados por `tools/sfx_armas.py`. Antes Machado/Martelo/Picareta dividiam `swing_heavy` e Cajado/Livro/Cetro Real dividiam `swing_magic` (só mudava o tom).
- `www/sfx.js`: tabela `SW` aponta Machado, Martelo, Picareta, Cajado, Livro e Cetro Real para os arquivos novos (todos tocados em velocidade 1) e os 6 nomes entraram em `LIST`. Se um arquivo faltar, cai no som sintetizado antigo. Sons de impacto (`hit_*`) não mudaram.

## v1.9.46 — Parte 8: impacto próprio por arma, sons dos efeitos especiais e zunido de projétil
- `www/sfx/`: 30 arquivos novos gerados por `tools/sfx_armas8.py` (numpy + ffmpeg): `hit_w0` a `hit_w19` (impacto de cada arma, id = índice da arma), `fx_martelo`, `fx_bomba`, `fx_queima`, `fx_gelo`, `fx_tontura`, `fx_katana`, `fx_tridente`, `fx_picareta`, `fx_flecha`, `fx_bala`.
- `www/sfx.js`: `SFX.hit` toca `hit_w<arma>` com volume e velocidade pela força do golpe (dano + empurrão); sem o arquivo cai nas 12 famílias `hit_<fam>_<l|m|h>` e depois no som sintetizado. Nomes novos em `LIST`; `VG` ajusta o ganho de alguns.
- `www/fight.js`: opção `sx` nos projéteis (toca ao acertar; na explosão quando há `ex`): Chamas `fx_queima`, Gelo `fx_gelo`, Bomba `fx_bomba`, Guitarra `fx_tontura`. Disparo: `fx_flecha` (Arco), `fx_bala` (Pistola). Início do ataque: `fx_martelo`, `fx_katana`, `fx_tridente`. Picareta: `fx_picareta` no golpe que ignora defesa (em `hitF`). Dano, alcance e balanceamento não mudaram.

## v1.9.47 — Pegada própria para cada arma (poses)
- `www/fight.js`: tabela `HG` (armas 0-19) define como cada arma é segurada: ângulo de repouso `R`, posição da mão da frente `H`, 2ª mão (`B` ao longo da arma, `BO` fixa, `BA` no golpe), arco do golpe (`S` ângulo, `A` caminho da mão), mira (`M`/`AR`/`BM`: braço e arma seguem a direção do tiro, inclusive ao usar poderes) e escala `k`. `pose()` posiciona as mãos e `body()` desenha a arma com ângulo suavizado e as duas mãos por cima do cabo.
- Jeitos: Espada em guarda diagonal; Machado, Martelo, Picareta e Taco apoiados no ombro (Martelo e Taco com as duas mãos) e golpe por cima; Adaga baixa e estocada curta; Arco e Pistola esticados e apontando para o alvo (Arco puxa a corda com a 2ª mão); Cajado, Chamas, Gelo, Raio e Cetro apontados para o alvo ao atacar/usar poder; Escudo na frente com empurrão; Tridente e Katana com as duas mãos; Guitarra atravessada no corpo (2ª mão no braço); Livro no peito; Luvas em guarda de boxe com jab alternado; Bomba levantada e arremesso por cima.
- Armas personalizadas (id 20+) continuam com o jeito antigo. Dano, alcance e balanceamento não mudaram. Versão 1.9.47.

## v1.9.48 — Parte 1a: escolher arma, acessório e finalização da CPU
- Em "Monte sua luta" (vs CPU) há a seção "Adversário (CPU)": slots de Poder e Bônus (🎲 Aleatório por padrão; a lista inclui armas/acessórios personalizados) e chips de Finalização da CPU: "🤝 Igual à minha" (padrão, comportamento antigo), "🎲 Aleatória" ou uma finalização específica.
- Quando a CPU vence, executa a SUA finalização; quando o jogador vence, a dele. A finalização do jogador é restaurada ao sair da luta.
- A escolha é salva junto de 'sel' (CPW, CPA, CPF); jogos salvos antigos abrem como aleatório/igual. A tela de carregamento mostra arma e acessório da CPU. PvP e treino sem mudança.

## v1.9.49 — Parte 1b: despertar escolhível (jogador 1, jogador 2 e CPU)
- O despertar deixou de pertencer ao candidato: novo slot "Despertar" na tela "Monte sua luta" (jogador 1/2) e na seção "Adversário (CPU)". Opções: "Do candidato" (padrão, comportamento antigo), "🚫 Nenhum" ou qualquer despertar de AWD (os dois originais e os personalizados). Na CPU o padrão é "Aleatório" (só tem despertar se o adversário sorteado tiver um, como antes).
- Valores guardados em ST 'sel' (AW, AW2, AWE; ausente = 'auto'); despertar personalizado removido volta para 'auto'. Aplicado em start() depois de criar P e E; o botão do HUD lê a escolha; "Nenhum" não mostra botão nem aciona pelas teclas. A CPU usa o despertar escolhido (awaken + poder final).
- Nomes novos: Flávio = **Frenesi Brasileira** (antes Esfera do Brasil), Lula = **Tempo Caótico** (antes Tempestade Vermelha). Chaves internas 'flavio' e 'lula' inalteradas. Seção "Despertar" acima atualizada; o histórico das versões antigas mantém os nomes antigos.
- Removido o aviso "🔥 Despertar disponível" do card dos candidatos. A tela de carregamento mostra o despertar escolhido de cada lado. Modo treino mantém o editor.

## v1.9.50 — Parte 2: opção 🎲 Aleatório (arma, acessório, finalização, despertar e mapa)
- Cada categoria pode ficar em aleatório: a cada vez que você aperta LUTAR o jogo sorteia um item diferente do anterior (nunca repete, se houver mais de um). Vale para jogador 1, jogador 2 (PvP) e CPU.
- Onde ligar: botão "🎲 Aleatório" na tela de escolha de arma/acessório/mapa; chip "🎲 Aleatória" na Finalização; opção "🎲 Aleatório" no carrossel do Despertar; "🎲 Tudo aleatório" no menu; bloco "Aleatório (muda a cada luta)" em Opções (por categoria, vale para os dois lutadores). O slot mostra "🎲 Aleatório · Muda a cada luta". Escolher um item manualmente desliga o aleatório daquela categoria.
- Sorteio: armas e acessórios (inclui personalizados), mapas (sem o Dojo de Treinamento), finalizações liberadas (sem "Nenhuma") e despertares existentes (sem "Nenhum"). A CPU em aleatório (arma, acessório, finalização) também não repete a da luta anterior.
- Sua escolha manual não é perdida: o sorteio vale só para a luta e, ao voltar ao menu, os valores fixos voltam. A tela de carregamento mostra "🎲 Arma · Mapa · Finalização · Despertar" sorteados. No treino só arma e acessório sorteiam. Estado salvo em ST 'rnd'.

## v1.9.51 — Parte 3: pular a finalização + contador de FPS
- Durante a cena de finalização aparece o botão "⏭ Pular" ao lado de Sair/Pausa. Pular encerra a cena na hora: para o som, toca o som de vitória, limpa partículas/sangue/cabeça/esqueleto, esconde o perdedor e segue para o próximo round ou resultado normalmente (o ponto da vitória já foi contado no KO).
- Opções > "Finalização e desempenho": Cena de finalização = "Sempre mostrar" (sem botão), "Permitir pular" (padrão) ou "Sempre pular" (não executa a cena; vai direto ao som de vitória). Contador de FPS na luta = Desligado (padrão) ou Ligado (número pequeno ao lado do placar do round, verde ≥50, amarelo ≥30, vermelho abaixo; atualiza a cada 0,5 s; pausa não conta).
- Código: finEnd(F) compartilhado entre o fim natural e o pulo; skipFin(); fpsU(t) no começo do loop; OPT.fsk ('s'|'p'|'x') e OPT.fps ('n'|'s').

## v1.9.52 — Correções da Parte 3 (pular finalização)
- `www/fight.js`, Katana: pular agora deixa o mesmo estado final do fim natural (corpo no chão e cabeça solta pousada no chão, mesmo se pular antes do corte). Antes o perdedor sumia. Nas outras finalizações o perdedor continua sumindo.
- `www/fight.js`, `skipFin()`: zera a pose de ataque do vencedor e o estado de dano do perdedor (antes ficavam congelados até o próximo round) e marca a vitória do vencedor.
- `www/custom.js`: novo gancho `BRC.fend(F)`, chamado ao pular uma finalização personalizada (id >= 100); limpa ações, cortes, mordidas, textos, escurecimento, zoom e flash da cena. Auditoria: todo o estado das finalizações personalizadas fica no objeto da cena (F), então nada vaza para o próximo round.
- O jogo não tem tela de resultado (os rounds seguem sem fim; sai-se pelo botão Sair). A verificação do "último round" virou teste de vários rounds seguidos pulando a finalização e depois sair da luta.
- Teste automático novo: `tools/sim/test_skip.py`. Versão 1.9.52.
