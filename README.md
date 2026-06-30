# MyBio Premium

Base premium em Next.js 16 para uma alternativa elegante ao Linktree, com landing page de alto impacto, páginas públicas de perfil e dashboard pronto para evolução com Supabase e Cloudinary.

## Stack

- Next.js 16 + App Router
- TypeScript
- Tailwind CSS 4
- `lucide-react` para ícones
- `zod` para schemas
- Helpers preparados para `@supabase/ssr`, `@supabase/supabase-js` e `cloudinary`

## Como rodar

1. Instale as dependências:

```bash
npm install
```

2. Copie o arquivo de ambiente:

```bash
# Windows PowerShell
Copy-Item .env.example .env.local

# macOS / Linux
cp .env.example .env.local
```

3. Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

4. Acesse:

```txt
http://localhost:3000
```

## Rotas principais

- `/` — landing premium do MyBio
- `/login` — login
- `/register` — cadastro
- `/forgot-password` — recuperação de senha
- `/dashboard` — visão geral do painel
- `/dashboard/profile` — perfil
- `/dashboard/links` — links
- `/dashboard/socials` — redes sociais
- `/dashboard/themes` — temas
- `/dashboard/analytics` — analytics
- `/dashboard/settings` — configurações
- `/:username` — página pública conectada ao Supabase

## Integrações futuras

- Preencha as variáveis do Supabase e Cloudinary em `.env.local`
- Os dados atuais estão centralizados em `src/lib/mock-data.ts`
- Os schemas principais ficam em `src/validators`
- O proxy de proteção do dashboard está em `src/proxy.ts`

## Autenticação Supabase

O projeto suporta e-mail/senha e OAuth com Google ou GitHub. Para o ambiente de produção:

1. Execute `supabase/mybio_schema.sql` no SQL Editor do projeto.
2. Em **Authentication > URL Configuration**, configure:
   - Site URL: `https://mybio.ecomnix.com.br`
   - Redirect URL: `https://mybio.ecomnix.com.br/auth/callback`
3. Em **Authentication > Providers**, habilite Google e/ou GitHub com credenciais OAuth próprias.
4. No provedor social, use como callback a URL exibida pelo Supabase, no formato:
   `https://<project-ref>.supabase.co/auth/v1/callback`.
5. Mantenha a confirmação de e-mail habilitada. O link usa a `Site URL` e a lista de redirects do Supabase; SMTP próprio é opcional e não deve ser usado como requisito para desabilitar a confirmação.

Nunca armazene Client Secrets, service role keys ou senhas no repositório. As chaves públicas do Supabase podem ficar no `ConfigMap`; segredos administrativos devem ficar no `Secret` do cluster.

## Scripts

```bash
npm run dev
npm test
npm run lint
npm run typecheck
npm run build
```
