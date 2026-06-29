-- MyBio base schema
-- Generated for Supabase / PostgreSQL

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  name text not null default '',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.themes (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  preview_image text,
  config jsonb not null default '{}'::jsonb,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profile_pages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  username text unique not null,
  title text,
  description text,
  avatar_url text,
  theme_id uuid references public.themes(id) on delete set null,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profile_pages_username_format check (username ~ '^[a-zA-Z0-9_-]{3,30}$')
);

create table if not exists public.profile_links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profile_pages(id) on delete cascade,
  title text not null,
  url text not null,
  icon text,
  position integer not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profile_links_unique_position unique (profile_id, position)
);

create table if not exists public.profile_socials (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profile_pages(id) on delete cascade,
  platform text not null,
  url text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profile_socials_unique_platform unique (profile_id, platform)
);

create table if not exists public.link_clicks (
  id uuid primary key default gen_random_uuid(),
  link_id uuid not null references public.profile_links(id) on delete cascade,
  clicked_at timestamptz not null default now(),
  country text,
  city text,
  referer text,
  user_agent text
);

create index if not exists idx_profile_pages_user_id on public.profile_pages(user_id);
create unique index if not exists idx_profile_pages_username on public.profile_pages(username);
create index if not exists idx_profile_pages_theme_id on public.profile_pages(theme_id);
create index if not exists idx_profile_links_profile_position on public.profile_links(profile_id, position);
create index if not exists idx_profile_socials_profile_id on public.profile_socials(profile_id);
create index if not exists idx_link_clicks_link_id on public.link_clicks(link_id);
create index if not exists idx_link_clicks_clicked_at on public.link_clicks(clicked_at);
create index if not exists idx_link_clicks_link_clicked_at on public.link_clicks(link_id, clicked_at);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_themes_updated_at on public.themes;
create trigger set_themes_updated_at
before update on public.themes
for each row execute function public.set_updated_at();

drop trigger if exists set_profile_pages_updated_at on public.profile_pages;
create trigger set_profile_pages_updated_at
before update on public.profile_pages
for each row execute function public.set_updated_at();

drop trigger if exists set_profile_links_updated_at on public.profile_links;
create trigger set_profile_links_updated_at
before update on public.profile_links
for each row execute function public.set_updated_at();

drop trigger if exists set_profile_socials_updated_at on public.profile_socials;
create trigger set_profile_socials_updated_at
before update on public.profile_socials
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  generated_username text;
  default_theme_id uuid;
begin
  select id into default_theme_id
  from public.themes
  where name = 'Amber Professional'
  limit 1;

  generated_username := lower(
    regexp_replace(
      coalesce(
        new.raw_user_meta_data ->> 'user_name',
        split_part(new.email, '@', 1),
        'mybio_user'
      ),
      '[^a-zA-Z0-9_-]+',
      '',
      'g'
    )
  );

  if generated_username is null or length(generated_username) < 3 then
    generated_username := 'user' || substring(new.id::text from 1 for 8);
  end if;

  insert into public.profiles (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1), 'Novo usuário'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update set
    email = excluded.email,
    name = excluded.name,
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url);

  insert into public.profile_pages (
    user_id,
    username,
    title,
    description,
    avatar_url,
    theme_id,
    is_published
  )
  values (
    new.id,
    generated_username,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    'Minha página MyBio',
    new.raw_user_meta_data ->> 'avatar_url',
    default_theme_id,
    true
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

insert into public.themes (name, description, preview_image, config, is_public)
values
  (
    'Amber Professional',
    'Tema premium claro com destaque em amber.',
    null,
    jsonb_build_object(
      'primaryColor', '#f59e0b',
      'backgroundColor', '#fffaf1',
      'surfaceColor', '#ffffff',
      'textColor', '#1c1917',
      'fontFamily', 'Manrope',
      'borderRadius', '24px',
      'buttonStyle', 'pill'
    ),
    true
  ),
  (
    'Sky Professional',
    'Tema claro, limpo e editorial com acento em sky.',
    null,
    jsonb_build_object(
      'primaryColor', '#38bdf8',
      'backgroundColor', '#f5fbff',
      'surfaceColor', '#ffffff',
      'textColor', '#082f49',
      'fontFamily', 'Manrope',
      'borderRadius', '24px',
      'buttonStyle', 'pill'
    ),
    true
  ),
  (
    'Violet Professional',
    'Tema criativo com acento violeta.',
    null,
    jsonb_build_object(
      'primaryColor', '#8b5cf6',
      'backgroundColor', '#f7f5ff',
      'surfaceColor', '#ffffff',
      'textColor', '#2e1065',
      'fontFamily', 'Manrope',
      'borderRadius', '24px',
      'buttonStyle', 'pill'
    ),
    true
  )
on conflict (name) do update set
  description = excluded.description,
  config = excluded.config,
  is_public = excluded.is_public,
  updated_at = now();

alter table public.profiles enable row level security;
alter table public.themes enable row level security;
alter table public.profile_pages enable row level security;
alter table public.profile_links enable row level security;
alter table public.profile_socials enable row level security;
alter table public.link_clicks enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "themes_select_public" on public.themes;
create policy "themes_select_public"
on public.themes
for select
to anon, authenticated
using (is_public = true);

drop policy if exists "themes_insert_service" on public.themes;
create policy "themes_insert_service"
on public.themes
for insert
to service_role
with check (true);

drop policy if exists "themes_update_service" on public.themes;
create policy "themes_update_service"
on public.themes
for update
to service_role
using (true)
with check (true);

drop policy if exists "themes_delete_service" on public.themes;
create policy "themes_delete_service"
on public.themes
for delete
to service_role
using (true);

drop policy if exists "profile_pages_select_public" on public.profile_pages;
create policy "profile_pages_select_public"
on public.profile_pages
for select
to anon, authenticated
using (is_published = true or auth.uid() = user_id);

drop policy if exists "profile_pages_insert_own" on public.profile_pages;
create policy "profile_pages_insert_own"
on public.profile_pages
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "profile_pages_update_own" on public.profile_pages;
create policy "profile_pages_update_own"
on public.profile_pages
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "profile_pages_delete_own" on public.profile_pages;
create policy "profile_pages_delete_own"
on public.profile_pages
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "profile_links_select_public_or_owner" on public.profile_links;
create policy "profile_links_select_public_or_owner"
on public.profile_links
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.profile_pages pp
    where pp.id = profile_links.profile_id
      and (pp.is_published = true or pp.user_id = auth.uid())
  )
);

