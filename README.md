# Braresults — apuração das Eleições 2026

App Android (Capacitor). A interface fica em `www/` (HTML/CSS/JS puro) e busca os dados direto do TSE pelo HTTP nativo (sem CORS). Não usa nenhum servidor próprio.

## Gerar o APK (sem instalar nada)
1. Crie um repositório no GitHub e envie o conteúdo desta pasta (inclusive `.github`).
2. Aba **Actions → Build APK → Run workflow** (também roda a cada envio).
3. Baixe **Braresults-APK** em *Artifacts*, extraia e instale o `Braresults.apk`.

## Gerar localmente
`npm install && npx cap add android && cp -r android-res/* android/app/src/main/res/ && npx cap sync android && cd android && ./gradlew assembleDebug`
(Node 20+, JDK 21 e Android SDK; adicione a permissão POST_NOTIFICATIONS ao AndroidManifest). APK em `android/app/build/outputs/apk/debug/`.

## Notificações e linha do tempo
- ★ no topo favorita a seleção atual. Em **Ajustes**, ligue as notificações.
- `www/runner.js` roda em segundo plano (~a cada 15 min, decisão do Android), consulta o TSE, guarda pontos na linha do tempo e notifica.
- Com o app aberto, avisos aparecem na tela e cada atualização do TSE entra na linha do tempo.

## Novidades da v1.2
- Visual novo: temas Neon, Brasil e Aurora (além de Automático/Escuro/Claro), fundo animado, números que contam, borda animada no líder, confete quando alguém é eleito, ícones próprios.
- Novas funções: compartilhar resultado (⤴), puxar para atualizar, selo AO VIVO / FINAL / OFFLINE.
- Dados do TSE: códigos do 2º turno lidos de `comum/config/ele-c.json` (campo `cdt2`), código do município com 5 dígitos, cache de 404 para não ser bloqueado pelo limite do TSE (100 req/s por IP; muitos 404 bloqueiam o IP por 10 min).
- Download do APK: aba **Releases** do repositório (além de Actions → Artifacts).
