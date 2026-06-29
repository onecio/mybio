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
- `/:username` — página pública mockada

## Integrações futuras

- Preencha as variáveis do Supabase e Cloudinary em `.env.local`
- Os dados atuais estão centralizados em `src/lib/mock-data.ts`
- Os schemas principais ficam em `src/validators`
- O middleware de proteção do dashboard está em `src/middleware.ts`

## Scripts

```bash
npm run dev
npm run lint
npm run build
```
