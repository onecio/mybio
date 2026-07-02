# Runbook operacional do MyBio em K3s Free Tier

Data de referência: `2026-07-02`

Projeto local:

```text
C:\Users\oneci\AppData\Roaming\TRAE SOLO\ModularData\ai-agent\work-mode-projects\6a42db49feaa591488c86942\mybio-premium
```

Produção pública:

```text
https://mybio.ecomnix.com.br
```

## 1. Resumo para leigo

Hoje o MyBio está no ar e responde publicamente. A página inicial, a rota de login e o health check continuam acessíveis pela internet.

O problema principal não é a aplicação em si. O problema dominante é a infraestrutura da VM Free Tier, que está muito apertada. Em linguagem simples:

- a VM tem pouca memória;
- parte da memória já está indo para swap, que é memória improvisada no disco e muito mais lenta;
- o host físico da nuvem está disputado, então a VM sofre com `CPU steal`, que significa “a VM quer CPU, mas o provedor não entrega na hora”;
- o disco e o armazenamento também estão lentos, o que aparece como `I/O wait`, isto é, tempo perdido esperando o armazenamento responder;
- quando isso acontece, o K3s fica lento, o `kubectl` expira, o `containerd` demora a responder e componentes como CoreDNS, Traefik e metrics-server ficam instáveis.

O novo direcionamento recomendado é:

```text
Alterar código local
→ testar localmente
→ commit
→ push
→ GitHub Actions compila e publica a imagem
→ K3s apenas baixa a imagem pronta
→ rollout manual e controlado
→ validação com logs, pods e domínio
```

Isso reduz carga na VM porque o trabalho pesado deixa de acontecer no servidor fraco.

## 2. Diagnóstico técnico

### 2.1 Evidência pública confirmada

Comandos executados do Windows local:

```powershell
curl.exe -I https://mybio.ecomnix.com.br/
curl.exe -I https://mybio.ecomnix.com.br/api/health
curl.exe -I https://mybio.ecomnix.com.br/login
curl.exe -I https://mybio.ecomnix.com.br/auth/callback
```

O que cada comando faz:

1. `curl.exe -I` faz uma requisição sem baixar toda a página.
2. Ele mostra apenas os cabeçalhos HTTP, úteis para verificar se a rota está viva.
3. É ideal para teste rápido de produção.

Saída esperada:

- `/` com `HTTP 200`: a página principal respondeu.
- `/api/health` com `HTTP 200`: o endpoint técnico de saúde respondeu.
- `/login` com `HTTP 200`: a tela de login existe.
- `/auth/callback` com `HTTP 307`: a rota existe e redireciona quando o link está sem código válido.

Interpretação:

- `HTTP 200` significa “a rota respondeu normalmente”.
- `HTTP 307` significa “a rota redirecionou”.
- hoje o callback já redireciona para `https://mybio.ecomnix.com.br/login?...`, portanto o problema antigo de cair em `localhost:3000` não aparece mais nessa validação pública.

### 2.2 Evidência atual do host `worker0`

Comando executado via `ssh lau`:

```bash
hostname
date
uptime
free -h
df -h /
top -b -n 1 -o %MEM | head -n 20
vmstat 1 5
ps -eo pid,ppid,cmd,%mem,%cpu --sort=-%mem | head -n 20
```

O que observar:

- `uptime`: mostra há quanto tempo a VM está ligada e qual a carga média.
- `free -h`: mostra memória RAM e swap.
- `df -h /`: mostra ocupação do disco.
- `top`: mostra processos mais pesados.
- `vmstat`: mostra pressão de CPU, disco e swap ao longo de alguns segundos.
- `ps`: confirma quais processos estão consumindo mais memória e CPU.

Resultado observado nesta coleta:

- host: `worker0`
- uptime: `22 min`
- load average: `1.45`, `1.41`, `1.12`
- memória total: `954 MiB`
- memória livre: cerca de `60 MiB`
- swap em uso: cerca de `463 MiB`
- disco `/`: `20 GiB` usados de `96 GiB`
- `k3s server` consumindo cerca de `260 MiB`
- `containerd`, `traefik`, `metrics-server` e `coredns` também ativos
- `CPU steal` em torno de `64%`
- `I/O wait` em torno de `22%` no `top`
- no `vmstat`, `steal` oscilando entre `65%` e `73%`, com `wa` entre `11%` e `20%`

Interpretação para leigo:

