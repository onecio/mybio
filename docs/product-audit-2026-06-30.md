# Auditoria de produto e engenharia — MyBio

Data: 30 de junho de 2026

## Diagnóstico executivo

O MyBio deixou de ser uma demonstração visual e passou a operar como produto conectado ao Supabase. O ciclo atual priorizou os riscos que impediam aquisição e uso: autenticação, confirmação de e-mail, autorização no banco, segurança de redirects, edição de links, experiência mobile e mensuração.

## Matriz comparativa

| Capacidade | MyBio atual | Referência Linktree Pro | Próxima evolução |
| --- | --- | --- | --- |
| Cadastro e login | E-mail, Google e GitHub | Completo | WebAuthn/passkeys |
| Links | Criar, editar, pausar, destacar, agendar e reordenar | Completo | Tipos de conteúdo e embeds |
| Página pública | Responsiva, tema, redes, thumbnails e SEO por perfil | Completo | Pré-visualização em tempo real |
| Analytics | Visitas únicas diárias, cliques, CTR e período | Avançado | Origem, dispositivo e exportação |
| Temas | Presets persistidos no Supabase | Avançado | Editor visual completo |
| Segurança | RLS, RPCs controladas, CSP, URL validation e headers | Corporativo | Rate limiting distribuído |
| Administração global | Não entregue neste ciclo | Avançado | RBAC, moderação e auditoria |
| Domínio personalizado | Não entregue | Disponível | Verificação DNS e provisionamento TLS |
| Leads e monetização | Não entregue | Disponível | Formulários consentidos e integrações |

## Alterações implementadas

- correção de cadastro/login e redirects internos seguros;
- OAuth Google e GitHub com callback de produção;
- confirmação de e-mail preservada e URL de produção configurada;
- RLS e views com `security_invoker`, sem exposição de e-mail;
- registro de cliques por RPC e resolução do destino no servidor;
- links com descrição, thumbnail, destaque, agenda, expiração e drag-and-drop acessível;
- visualizações únicas diárias anonimizadas por HMAC, sem armazenar IP;
- dashboard mobile com navegação inferior e identidade visual própria;
- identidade MyBio, favicon vetorial, paleta grafite, marfim, petróleo, cobre e sálvia;
- metadata dinâmica, canonical, Open Graph, Twitter Card, robots e sitemap;
- CSP e headers de segurança;
- testes unitários, lint, typecheck e build no CI antes da publicação da imagem;
- imagem OCI com SBOM e proveniência.

## Backlog priorizado

### P0 — operação e confiança

1. Rate limiting externo para endpoints públicos de analytics.
2. Monitoramento de erros e alertas de disponibilidade.
3. Testes E2E de cadastro, confirmação, login e recuperação.

### P1 — diferenciação do produto

1. Editor visual com preview em tempo real.
2. QR Code, compartilhamento e download de material de divulgação.
3. Analytics por origem, dispositivo e campanha UTM.
4. Blocos de vídeo, áudio, agenda e formulário de leads.

### P2 — plataforma

1. Painel global com RBAC, suspensão e trilha de auditoria.
2. Domínios personalizados com validação DNS.
3. Exportação e portabilidade de dados em conformidade com LGPD.

## Checklist de validação

### Mobile

- [x] Hero e autenticação legíveis em 390 px.
- [x] CTA primário com contraste adequado.
- [x] Navegação do dashboard adaptada ao polegar.
- [x] Formulários com labels e áreas de toque adequadas.
- [x] Links públicos sem overflow horizontal.

### Segurança

- [x] Nenhum Client Secret no repositório.
- [x] Redirects externos rejeitados.
- [x] URLs de links limitadas a HTTP/HTTPS.
- [x] Dados privados protegidos por RLS.
- [x] IP de visitante não persistido.
- [x] Headers CSP, HSTS, frame denial e MIME sniffing configurados.
- [ ] Rate limiting distribuído.
- [ ] Auditoria administrativa completa.

## Execução e testes

```powershell
Copy-Item .env.example .env.local
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run dev
```

As migrações incrementais ficam em `supabase/migrations`. Para uma instalação nova, execute `supabase/mybio_schema.sql` no SQL Editor do Supabase.
