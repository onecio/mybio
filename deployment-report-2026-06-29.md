# Relatório de Publicação do MyBio

Data: `2026-06-29`
Projeto: `MyBio`
Repositório: `https://github.com/onecio/mybio`
Branch publicada: `main`
Commit de publicação de infraestrutura: `be60266`
Imagem publicada: `ghcr.io/onecio/mybio:latest`
Host pretendido: `mybio.ecomnix.com.br`

## 1. Objetivo

Publicar o sistema `MyBio` de forma profissional no GitHub e no cluster Kubernetes (`k3s`) acessível via host `lau`, adotando boas práticas mínimas de publicação, segurança operacional e validação prévia do ambiente.

## 2. Análise prévia do ambiente

Antes de qualquer alteração no cluster, foi realizada uma auditoria do ambiente para evitar impacto no serviço já existente.

### 2.1 Estado do host e cluster

- Host validado via SSH: `lau`
- Nó do cluster: `worker0`
- Distribuição Kubernetes: `k3s v1.36.2+k3s1`
- Runtime: `containerd://2.3.2-k3s2`
- Sistema operacional: `Ubuntu 24.04.4 LTS`
- IP público identificado no host: `152.67.42.59`

### 2.2 Capacidade observada

- CPU: `2`
- Memória alocável: aproximadamente `977 MiB`
- Disco disponível: aproximadamente `77 GiB`

### 2.3 Recursos existentes relevantes

- Namespace de aplicações já existente: `applications`
- Ingress controller identificado: `Traefik`
- StorageClass padrão: `local-path`
- Serviço já existente publicado no cluster: `ecomnix-status`

### 2.4 Conclusões da análise

- O cluster é pequeno e de nó único, portanto a publicação do MyBio foi dimensionada para `1 réplica`, com requests e limits conservadores.
- Não foram encontrados `cert-manager`, `ClusterIssuer` ou `Issuer` ativos no cluster.
- O padrão existente de publicação usa `Ingress` no namespace `applications` com classe `traefik`.
- O subdomínio `mybio.ecomnix.com.br` ainda **não existia em DNS** no momento da publicação.

## 3. Publicação no GitHub

### 3.1 Repositório

- Repositório criado anteriormente: `https://github.com/onecio/mybio`
- Código da aplicação publicado com sucesso

### 3.2 Artefatos adicionados ao projeto para publicação

- `Dockerfile`
- `.dockerignore`
- `.github/workflows/container-publish.yml`
- `k8s/mybio-configmap.yaml`
- `k8s/mybio-secret.example.yaml`
- `k8s/mybio-service.yaml`
- `k8s/mybio-ingress.yaml`
- `k8s/mybio-deployment.yaml`
- `src/app/api/health/route.ts`
- ajuste em `next.config.ts` para `output: "standalone"`

### 3.3 Pipeline de container

Foi configurado um workflow de GitHub Actions para:

- fazer checkout do repositório
- preparar `buildx`
- autenticar no `GHCR`
- gerar a imagem do container
- publicar no `ghcr.io/onecio/mybio`

Resultado:

- workflow executado com sucesso
- imagem validada no registro e posteriormente puxada no host `lau`

## 4. Estratégia de publicação no Kubernetes

## 4.1 Motivos das decisões adotadas

Com base no ambiente encontrado, a publicação foi desenhada da seguinte forma:

- `1 réplica`, por se tratar de nó único e memória limitada
- `Service` do tipo `ClusterIP`
- `Ingress` dedicado para `mybio.ecomnix.com.br`
- imagem servida via `GHCR`
- `readOnlyRootFilesystem: true`
- container sem privilégios adicionais
- probes HTTP de saúde
- volumes efêmeros (`emptyDir`) para cache temporário e `/tmp`

## 4.2 Recursos criados no namespace `applications`

### Configuração

- `ConfigMap`: `mybio-config`

Campos principais:

- `NODE_ENV=production`
- `PORT=3000`
- `HOSTNAME=0.0.0.0`
- `NEXT_TELEMETRY_DISABLED=1`
- `NEXT_PUBLIC_SITE_URL=https://mybio.ecomnix.com.br`