drop policy if exists "profile_links_insert_own" on public.profile_links;
create policy "profile_links_insert_own"
on public.profile_links
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profile_pages pp
    where pp.id = profile_links.profile_id
      and pp.user_id = auth.uid()
  )
);

drop policy if exists "profile_links_update_own" on public.profile_links;
create policy "profile_links_update_own"
on public.profile_links
for update
to authenticated
using (
  exists (
    select 1
    from public.profile_pages pp
    where pp.id = profile_links.profile_id
      and pp.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.profile_pages pp
    where pp.id = profile_links.profile_id
      and pp.user_id = auth.uid()
  )
);

drop policy if exists "profile_links_delete_own" on public.profile_links;
create policy "profile_links_delete_own"
on public.profile_links
for delete
to authenticated
using (
  exists (
    select 1
    from public.profile_pages pp
    where pp.id = profile_links.profile_id
      and pp.user_id = auth.uid()
  )
);

drop policy if exists "profile_socials_select_public_or_owner" on public.profile_socials;
create policy "profile_socials_select_public_or_owner"
on public.profile_socials
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.profile_pages pp
    where pp.id = profile_socials.profile_id
      and (pp.is_published = true or pp.user_id = auth.uid())
  )
);

drop policy if exists "profile_socials_insert_own" on public.profile_socials;
create policy "profile_socials_insert_own"
on public.profile_socials
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profile_pages pp
    where pp.id = profile_socials.profile_id
      and pp.user_id = auth.uid()
  )
);

drop policy if exists "profile_socials_update_own" on public.profile_socials;
create policy "profile_socials_update_own"
on public.profile_socials
for update
to authenticated
using (
  exists (
    select 1
    from public.profile_pages pp
    where pp.id = profile_socials.profile_id
      and pp.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.profile_pages pp
    where pp.id = profile_socials.profile_id
      and pp.user_id = auth.uid()
  )
);

drop policy if exists "profile_socials_delete_own" on public.profile_socials;
create policy "profile_socials_delete_own"
on public.profile_socials
for delete
to authenticated
using (
  exists (
    select 1
    from public.profile_pages pp
    where pp.id = profile_socials.profile_id
      and pp.user_id = auth.uid()
  )
);

drop policy if exists "link_clicks_insert_public" on public.link_clicks;
create policy "link_clicks_insert_public"
on public.link_clicks
for insert
to anon, authenticated
with check (true);

drop policy if exists "link_clicks_select_owner" on public.link_clicks;
create policy "link_clicks_select_owner"
on public.link_clicks
for select
to authenticated
using (
  exists (
    select 1
    from public.profile_links pl
    join public.profile_pages pp on pp.id = pl.profile_id
    where pl.id = link_clicks.link_id
      and pp.user_id = auth.uid()
  )
);

