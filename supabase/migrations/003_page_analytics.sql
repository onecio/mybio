create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profile_pages(id) on delete cascade,
  visitor_hash text not null,
  viewed_on date not null default current_date,
  viewed_at timestamptz not null default now(),
  referer text,
  user_agent text,
  constraint page_views_daily_visitor unique (profile_id, visitor_hash, viewed_on)
);

create index if not exists idx_page_views_profile_viewed_at
on public.page_views(profile_id, viewed_at desc);

alter table public.page_views enable row level security;

drop policy if exists "page_views_select_owner" on public.page_views;
create policy "page_views_select_owner"
on public.page_views
for select
to authenticated
using (
  exists (
    select 1 from public.profile_pages pp
    where pp.id = page_views.profile_id and pp.user_id = auth.uid()
  )
);

create or replace function public.record_profile_view(
  profile_username text,
  request_visitor_hash text,
  request_referer text default null,
  request_user_agent text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  target_profile_id uuid;
  inserted_id uuid;
begin
  select id into target_profile_id
  from public.profile_pages
  where username = record_profile_view.profile_username
    and is_published = true
  limit 1;

  if target_profile_id is null or length(request_visitor_hash) < 32 then
    return jsonb_build_object('success', false);
  end if;

  insert into public.page_views (profile_id, visitor_hash, referer, user_agent)
  values (
    target_profile_id,
    left(request_visitor_hash, 128),
    left(request_referer, 2048),
    left(request_user_agent, 512)
  )
  on conflict (profile_id, visitor_hash, viewed_on) do nothing
  returning id into inserted_id;

  return jsonb_build_object('success', true, 'recorded', inserted_id is not null);
end;
$$;

create or replace view public.analytics_summary_view
with (security_invoker = true) as
select
  pp.id as profile_id,
  coalesce(clicks.total_clicks, 0)::int as total_clicks,
  coalesce(clicks.clicks_today, 0)::int as clicks_today,
  coalesce(clicks.clicks_last_7_days, 0)::int as clicks_last_7_days,
  coalesce(clicks.clicks_last_30_days, 0)::int as clicks_last_30_days,
  coalesce(views.total_views, 0)::int as total_views,
  coalesce(views.views_today, 0)::int as views_today,
  coalesce(views.views_last_7_days, 0)::int as views_last_7_days,
  coalesce(views.views_last_30_days, 0)::int as views_last_30_days
from public.profile_pages pp
left join lateral (
  select
    count(lc.id) as total_clicks,
    count(lc.id) filter (where lc.clicked_at >= date_trunc('day', now())) as clicks_today,
    count(lc.id) filter (where lc.clicked_at >= now() - interval '7 days') as clicks_last_7_days,
    count(lc.id) filter (where lc.clicked_at >= now() - interval '30 days') as clicks_last_30_days
  from public.profile_links pl
  left join public.link_clicks lc on lc.link_id = pl.id
  where pl.profile_id = pp.id
) clicks on true
left join lateral (
  select
    count(pv.id) as total_views,
    count(pv.id) filter (where pv.viewed_at >= date_trunc('day', now())) as views_today,
    count(pv.id) filter (where pv.viewed_at >= now() - interval '7 days') as views_last_7_days,
    count(pv.id) filter (where pv.viewed_at >= now() - interval '30 days') as views_last_30_days
  from public.page_views pv
  where pv.profile_id = pp.id
) views on true;

revoke all on public.analytics_summary_view from anon, authenticated;
grant select on public.analytics_summary_view to service_role;
grant execute on function public.record_profile_view(text, text, text, text) to anon, authenticated, service_role;
