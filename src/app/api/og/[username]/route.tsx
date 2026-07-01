import { ImageResponse } from "next/og";

import { getPublicProfileByUsername } from "@/lib/queries/mybio";

export const runtime = "nodejs";

const responseHeaders = {
  "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ username: string }> },
) {
  const { username } = await context.params;
  const profile = await getPublicProfileByUsername(username);

  if (!profile) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #0a3d3e 0%, #d9e3dd 100%)",
            color: "#ffffff",
            fontSize: 56,
            fontWeight: 700,
          }}
        >
          MyBio
        </div>
      ),
      { width: 1200, height: 630, headers: responseHeaders },
    );
  }

  const primaryLink = profile.links[0];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: `linear-gradient(135deg, ${profile.themeConfig.primaryColor} 0%, ${profile.themeConfig.backgroundColor} 100%)`,
          color: profile.themeConfig.textColor,
          padding: "56px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
            }}
          >
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatarUrl}
                alt=""
                width={116}
                height={116}
                style={{
                  borderRadius: 36,
                  objectFit: "cover",
                  border: "6px solid rgba(255,255,255,0.72)",
                }}
              />
            ) : (
              <div
                style={{
                  width: 116,
                  height: 116,
                  borderRadius: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(255,255,255,0.86)",
                  color: "#0f172a",
                  fontSize: 42,
                  fontWeight: 700,
                }}
              >
                {profile.initials}
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 760 }}>
              <div style={{ fontSize: 58, fontWeight: 700, lineHeight: 1 }}>{profile.title}</div>
              <div style={{ fontSize: 28, opacity: 0.72 }}>@{profile.username}</div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              padding: "12px 18px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.82)",
              color: "#0a3d3e",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            MyBio
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              fontSize: 34,
              lineHeight: 1.35,
              maxWidth: 980,
              opacity: 0.92,
            }}
          >
            {profile.description}
          </div>

          <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
            {profile.socials.slice(0, 4).map((social) => (
              <div
                key={social.id}
                style={{
                  display: "flex",
                  padding: "12px 18px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.78)",
                  fontSize: 22,
                  color: "#1f2937",
                }}
              >
                {social.handle}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 24,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 740 }}>
            <div style={{ fontSize: 22, letterSpacing: 2.2, textTransform: "uppercase", opacity: 0.7 }}>
              Link em destaque
            </div>
            <div style={{ fontSize: 34, fontWeight: 700 }}>
              {primaryLink?.title ?? "Página pronta para compartilhar"}
            </div>
            <div style={{ fontSize: 24, opacity: 0.78 }}>
              {primaryLink?.hostname ?? "Links, redes e contato em um único lugar"}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              alignItems: "flex-end",
            }}
          >
            <div style={{ fontSize: 22, opacity: 0.72 }}>mybio.ecomnix.com.br/{profile.username}</div>
            <div style={{ fontSize: 22, opacity: 0.72 }}>
              {profile.links.length} links • {profile.socials.length} redes
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, headers: responseHeaders },
  );
}
