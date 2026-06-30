import { NextResponse } from "next/server";

import { createDailyVisitorHash } from "@/lib/security/visitor";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;

  if (!/^[a-z0-9_-]{3,30}$/.test(username)) {
    return NextResponse.json({ recorded: false }, { status: 400 });
  }

  const visitorHash = createDailyVisitorHash(request, `profile:${username}`);
  const supabase = await createSupabaseServerClient();

  if (!visitorHash || !supabase) {
    return NextResponse.json({ recorded: false }, { status: 503 });
  }

  const { error } = await supabase.rpc("record_profile_view", {
    profile_username: username,
    request_visitor_hash: visitorHash,
    request_referer: request.headers.get("referer"),
    request_user_agent: request.headers.get("user-agent"),
  } as never);

  return NextResponse.json(
    { recorded: !error },
    { status: error ? 400 : 202, headers: { "Cache-Control": "no-store" } },
  );
}
