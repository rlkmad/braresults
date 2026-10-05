# Braresults — ideias e melhorias

Legenda: ✅ feito (até a v1.5.0) · 🟡 parcial · ⬜ pendente

## Correções e infraestrutura
- ✅ **Atualização do APK falha** (CI gera chave debug nova a cada build; Android recusa instalar por cima e o usuário perde favoritos e linha do tempo). Solução: keystore fixa nos Secrets, assinar o release e injetar `versionCode`/`versionName` do `package.json`. Secrets: `KEYSTORE_BASE64`, `KEYSTORE_PASSWORD`, `KEY_ALIAS`, `KEY_PASSWORD`. Sem eles o CI cai no APK debug.
- ✅ **Notificação duplicada** (v1.4.4): o app avisa o runner que está aberto (`fg`, batimento de 60 s) e o runner não notifica nesse caso; ao voltar do segundo plano o app não repete a notificação do sistema do que o runner já avisou.
- ✅ **Tela recarrega a cada 10 s**: `load(true)` sempre chamava `render()`, derrubando foco/teclado da busca, fechando selects e recarregando fotos. Agora só renderiza quando `r.tse` muda.
- ✅ **Typo em `intro.js`**: `g.g.beginPath()` → `g.beginPath()` (quebrava o confete aos 2 s).
- ✅ **Dois pedidos de permissão de notificação** (`askFirst` aos 2,5 s e `map.js` aos 3,5 s). Agora só pede ao favoritar ou ao ligar as notificações.
- ⬜ **Código duplicado**: `ver()`, `evs()` e `snapOf()` existem em `index.html` e `runner.js` e já divergem (runner sem o caso vagas; snapshot com 15 candidatos no runner e 30 no app). Criar um módulo único empacotado nos dois lados.
- 🟡 **Versões fora de sincronia**: README (v1.2), `package.json` (1.4.0), User-Agent (1.3). Alinhados em 1.4.5 e CI usa `npm ci` quando há lock. Falta: gerar e enviar `package-lock.json` (`npm install` local) e fixar versões.
- ✅ **Polling nunca para**: com `sp >= 100` o intervalo do app é ×6 e o do mapa 1 a cada 10 ciclos; backoff até ×4 quando o TSE não muda; no quadro (`loadPan`, v1.4.4) o intervalo cresce até ×4 quando nada muda e vai a ×10 quando todos os cargos estão decididos.

## Funções novas
- ⬜ **Projeção por estado** (maior impacto): hoje usa razão global `rest = va·(100−sp)/sp·1,2`. Projetar cada UF separadamente com `sp` e `va` já carregados no mapa e somar. Mais realista quando faltam estados de perfil diferente e o exterior (chega tarde).
- 🟡 **O que notificar**: feito (v1.4.4): só resultado confirmado pelo TSE (projeção não notifica) e horário silencioso em Ajustes (o que acontece nele vira um resumo no fim). Falta: alertas por favorito (ligar/desligar cada um).
- ✅ **Tocar na notificação abre o favorito certo** (v1.4.3): listener `localNotificationActionPerformed`; a notificação leva o favorito em `extra`. Se o runner não repassar o `extra`, o app procura o favorito pelo nome no texto.
- ✅ **Botão voltar do Android** (v1.4.3, plugin `@capacitor/app`): fecha imagem/aviso, desfaz zoom, para o replay, volta no mapa (município → estado → Brasil), sai do ponto antigo da linha do tempo, volta para a aba Resultados e, por último, minimiza o app.
- ✅ **Gráfico da evolução** (v1.4.5): eixo X por horário, eixos com valores, toque/arraste para ver os valores e três modos: votos %, votos válidos por minuto e diferença entre 1º e 2º (`lote3.js`).
- ⬜ **Deputados**: hoje só "X de Y vagas definidas". Estimar por quociente eleitoral e sobras (a maior das funções).
- ⬜ **Widget ou notificação fixa** com o placar do favorito.
- ⬜ **Mapa — cidades**: só colorem após tocar em cada uma e mostram só 4 candidatos. Carregar sob demanda as cidades visíveis, respeitando o limite de 100 req/s do TSE.
- ✅ **Mapa — estados ainda apurando** (v1.4.4): botão **Apurando** no mapa; amarelo mais forte quanto mais falta, cinza em 100%.
- ✅ **Modo leve** (v1.4.3; Ajustes → Modo leve: Automático/Ligado/Desligado, o automático segue o `prefers-reduced-motion`). Desliga blur, fundo animado, SVG girando, números que contam, confete e animação do mapa. Antes: desligar blur, fundo animado e SVG girando (pesam em Android fraco) com interruptor em Ajustes; respeitar `prefers-reduced-motion` em todo o tema (hoje só a abertura respeita).
- 🟡 **Replay da apuração** (v1.5.0): player flutuante com barra arrastável, marcos (liderança, eleito, 2º turno), pulo entre marcos, ½×–8×, pausa maior nos marcos e variação de votos por ponto. Mapa usa o registro por UF mais próximo (`tm:`, até 80 pontos, só com o app aberto). Falta: municípios no replay, exportar o replay (GIF/vídeo) e migrar o registro para IndexedDB.
- ✅ **Comparar** (v1.4.5): na aba Análise, dois estados ou cidades lado a lado, na disputa atual (apurado, comparecimento, abstenção e os 4 primeiros de cada lado, com diferença em p.p.).

## Qualidade e manutenção
- ⬜ **Armazenamento**: linha do tempo (até 250 snapshots × 30 candidatos por seleção) enche o localStorage e o código só "limpa tudo" ao estourar. Migrar para IndexedDB ou `@capacitor/preferences`.
- ⬜ **Estrutura**: `index.html` com 37 KB inline e `render()` sobrescrito por três arquivos (R0, R1…) é frágil. Quebrar em módulos (Vite) e, se der, TypeScript.
- ⬜ **Testes** de `ver()`/projeção com JSONs reais do TSE (parte mais sensível).
- 🟡 **Acessibilidade**: `aria-live` no toast feito (v1.4.3); contraste do tema claro corrigido (v1.4.6: verde e amarelo escurecidos para ≥ 4,5:1). Falta: alternativa em lista para o mapa.
- ✅ **Compatibilidade**: fallback de `ctx.roundRect` (v1.4.3) e remoção do código morto de compartilhamento em texto no `fx.js` (v1.4.6).
