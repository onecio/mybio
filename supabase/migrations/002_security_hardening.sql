-- Security hardening for the existing MyBio project.

alter view public.public_profile_view set (security_invoker = true);
alter view public.dashboard_profile_view set (security_invoker = true);
alter view public.analytics_summary_view set (security_invoker = true);

alter table public.profile_links add column if not exists description text not null default '';
alter table public.profile_links add column if not exists thumbnail_url text;
alter table public.profile_links add column if not exists is_featured boolean not null default false;
alter table public.profile_links add column if not exists scheduled_at timestamptz;
alter table public.profile_links add column if not exists expires_at timestamptz;

create or replace view public.public_profile_view
with (security_invoker = true) as
select
  pp.id,
  pp.user_id,
  pp.username,
  coalesce(pp.title, 'Meu MyBio') as title,
  pp.description,
  pp.avatar_url,
  jsonb_build_object('id', t.id, 'name', t.name, 'config', t.config) as theme,
  coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'id', pl.id,
        'title', pl.title,
        'url', pl.url,
        'description', pl.description,
        'icon', pl.icon,
        'thumbnail_url', pl.thumbnail_url,
        'is_featured', pl.is_featured,
        'position', pl.position
      ) order by pl.position
    )
    from public.profile_links pl
    where pl.profile_id = pp.id
      and pl.is_active = true
      and (pl.scheduled_at is null or pl.scheduled_at <= now())
      and (pl.expires_at is null or pl.expires_at > now())
  ), '[]'::jsonb) as links,
  coalesce((
    select jsonb_agg(
      jsonb_build_object('id', ps.id, 'platform', ps.platform, 'url', ps.url)
      order by ps.platform
    )
    from public.profile_socials ps
    where ps.profile_id = pp.id
  ), '[]'::jsonb) as socials
from public.profile_pages pp
left join public.themes t on t.id = pp.theme_id
where pp.is_published = true;

revoke all on public.dashboard_profile_view from anon, authenticated;
revoke all on public.analytics_summary_view from anon, authenticated;

drop policy if exists "profile_links_select_public_or_owner" on public.profile_links;
create policy "profile_links_select_public_or_owner"
on public.profile_links
for select
to anon, authenticated
using (
  (
    profile_links.is_active = true
    and (profile_links.scheduled_at is null or profile_links.scheduled_at <= now())
    and (profile_links.expires_at is null or profile_links.expires_at > now())
    and exists (
      select 1 from public.profile_pages pp
      where pp.id = profile_links.profile_id and pp.is_published = true
    )
  )
  or exists (
    select 1 from public.profile_pages pp
    where pp.id = profile_links.profile_id and pp.user_id = auth.uid()
  )
);

drop policy if exists "link_clicks_insert_public" on public.link_clicks;

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
  if not exists (
    select 1
    from public.profile_links pl
    join public.profile_pages pp on pp.id = pl.profile_id
    where pl.id = increment_link_click.link_id
      and pl.is_active = true
      and pp.is_published = true
      and (pl.scheduled_at is null or pl.scheduled_at <= now())
      and (pl.expires_at is null or pl.expires_at > now())
  ) then
    return jsonb_build_object('success', false, 'reason', 'link_not_available');
  end if;

  insert into public.link_clicks (link_id, referer, user_agent, country, city)
  values (
    increment_link_click.link_id,
    left(increment_link_click.request_referer, 2048),
    left(increment_link_click.request_user_agent, 512),
    increment_link_click.request_country,
    increment_link_click.request_city
  )
  returning id into inserted_id;

  return jsonb_build_object('success', true, 'id', inserted_id);
end;
$$;

create or replace function public.resolve_public_link(link_id uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select pl.url
  from public.profile_links pl
  join public.profile_pages pp on pp.id = pl.profile_id
  where pl.id = resolve_public_link.link_id
    and pl.is_active = true
    and pp.is_published = true
    and (pl.scheduled_at is null or pl.scheduled_at <= now())
    and (pl.expires_at is null or pl.expires_at > now())
    and pl.url ~* '^https?://'
  limit 1
$$;

grant execute on function public.resolve_public_link(uuid) to anon, authenticated, service_role;

create or replace function public.reorder_profile_links(ordered_ids uuid[])
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  owned_profile_id uuid;
  expected_count integer;
begin
  select id into owned_profile_id
  from public.profile_pages
  where user_id = auth.uid()
  limit 1;

  if owned_profile_id is null then
    raise exception 'profile_not_found';
  end if;

  select count(*) into expected_count
  from public.profile_links
  where profile_id = owned_profile_id;

  if cardinality(ordered_ids) <> expected_count
    or (select count(distinct id) from unnest(ordered_ids) as id) <> expected_count
    or (select count(*) from public.profile_links where profile_id = owned_profile_id and id = any(ordered_ids)) <> expected_count then
    raise exception 'invalid_link_order';
  end if;

  update public.profile_links
  set position = position + 10000
  where profile_id = owned_profile_id;

  update public.profile_links pl
  set position = ordered.position - 1
  from unnest(ordered_ids) with ordinality as ordered(id, position)
  where pl.id = ordered.id and pl.profile_id = owned_profile_id;
end;
$$;

grant execute on function public.reorder_profile_links(uuid[]) to authenticated, service_role;
