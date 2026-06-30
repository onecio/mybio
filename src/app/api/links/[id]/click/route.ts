import { NextResponse } from "next/server";

import { getSafeHttpUrl } from "@/lib/security/url";
import { createSupabasePublicClient } from "@/lib/supabase/public";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const requestUrl = new URL(request.url);
  const fallbackUrl = new URL("/", requestUrl.origin);
  const referer = request.headers.get("referer");
  const userAgent = request.headers.get("user-agent");
  const supabase = createSupabasePublicClient();

  if (!supabase) {
    return NextResponse.redirect(fallbackUrl);
  }

  const { data: resolvedDestination } = await supabase.rpc("resolve_public_link", {
    link_id: id,
  } as never);
  const destination = getSafeHttpUrl(resolvedDestination);

  if (!destination) {
    return NextResponse.redirect(fallbackUrl);
  }

  await supabase.rpc(
    "increment_link_click",
    {
      link_id: id,
      request_referer: referer,
      request_user_agent: userAgent,
      request_country: null,
      request_city: null,
    } as never,
  );

  return NextResponse.redirect(destination, 307);
}
