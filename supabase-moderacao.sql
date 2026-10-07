-- Braresults — consultas de MODERAÇÃO (só você, no SQL Editor do Supabase). Rode uma de cada vez.
-- 1) Últimas criações enviadas
select id, tipo, nome, autor, tamanho_bytes, baixadas, denuncias, status, criado_em from public.creations order by criado_em desc limit 50;
-- 2) Mais denunciadas (5 ou mais já somem da biblioteca)
select id, tipo, nome, autor, denuncias, status from public.creations where denuncias > 0 order by denuncias desc;
-- 3) Remover uma criação (troque o id) — some para todos; quem já baixou mantém a cópia local
update public.creations set status = 'removido' where id = 'COLE-O-ID-AQUI';
-- 4) Remover tudo de um autor/apelido
update public.creations set status = 'removido' where autor = 'APELIDO';
-- 5) Recolocar uma criação denunciada por engano
update public.creations set denuncias = 0, status = 'aprovado' where id = 'COLE-O-ID-AQUI';
-- 6) Apagar de vez
delete from public.creations where id = 'COLE-O-ID-AQUI';
