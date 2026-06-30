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