- carga média é o tamanho da fila de trabalho do sistema; se ela sobe e a máquina continua lenta, há gargalo;
- memória livre baixa não significa sozinha pane, mas junto com swap alto e lentidão é um sinal ruim;
- swap é o sistema usando disco como memória auxiliar; funciona, mas é muito mais lento que RAM;
- processo pesado é um processo que consome memória ou CPU demais; aqui o próprio `k3s server` já é um dos maiores consumidores;
- quando `steal` está alto, a VM está perdendo tempo esperando CPU do provedor;
- quando `wa` está alto, a VM está perdendo tempo esperando armazenamento responder.

Conclusão: a VM continua sobrecarregada por limitação estrutural da Free Tier.

### 2.3 Evidência do K3s e runtime

Comandos tentados:

```bash
sudo systemctl status k3s --no-pager
sudo journalctl -u k3s -n 120 --no-pager
sudo k3s crictl ps -a
sudo k3s crictl pods
```

Resultados:

- `systemctl status k3s` e o `journalctl` ficaram lentos a ponto de expirar nesta nova coleta;
- `crictl` voltou erro de `DeadlineExceeded` ao falar com `containerd.sock`;
- isso confirma que o runtime de contêineres continua sofrendo sob pressão;
- na coleta anterior já havia indícios de `TLS handshake timeout`, `Slow SQL`, perda de heartbeat e falhas de sincronização do CoreDNS com a API do Kubernetes.

Explicação para leigo:

- K3s é uma distribuição leve de Kubernetes;
- `container runtime` é o motor que realmente cria e executa os contêineres;
- `containerd` é esse motor no ambiente atual;
- `crictl` conversa diretamente com o runtime e ajuda quando o `kubectl` está instável, porque ele pula parte do caminho e fala mais perto do mecanismo que roda os contêineres.

### 2.4 Evidência do Kubernetes

Comandos tentados:

```bash
kubectl get nodes -o wide
kubectl get pods -A -o wide
kubectl get deployments -A
kubectl get svc -A
kubectl get ingress -A
kubectl get events -A --sort-by=.lastTimestamp
```

Todos expiraram nesta coleta.

Explicação para leigo:

- `kubectl` conversa com a API do Kubernetes;
- se a API está lenta ou presa esperando CPU, disco ou runtime, ocorre timeout;
- isso não significa automaticamente que o site caiu;
- significa que o “plano de controle”, isto é, a parte que administra o cluster, está degradado.

### 2.5 Estado do MyBio e autenticação

O código atual usa:

- `NEXT_PUBLIC_SITE_URL` para montar URLs absolutas;
- `emailRedirectTo` em cadastro apontando para `/auth/callback?next=/dashboard`;
- `redirectTo` no login social também apontando para `/auth/callback`.

Arquivos principais:

- [src/actions/auth.ts](C:\Users\oneci\AppData\Roaming\TRAE SOLO\ModularData\ai-agent\work-mode-projects\6a42db49feaa591488c86942\mybio-premium\src\actions\auth.ts)
- [src/lib/supabase/config.ts](C:\Users\oneci\AppData\Roaming\TRAE SOLO\ModularData\ai-agent\work-mode-projects\6a42db49feaa591488c86942\mybio-premium\src\lib\supabase\config.ts)
- [src/app/auth/callback/route.ts](C:\Users\oneci\AppData\Roaming\TRAE SOLO\ModularData\ai-agent\work-mode-projects\6a42db49feaa591488c86942\mybio-premium\src\app\auth\callback\route.ts)

Conclusão atual:

- o fluxo do aplicativo está apontando para produção, não para `localhost`;
- a rota de callback está funcional;
- a causa antiga do link de confirmação incorreto está compatível com configuração errada de `Site URL` ou redirect no Supabase, e a evidência pública sugere que isso foi corrigido;
- como a API do cluster está instável, não foi possível nesta etapa auditar segredos e variáveis diretamente do Deployment em produção sem risco operacional;
- o login local e o login social exigem validação interativa completa com credenciais reais e callback do provedor, mas a base de código está estruturada corretamente para isso.

## 3. Workflow atual explicado

### 3.1 Desenvolvimento local

No Windows:

```powershell
cd "C:\Users\oneci\AppData\Roaming\TRAE SOLO\ModularData\ai-agent\work-mode-projects\6a42db49feaa591488c86942\mybio-premium"
git status
npm install
npm run build
npm test
```

Explicação:

- `cd` entra na pasta do projeto;
- `git status` mostra arquivos alterados;
- `npm install` instala dependências JavaScript;
- `npm run build` gera a versão de produção;
- `npm test` executa os testes automatizados.

Onde executar: no PowerShell local, dentro da pasta do projeto.

Por que é necessário: para validar o código antes de publicar.

Saída esperada:

