import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const requestUrl = new URL(request.url);
  const fallbackUrl = requestUrl.searchParams.get("url") ?? "/";
  const referer = request.headers.get("referer");
  const userAgent = request.headers.get("user-agent");
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
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

  return NextResponse.redirect(fallbackUrl);
}