create or replace view public.public_profile_view as
select
  pp.id,
  pp.user_id,
  pp.username,
  coalesce(pp.title, pr.name) as title,
  pp.description,
  coalesce(pp.avatar_url, pr.avatar_url) as avatar_url,
  jsonb_build_object(
    'id', t.id,
    'name', t.name,
    'config', t.config
  ) as theme,
  coalesce(
    (
      select jsonb_agg(
        jsonb_build_object(
          'id', pl.id,
          'title', pl.title,
          'url', pl.url,
          'icon', pl.icon,
          'position', pl.position
        )
        order by pl.position
      )
      from public.profile_links pl
      where pl.profile_id = pp.id
        and pl.is_active = true
    ),
    '[]'::jsonb
  ) as links,
  coalesce(
    (
      select jsonb_agg(
        jsonb_build_object(
          'id', ps.id,
          'platform', ps.platform,
          'url', ps.url
        )
        order by ps.platform
      )
      from public.profile_socials ps
      where ps.profile_id = pp.id
    ),
    '[]'::jsonb
  ) as socials
from public.profile_pages pp
join public.profiles pr on pr.id = pp.user_id
left join public.themes t on t.id = pp.theme_id
where pp.is_published = true;

create or replace view public.dashboard_profile_view as
select
  pp.id as profile_id,
  pp.user_id,
  pp.username,
  coalesce(pp.title, pr.name) as title,
  pp.description,
  coalesce(pp.avatar_url, pr.avatar_url) as avatar_url,
  pp.theme_id,
  coalesce(link_counts.total_links, 0) as total_links,
  coalesce(social_counts.total_socials, 0) as total_socials,
  coalesce(click_counts.total_clicks, 0) as total_clicks,
  pp.created_at
from public.profile_pages pp
join public.profiles pr on pr.id = pp.user_id
left join (
  select profile_id, count(*)::int as total_links
  from public.profile_links
  group by profile_id
) link_counts on link_counts.profile_id = pp.id
left join (
  select profile_id, count(*)::int as total_socials
  from public.profile_socials
  group by profile_id
) social_counts on social_counts.profile_id = pp.id
left join (
  select pl.profile_id, count(lc.id)::int as total_clicks
  from public.profile_links pl
  left join public.link_clicks lc on lc.link_id = pl.id
  group by pl.profile_id
) click_counts on click_counts.profile_id = pp.id;

create or replace view public.analytics_summary_view as
select
  pp.id as profile_id,
  coalesce(count(lc.id), 0)::int as total_clicks,
  coalesce(count(*) filter (where lc.clicked_at >= date_trunc('day', now())), 0)::int as clicks_today,
  coalesce(count(*) filter (where lc.clicked_at >= now() - interval '7 days'), 0)::int as clicks_last_7_days,
  coalesce(count(*) filter (where lc.clicked_at >= now() - interval '30 days'), 0)::int as clicks_last_30_days
from public.profile_pages pp
left join public.profile_links pl on pl.profile_id = pp.id
left join public.link_clicks lc on lc.link_id = pl.id
group by pp.id;

create or replace function public.get_profile_by_username(username text)
returns jsonb
language sql
security definer
set search_path = public
as $$
  select to_jsonb(ppv)
  from public.public_profile_view ppv
  where ppv.username = get_profile_by_username.username
  limit 1
$$;

create or replace function public.get_dashboard()
returns jsonb
language sql
security definer
set search_path = public
as $$
  with me as (
    select *
    from public.dashboard_profile_view
    where user_id = auth.uid()
    limit 1
  ),
  page_ref as (
    select id
    from public.profile_pages
    where user_id = auth.uid()
    limit 1
  )
  select jsonb_build_object(
    'profile', (select to_jsonb(me) from me),
    'links', coalesce((
      select jsonb_agg(to_jsonb(pl) order by pl.position)
      from public.profile_links pl
      join page_ref pr on pr.id = pl.profile_id
    ), '[]'::jsonb),
    'socials', coalesce((
      select jsonb_agg(to_jsonb(ps) order by ps.platform)
      from public.profile_socials ps
      join page_ref pr on pr.id = ps.profile_id
    ), '[]'::jsonb),
    'analytics', (
      select to_jsonb(av)
      from public.analytics_summary_view av
      join page_ref pr on pr.id = av.profile_id
      limit 1
    )
  )
$$;

create or replace function public.increment_link_click(
  link_id uuid,
  request_referer text default null,
  request_user_agent text default null,
  request_country text default null,
  request_city text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_id uuid;
begin
  insert into public.link_clicks (
    link_id,
    referer,
    user_agent,
    country,
    city
  )
  values (
    increment_link_click.link_id,
    request_referer,
    request_user_agent,
    request_country,
    request_city
  )
  returning id into inserted_id;

  return jsonb_build_object(
    'success', true,
    'id', inserted_id
  );
end;
$$;

grant usage on schema public to anon, authenticated, service_role;
grant select on public.public_profile_view to anon, authenticated, service_role;
grant select on public.dashboard_profile_view to authenticated, service_role;
grant select on public.analytics_summary_view to authenticated, service_role;
grant execute on function public.get_profile_by_username(text) to anon, authenticated, service_role;
grant execute on function public.get_dashboard() to authenticated, service_role;
grant execute on function public.increment_link_click(uuid, text, text, text, text) to anon, authenticated, service_role;
