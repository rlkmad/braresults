# Braresults — apuração das Eleições 2026

App Android (Capacitor). A interface fica em `www/` (HTML/CSS/JS puro) e busca os dados direto do TSE pelo HTTP nativo (sem CORS). Não usa nenhum servidor próprio.

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
