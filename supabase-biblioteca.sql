-- Braresults — Biblioteca (v1.9.9: leitura + envio + despertar). Cole TUDO no SQL Editor do Supabase e toque em Run. Pode rodar de novo sem problema.
-- Decisões: criações enviadas aparecem NA HORA (status 'aprovado'); só o dono modera (painel); autor = apelido livre.
create table if not exists public.creations (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('arma','acessorio','mapa','finalizacao','som','despertar')),
  nome text not null check (char_length(nome) between 1 and 24),
  autor text check (char_length(autor) <= 20),
  ver_min_app text not null default '1.9.0',
  tamanho_bytes integer not null check (tamanho_bytes between 1 and 200000),
  foto text check (char_length(foto) <= 60000),
  dados jsonb not null,
  hash text unique,
  status text not null default 'aprovado' check (status in ('pendente','aprovado','removido')),
  baixadas integer not null default 0,
  denuncias integer not null default 0,
  criado_em timestamptz not null default now()
);
alter table public.creations alter column status set default 'aprovado';
alter table public.creations drop constraint if exists creations_tipo_check;
alter table public.creations add constraint creations_tipo_check check (tipo in ('arma','acessorio','mapa','finalizacao','som','despertar'));
alter table public.creations drop constraint if exists creations_foto_img;
alter table public.creations add constraint creations_foto_img check (foto is null or foto ~ '^data:image/(webp|png|jpeg);base64,');
alter table public.creations drop constraint if exists creations_dados_tam;
alter table public.creations add constraint creations_dados_tam check (pg_column_size(dados) <= 200000);
alter table public.creations enable row level security;

-- LER: só aprovadas e com menos de 5 denúncias
drop policy if exists "ler aprovadas" on public.creations;
create policy "ler aprovadas" on public.creations for select to anon, authenticated
  using (status = 'aprovado' and denuncias < 5);

-- ENVIAR (usado na Etapa 4): entra direto como aprovada, sempre com contadores zerados
drop policy if exists "enviar pendente" on public.creations;
drop policy if exists "enviar aprovada" on public.creations;
create policy "enviar aprovada" on public.creations for insert to anon, authenticated
  with check (status = 'aprovado' and baixadas = 0 and denuncias = 0 and hash is not null and foto is not null);

grant select, insert on public.creations to anon, authenticated;

create or replace function public.contar_download(p_id uuid) returns void
language sql security definer set search_path = public as $$
  update public.creations set baixadas = baixadas + 1 where id = p_id and status = 'aprovado';
$$;
create or replace function public.denunciar(p_id uuid) returns void
language sql security definer set search_path = public as $$
  update public.creations set denuncias = denuncias + 1 where id = p_id and status = 'aprovado';
$$;
grant execute on function public.contar_download(uuid) to anon, authenticated;
grant execute on function public.denunciar(uuid) to anon, authenticated;