- `git status` sem surpresas;
- `npm install` concluído sem erro;
- `npm run build` finalizado com sucesso;
- `npm test` com todos os testes aprovados.

Se der erro:

- em `npm install`, verificar internet e `package-lock.json`;
- em `build`, revisar logs do Next.js;
- em `test`, corrigir o comportamento antes de publicar.

### 3.2 Commit e push

```powershell
git add .
git commit -m "chore: estabiliza deploy no free tier"
git push
```

Explicação:

- `git add .` prepara as alterações para o commit;
- `git commit` cria um ponto de histórico;
- `git push` envia para o repositório remoto.

Observação importante: não inclua a pasta `testing/` se ela contiver artefatos locais temporários.

### 3.3 Build da imagem

Hoje o build pesado deve acontecer no GitHub Actions, não na VM.

Explicação para leigo:

- uma imagem Docker é um pacote fechado com a aplicação pronta para rodar;
- o `registry` é o repositório onde essa imagem fica guardada;
- o GitHub Actions é o serviço do GitHub que executa automações.

Fluxo atual desejado:

```text
push no GitHub
→ workflow roda
→ instala dependências
→ testa
→ builda
→ gera imagem
→ publica imagem no GHCR
```

### 3.4 Deploy no Kubernetes

Comandos manuais recomendados:

```bash
kubectl set image deployment/mybio mybio=ghcr.io/onecio/mybio:sha-<sha> -n applications
kubectl rollout status deployment/mybio -n applications --timeout=300s
kubectl get pods -n applications -o wide
kubectl logs -n applications deploy/mybio --tail=100
curl -vk https://mybio.ecomnix.com.br/
```

Explicação:

- `kubectl set image`: manda o Kubernetes trocar a imagem do Deployment;
- `rollout status`: acompanha a troca de versão;
- `get pods`: mostra se o novo Pod subiu;
- `logs`: mostra se a aplicação iniciou sem erro;
- `curl`: valida o domínio pelo lado de fora.

### 3.5 Rollback

```bash
kubectl rollout undo deployment/mybio -n applications
```

Explicação para leigo:

Rollback é voltar para a versão anterior quando a nova versão falha.

## 4. Workflow recomendado para Free Tier

### 4.1 O que mudou

- a produção deixa de depender de `latest`;
- a imagem passa a ser identificada por SHA curto de 12 caracteres;
- o cluster deixa de usar `imagePullPolicy: Always`;
- o rollout passa a priorizar economia de memória em vez de zero-downtime absoluto;
- o build pesado fica fora da VM.

### 4.2 Por que mudou

Porque a VM Free Tier é limitada. Baixar imagem desnecessariamente e tentar manter Pod antigo e novo ao mesmo tempo aumenta risco de travamento.

### 4.3 Qual problema isso resolve

- melhora previsibilidade de versão;
- facilita rollback;
- reduz tráfego de rede e carga no runtime;
- reduz chance de o deploy pressionar memória demais.

### 4.4 Novo fluxo

```text
Alterar código local
→ npm test / npm run build
→ git commit
→ git push
→ GitHub Actions publica ghcr.io/onecio/mybio:sha-<12>
→ operador executa rollout manual
→ valida pods, logs e domínio
→ se falhar, rollback
```

### 4.5 O que não deve mais rodar na VM

Evite na VM:

- `npm install`
- `npm run build`
- `docker build`
- `docker push`

Esses comandos consomem CPU, memória, disco e I/O demais para o tamanho da VM.

### 4.6 O que roda no GitHub Actions

- checkout do código;
- instalação de dependências;
- testes;
- build de produção;
- build da imagem;
- push para o GHCR.

### 4.7 Como executar manualmente se necessário

Se precisar fazer rollout manual:

```bash
kubectl set image deployment/mybio mybio=ghcr.io/onecio/mybio:sha-<sha> -n applications
kubectl rollout status deployment/mybio -n applications --timeout=300s
```

### 4.8 Como validar

```bash
kubectl get pods -n applications
kubectl logs -n applications deploy/mybio --tail=100
curl -vk https://mybio.ecomnix.com.br/api/health
```

### 4.9 Como reverter

```bash
kubectl rollout undo deployment/mybio -n applications
```

## 5. Estratégia de deploy e manifestos

### 5.1 Por que `latest` e `Always` são ruins aqui

- `latest` não diz exatamente qual versão está rodando;
- dificulta saber o que entrou em produção;
- dificulta rollback;
- `Always` força o Kubernetes a tentar baixar a imagem sempre;
- em cluster lento, isso aumenta rollout, rede e pressão no runtime.

### 5.2 Novo padrão adotado