### Segredos

- `Secret`: `mybio-secrets`
- Tipo: `Opaque`

Estratégia adotada:

- `APP_SECRET` gerado aleatoriamente no momento do deploy
- chaves opcionais de Supabase/Cloudinary criadas em branco, porque a aplicação está preparada para operar em modo resiliente enquanto essas integrações não forem preenchidas
- nenhum segredo sensível foi commitado no GitHub

### Volumes

Foram criados volumes efêmeros no deployment:

- `tmp`
- `next-cache`

Motivação:

- suportar escrita temporária com `readOnlyRootFilesystem`
- manter o pod stateless
- evitar PVC desnecessário em uma aplicação Next.js sem persistência local

### Serviço

- `Service`: `mybio`
- Tipo: `ClusterIP`
- Porta externa do serviço: `80`
- Porta do container: `3000`

### Ingress

- `Ingress`: `mybio`
- Classe: `traefik`
- Host configurado: `mybio.ecomnix.com.br`

## 5. Deployment aplicado

### 5.1 Imagem

- Imagem utilizada: `ghcr.io/onecio/mybio:latest`

### 5.2 Segurança e operação

No container foram configurados:

- `runAsNonRoot: true`
- `allowPrivilegeEscalation: false`
- `capabilities.drop: ALL`
- `readOnlyRootFilesystem: true`

### 5.3 Recursos

Requests:

- CPU: `100m`
- Memória: `128Mi`

Limits:

- CPU: `500m`
- Memória: `256Mi`

### 5.4 Probes

Endpoint criado para observabilidade:

- `GET /api/health`

Probes configuradas:

- `startupProbe`
- `readinessProbe`
- `livenessProbe`

## 6. Resultado do deploy

### 6.1 Rollout

Rollout concluído com sucesso:

- `deployment.apps/mybio` criado
- `pod/mybio-6556f55cc4-hkhxl` em estado `Running`
- endpoint interno resolvido: `10.42.1.4:3000`

### 6.2 Testes executados

Testes realizados com sucesso:

- `npm run lint`
- `npm run build`
- publicação da imagem via GitHub Actions
- pull da imagem no host com `sudo k3s ctr images pull ghcr.io/onecio/mybio:latest`
- validação de saúde via:
  - `https://mybio.ecomnix.com.br/api/health` usando `--resolve` para o IP `152.67.42.59`
- validação da homepage via:
  - `https://mybio.ecomnix.com.br/` usando `--resolve`

Resultados observados:

- `/api/health` respondeu `{"status":"ok","service":"mybio",...}`
- homepage respondeu `HTTP 200`

## 7. Ponto pendente para acesso público final

O deploy da aplicação está funcional no cluster e já responde corretamente quando o host é forçado para o IP público do servidor.

Entretanto, o acesso público normal por nome **ainda depende da criação do DNS**:

- host desejado: `mybio.ecomnix.com.br`
- IP público do servidor: `152.67.42.59`

### Ação necessária fora do cluster

Criar no provedor DNS do domínio `ecomnix.com.br` um registro para:

- tipo sugerido: `A`
- nome: `mybio`
- valor: `152.67.42.59`

Se o domínio estiver atrás do Cloudflare, o ideal é seguir o mesmo padrão já usado em `app.ecomnix.com.br`.

## 8. O que foi feito para não quebrar o ambiente

- inspeção inicial do cluster antes de aplicar recursos
- reuso do namespace existente `applications`
- não alteração do app já existente `ecomnix-status`
- dimensionamento conservador por limitação de CPU/memória
- criação de ingress isolado por host
- secrets gerados fora do repositório
- rollout acompanhado até estado saudável

## 9. Estado final

Status atual: `Deploy concluído no Kubernetes e pronto para publicação pública por DNS`

Resumo:

- GitHub publicado: `sim`
- imagem em registro: `sim`
- deployment no k3s: `sim`
- pod saudável: `sim`
- ingress criado: `sim`
- secrets criados: `sim`
- volumes efêmeros configurados: `sim`
- acesso público por DNS oficial: `pendente de registro DNS do subdomínio`
