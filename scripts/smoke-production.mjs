const baseUrl = (process.env.SMOKE_BASE_URL ?? "https://mybio.ecomnix.com.br").replace(/\/$/, "");
const profilePath = process.env.SMOKE_PROFILE_PATH ?? "/onecio";

const checks = [];

function addCheck(name, ok, details) {
  checks.push({ name, ok, details });
}

async function readText(url, init) {
  const response = await fetch(url, init);
  const text = await response.text();
  return { response, text };
}

async function main() {
  const home = await readText(`${baseUrl}/`);
  addCheck("home_status", home.response.ok, `HTTP ${home.response.status}`);
  addCheck(
    "home_markers",
    home.text.includes("Menos ruído. Mais clique.") && home.text.includes("Entrar no painel"),
    "Homepage deve expor a nova mensagem principal e CTA do painel.",
  );

  const profile = await readText(`${baseUrl}${profilePath}`);
  addCheck("profile_status", profile.response.ok, `HTTP ${profile.response.status}`);
  addCheck(
    "profile_markers",
    profile.text.includes("Compartilhar") && profile.text.includes("@"),
    "Página pública deve exibir ação de compartilhamento e identificador do perfil.",
  );

  const og = await fetch(`${baseUrl}/api/og/${profilePath.replace(/^\//, "")}`);
  addCheck("og_status", og.ok, `HTTP ${og.status}`);
  addCheck(
    "og_content_type",
    (og.headers.get("content-type") ?? "").includes("image/png"),
    `content-type=${og.headers.get("content-type") ?? "ausente"}`,
  );

  const health = await fetch(`${baseUrl}/api/health`, { method: "HEAD" });
  addCheck("health_status", health.ok, `HTTP ${health.status}`);
  addCheck(
    "security_headers",
    Boolean(health.headers.get("strict-transport-security")) &&
      Boolean(health.headers.get("content-security-policy")),
    "Health endpoint deve responder com HSTS e CSP.",
  );

  const failed = checks.filter((check) => !check.ok);
  console.log(JSON.stringify({ baseUrl, profilePath, checks }, null, 2));

  if (failed.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