No manifesto:

```yaml
image: ghcr.io/onecio/mybio:sha-494ecfd44d7b
imagePullPolicy: IfNotPresent
```

Explicação:

- `sha-494ecfd44d7b` identifica exatamente a versão;
- `IfNotPresent` evita download se a imagem já estiver no nó.

### 5.3 Estratégia de rollout escolhida

Foi adotado:

```yaml
strategy:
  type: Recreate
```

Motivo:

- em VM fraca, `RollingUpdate` pode manter dois Pods ao mesmo tempo;
- isso consome mais memória;
- `Recreate` derruba o Pod antigo e sobe o novo, economizando recursos;
- o custo é alguns segundos possíveis de indisponibilidade no deploy.

### 5.4 Resources e probes

Manifesto atualizado para um perfil mais conservador:

```yaml
resources:
  requests:
    cpu: 50m
    memory: 128Mi
  limits:
    cpu: 300m
    memory: 384Mi
```

Explicação:

- `requests` é o mínimo reservado;
- `limits` é o teto permitido;
- CPU de request menor melhora chance de agendamento;
- limite de memória um pouco maior reduz risco de matar a aplicação por memória curta demais.

Probes mantidas:

- `startupProbe`: dá tempo de a aplicação iniciar;
- `readinessProbe`: só recebe tráfego quando estiver pronta;
- `livenessProbe`: reinicia o contêiner se travar.

## 6. CI/CD recomendado

Arquivo principal:

- [container-publish.yml](C:\Users\oneci\AppData\Roaming\TRAE SOLO\ModularData\ai-agent\work-mode-projects\6a42db49feaa591488c86942\mybio-premium\.github\workflows\container-publish.yml)

O workflow agora:

1. recebe push na `main`;
2. instala dependências;
3. roda testes, lint, typecheck e build;
4. constrói a imagem;
5. publica no GHCR com tag `sha-<12>`;
6. escreve no resumo do job o comando exato de rollout manual.

Explicação dos termos:

- workflow: arquivo de automação do GitHub Actions;
- job: bloco grande de execução dentro do workflow;
- step: passo individual do job;
- secret: dado sensível guardado no GitHub;
- registry: repositório de imagens;
- tag: nome da versão da imagem.

## 7. Observabilidade leve

Para a Free Tier, prefira ferramentas leves:

- `kubectl get`
- `kubectl describe`
- `kubectl logs`
- `journalctl`
- `crictl`
- `curl`

Prometheus, Grafana e Loki são úteis, mas podem ser pesados para esta VM se instalados sem muito critério.

## 8. Plano de ação

### 8.1 Crítico

- manter deploy fora da VM;
- parar de usar `latest` como referência de produção;
- parar de usar `imagePullPolicy: Always`;
- estabilizar deploy com rollout manual e reversível;
- validar em janela calma sempre que o cluster apresentar timeout.

### 8.2 Alta prioridade

- auditar o Secret real do Deployment quando a API do cluster estiver responsiva;
- confirmar se `NEXT_PUBLIC_SITE_URL` e variáveis públicas em produção estão iguais ao `ConfigMap` do repositório;
- executar teste completo de cadastro, login local e login social com conta real e observar logs durante a tentativa.

### 8.3 Média prioridade

- revisar bundle e dependências pesadas do frontend;
- reduzir chamadas e ruído operacional do dashboard;
- adicionar smoke test pós-deploy para rotas essenciais.

### 8.4 Melhorias futuras

- usar digest imutável em vez de tag por SHA;
- adotar GitOps leve;
- avaliar upgrade de infraestrutura ou mudança de provedor se o produto crescer.

## 9. Arquivos alterados

| Arquivo | Alteração | Motivo | Impacto esperado |
| --- | --- | --- | --- |
| `k8s/mybio-deployment.yaml` | imagem por SHA, `IfNotPresent`, `Recreate`, resources ajustados, labels e limites de `emptyDir` | reduzir pressão da Free Tier e melhorar rastreabilidade | deploy mais previsível e mais leve |
| `k8s/mybio-configmap.yaml` | labels operacionais | padronização de manifests | leitura e gestão mais profissionais |
| `k8s/mybio-service.yaml` | labels operacionais | padronização | melhor organização |
| `k8s/mybio-ingress.yaml` | labels e anotação TLS | clareza operacional | manifesto mais consistente |
| `k8s/mybio-secret.example.yaml` | labels operacionais | padronização | melhor organização |
| `k8s/mybio-namespace.yaml` | novo manifesto de namespace | conjunto completo de recursos | bootstrap mais claro |
| `.github/workflows/container-publish.yml` | remove `latest`, publica `sha-<12>`, gera instrução de rollout | pipeline previsível e adequada para Free Tier | menos ambiguidade de versão |
| `docs/k3s-free-tier-runbook-2026-07-02.md` | novo runbook didático | documentação reproduzível para leigos | operação mais segura e repetível |

