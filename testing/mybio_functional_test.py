from __future__ import annotations

import json
import os
import time
import urllib.parse
import urllib.request
from pathlib import Path

from playwright.sync_api import TimeoutError as PlaywrightTimeoutError
from playwright.sync_api import sync_playwright


BASE_URL = os.environ.get("MYBIO_BASE_URL", "https://mybio.ecomnix.com.br")
SUPABASE_URL = os.environ.get("MYBIO_SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("MYBIO_SUPABASE_PUBLISHABLE_KEY", "")
RUN_ID = str(int(time.time()))
EMAIL = f"qa.{RUN_ID}@onecio.dev"
USERNAME = f"qa-{RUN_ID}"
PASSWORD = "Mybio#2026!"
NAME = "QA Fluxo MyBio"
HEADLINE = "Perfil validado em fluxo automatizado"
BIO = "Este perfil foi atualizado automaticamente durante o teste funcional completo do MyBio."

ARTIFACT_DIR = Path(r"C:\Users\oneci\AppData\Roaming\TRAE SOLO\ModularData\ai-agent\work-mode-projects\6a42db49feaa591488c86942\mybio-premium\testing\artifacts")
ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
SAMPLE_IMAGE = ARTIFACT_DIR / f"avatar-{RUN_ID}.jpg"
REPORT_PATH = ARTIFACT_DIR / f"report-{RUN_ID}.json"


def download_sample_image() -> Path:
    url = "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg"
    urllib.request.urlretrieve(url, SAMPLE_IMAGE)
    return SAMPLE_IMAGE


def get_json(url: str):
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise RuntimeError(
            "Defina MYBIO_SUPABASE_URL e MYBIO_SUPABASE_PUBLISHABLE_KEY antes de executar o teste funcional completo."
        )

    request = urllib.request.Request(
        url,
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json",
        },
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.loads(response.read().decode("utf-8"))


def screenshot(page, name: str) -> str:
    path = ARTIFACT_DIR / f"{RUN_ID}-{name}.png"
    page.screenshot(path=str(path), full_page=True)
    return str(path)


def wait_network(page):
    page.wait_for_load_state("domcontentloaded")
    try:
        page.wait_for_load_state("networkidle", timeout=15000)
    except PlaywrightTimeoutError:
        pass


def text_present(page, text: str) -> bool:
    try:
        return page.get_by_text(text, exact=False).first.is_visible(timeout=3000)
    except Exception:
        return False


def wait_for_submission_resolution(page, start_url: str, pending_texts: list[str], timeout_seconds: int = 60):
    deadline = time.time() + timeout_seconds

    while time.time() < deadline:
        current_url = page.url

        if current_url != start_url:
            wait_network(page)
            return

        pending_visible = any(text_present(page, pending) for pending in pending_texts)
        success_or_error_visible = any(
            text_present(page, marker)
            for marker in [
                "Conta criada",
                "Verifique seu e-mail",
                "Não foi possível",
                "error",
                "Erro",
                "inválido",
                "expirou",
            ]
        )

        if success_or_error_visible or not pending_visible:
            wait_network(page)
            return

        page.wait_for_timeout(1000)

    wait_network(page)


report: dict[str, object] = {
    "run_id": RUN_ID,
    "base_url": BASE_URL,
    "email": EMAIL,
    "username": USERNAME,
    "steps": [],
    "status": "running",
}


def add_step(name: str, ok: bool, details: str, extra: dict | None = None):
    item = {"step": name, "ok": ok, "details": details}
    if extra:
        item.update(extra)
    steps = report["steps"]
    assert isinstance(steps, list)
    steps.append(item)


def main():
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise RuntimeError(
            "Variáveis MYBIO_SUPABASE_URL e MYBIO_SUPABASE_PUBLISHABLE_KEY são obrigatórias para este fluxo."
        )

    download_sample_image()

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(ignore_https_errors=True)
        page = context.new_page()
        page.set_viewport_size({"width": 1440, "height": 1200})

        try:
            page.goto(f"{BASE_URL}/register", wait_until="domcontentloaded")
            wait_network(page)
            screenshot(page, "register-page")

            page.locator('input[name="name"]').fill(NAME)
            page.locator('input[name="username"]').fill(USERNAME)
            page.locator('input[name="email"]').fill(EMAIL)
            page.locator('input[name="password"]').fill(PASSWORD)
            page.locator('input[name="acceptTerms"]').check()
            register_start_url = page.url
            page.get_by_role("button", name="Criar conta premium").click()
            wait_for_submission_resolution(page, register_start_url, ["Criando conta..."], timeout_seconds=75)

            registration_url = page.url
            registration_shot = screenshot(page, "post-register")

            if "/dashboard" in registration_url:
                add_step(
                    "cadastro",
                    True,
                    "Cadastro concluiu com sessão ativa e redirecionou ao dashboard.",
                    {"url": registration_url, "screenshot": registration_shot},
                )
            else:
                add_step(
                    "cadastro",
                    True,
                    "Cadastro enviado. Foi necessário seguir com login explícito após o registro.",
                    {"url": registration_url, "screenshot": registration_shot},
                )
                page.goto(f"{BASE_URL}/login", wait_until="domcontentloaded")
                wait_network(page)
                page.locator('input[name="email"]').fill(EMAIL)
                page.locator('input[name="password"]').fill(PASSWORD)
                login_start_url = page.url
                page.get_by_role("button", name="Entrar no painel").click()
                wait_for_submission_resolution(page, login_start_url, ["Entrando..."], timeout_seconds=75)
                if "/dashboard" not in page.url:
                    raise RuntimeError(f"Login não concluiu após o cadastro. URL atual: {page.url}. Texto atual: {page.locator('body').inner_text()[:1200]}")

            add_step("login", True, "Login validado com sucesso no ambiente publicado.", {"url": page.url, "screenshot": screenshot(page, "dashboard-home")})

            page.goto(f"{BASE_URL}/dashboard/profile", wait_until="domcontentloaded")
            wait_network(page)
            screenshot(page, "profile-form")

            page.locator('input[name="name"]').fill(NAME)
            page.locator('input[name="headline"]').fill(HEADLINE)
            page.locator('textarea[name="bio"]').fill(BIO)

            page.locator('input[type="file"]').set_input_files(str(SAMPLE_IMAGE))
            page.get_by_text("Avatar enviado com sucesso", exact=False).wait_for(timeout=30000)

            avatar_url_value = page.locator('input[name="avatarUrl"]').input_value()
            if "res.cloudinary.com/dvh1ctdm1" not in avatar_url_value:
                raise RuntimeError(f"Upload do avatar não retornou URL esperada do Cloudinary: {avatar_url_value}")

            add_step(
                "upload_avatar",
                True,
                "Upload real do avatar para o Cloudinary validado.",
                {"avatar_url": avatar_url_value, "screenshot": screenshot(page, "avatar-uploaded")},
            )

            page.get_by_role("button", name="Salvar ajustes").click()
            wait_network(page)

            if not text_present(page, "Perfil salvo com sucesso."):
                raise RuntimeError("A mensagem de sucesso do salvamento do perfil não apareceu.")

            add_step("editar_perfil", True, "Perfil salvo com sucesso no dashboard.", {"url": page.url, "screenshot": screenshot(page, "profile-saved")})

            public_url = f"{BASE_URL}/{USERNAME}"
            page.goto(public_url, wait_until="domcontentloaded")
            wait_network(page)
            public_shot = screenshot(page, "public-page")

            if not text_present(page, HEADLINE):
                raise RuntimeError("O título/headline atualizado não apareceu na página pública.")

            if not text_present(page, BIO):
                raise RuntimeError("A bio atualizada não apareceu na página pública.")

            public_avatar = page.locator('img[src*="res.cloudinary.com/dvh1ctdm1"]').first
            if public_avatar.count() == 0:
                raise RuntimeError("A página pública não exibiu avatar vindo do Cloudinary.")

            add_step("pagina_publica", True, "Página pública exibiu headline, bio e avatar atualizados.", {"url": public_url, "screenshot": public_shot})

            query = urllib.parse.quote(USERNAME, safe="")
            rest_url = (
                f"{SUPABASE_URL}/rest/v1/profile_pages"
                f"?select=username,title,description,avatar_url,is_published&username=eq.{query}"
            )
            rows = get_json(rest_url)
            if not rows:
                raise RuntimeError("A consulta pública ao Supabase não retornou o perfil salvo.")

            row = rows[0]
            if row.get("username") != USERNAME:
                raise RuntimeError(f"Username persistido divergente no Supabase: {row}")
            if row.get("title") != HEADLINE:
                raise RuntimeError(f"Título persistido divergente no Supabase: {row}")
            if row.get("description") != BIO:
                raise RuntimeError(f"Bio persistida divergente no Supabase: {row}")
            avatar_in_db = row.get("avatar_url") or ""
            if "res.cloudinary.com/dvh1ctdm1" not in avatar_in_db:
                raise RuntimeError(f"Avatar persistido no Supabase não aponta para Cloudinary: {row}")
            if row.get("is_published") is not True:
                raise RuntimeError(f"Perfil não está publicado no Supabase: {row}")

            add_step("persistencia_supabase", True, "Persistência confirmada via leitura pública do Supabase.", {"row": row})
            report["status"] = "passed"
        except Exception as error:
            report["status"] = "failed"
            report["error"] = str(error)
            try:
                report["failure_screenshot"] = screenshot(page, "failure")
            except Exception:
                pass
        finally:
            browser.close()

    REPORT_PATH.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