## 10. Comandos para repetir manualmente

### 10.1 Windows local

```powershell
cd "C:\Users\oneci\AppData\Roaming\TRAE SOLO\ModularData\ai-agent\work-mode-projects\6a42db49feaa591488c86942\mybio-premium"
git status
npm install
npm test
npm run lint
npm run typecheck
npm run build
git add .
git commit -m "chore: estabiliza deploy free tier"
git push
```

### 10.2 Validação do pipeline

No GitHub Actions, localizar a execução do workflow `Publish Container` e copiar a tag `sha-<12>` publicada no resumo.

### 10.3 Deploy manual no K3s

No host `lau`:

```bash
kubectl set image deployment/mybio mybio=ghcr.io/onecio/mybio:sha-<sha> -n applications
kubectl rollout status deployment/mybio -n applications --timeout=300s
kubectl get pods -n applications -o wide
kubectl logs -n applications deploy/mybio --tail=100
curl -vk https://mybio.ecomnix.com.br/
curl -vk https://mybio.ecomnix.com.br/api/health
```

### 10.4 Rollback

```bash
kubectl rollout undo deployment/mybio -n applications
kubectl rollout status deployment/mybio -n applications --timeout=300s
```

## 11. Troubleshooting para leigo

| Sintoma | O que significa | Onde olhar | Comando | Como corrigir |
| --- | --- | --- | --- | --- |
| Site fora | domínio não respondeu | Ingress, Service, Pod, Cloudflare | `curl -vk https://mybio.ecomnix.com.br/` | validar Pod, logs e rota do Ingress |
| Login falhando | autenticação ou sessão falhou | logs do app e Supabase | `kubectl logs -n applications deploy/mybio --tail=200` | revisar callback, cookies, Site URL e provider |
| Pod `Pending` | o cluster não conseguiu agendar | recursos do node | `kubectl describe pod <pod> -n applications` | reduzir request ou liberar recursos |
| `CrashLoopBackOff` | contêiner sobe e cai repetidamente | logs e probes | `kubectl logs <pod> -n applications --previous` | corrigir erro da aplicação ou probe |
| `ImagePullBackOff` | imagem não foi baixada | nome da imagem, tag, registry | `kubectl describe pod <pod> -n applications` | corrigir tag, credencial ou conectividade |
| rollout lento | troca de versão travou | eventos, runtime, rede | `kubectl rollout status deployment/mybio -n applications` | aguardar, analisar eventos e usar rollback se necessário |
| `TLS handshake timeout` | API do Kubernetes não respondeu a tempo | saúde do K3s | `kubectl get nodes -o wide` | esperar janela calma e reduzir pressão do host |
| erro `521` | proxy não conseguiu alcançar a origem | Cloudflare e origin | `curl -vk https://mybio.ecomnix.com.br/` | validar se origin está ouvindo |
| erro `526` | problema de certificado TLS | Ingress/TLS | `kubectl describe ingress mybio -n applications` | revisar certificado do origin |
| API server lento | plano de controle degradado | `journalctl`, `top`, `vmstat` | `sudo journalctl -u k3s -n 120 --no-pager` | reduzir carga e evitar operações pesadas |
| CoreDNS instável | DNS interno do cluster está falhando | pod do CoreDNS e API | `sudo k3s crictl pods` | estabilizar API server e runtime |

## 12. Checklist final

- [ ] código testado localmente
- [ ] commit realizado
- [ ] push enviado
- [ ] workflow `Publish Container` concluído
- [ ] imagem `sha-<12>` identificada
- [ ] manifesto ou `kubectl set image` atualizado
- [ ] rollout acompanhado
- [ ] Pods em `Running`
- [ ] logs sem erro crítico
- [ ] domínio responde
- [ ] `/api/health` responde
- [ ] login local testado
- [ ] login social testado
- [ ] rollback documentado

## 13. Observação operacional final

Nenhuma ação destrutiva foi executada nesta etapa. Não houve remoção de namespace, PVC, secret, banco, volume, Traefik ou reinstalação do cluster.

Com a evidência atual, o ponto mais fraco do ambiente continua sendo a VM Free Tier. A aplicação está funcional publicamente, mas o plano de controle do cluster permanece sensível a qualquer pico, reinício ou deploy mal dimensionado.
