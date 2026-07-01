import type {
  ActivityItem,
  BenefitItem,
  FeatureItem,
  KPI,
  LinkItem,
  NavItem,
  ProcessStep,
  ShowcasePage,
  ThemePreset,
  UserProfile,
} from "@/types";

export const marketingNav: NavItem[] = [
  { label: "Benefícios", href: "#beneficios" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Showcase", href: "#showcase" },
  { label: "Recursos", href: "#recursos" },
];

export const socialProof = [
  "Plano gratuito para a comunidade",
  "Dados protegidos por usuário",
  "Experiência criada para smartphones",
  "Identidade visual sem marcas genéricas",
];

export const benefits: BenefitItem[] = [
  {
    eyebrow: "Marca pessoal forte",
    title: "Transforme um link simples em uma vitrine premium.",
    description:
      "A landing perfeita para creators, especialistas e negócios digitais que querem autoridade visual instantânea.",
  },
  {
    eyebrow: "Mais clique por visita",
    title: "Organize conteúdo, oferta e comunidade em uma experiência elegante.",
    description:
      "Links, produtos, redes, agenda e provas sociais convivem em camadas bem definidas e fáceis de consumir.",
  },
  {
    eyebrow: "Pronto para escalar",
    title: "Uma base moderna para crescer com autenticação, analytics e personalização.",
    description:
      "A estrutura já nasce preparada para Supabase, Cloudinary e evolução contínua sem reescrever a interface.",
  },
];

export const processSteps: ProcessStep[] = [
  {
    step: "01",
    title: "Monte seu perfil premium",
    description:
      "Defina headline, bio, links estratégicos e identidade visual em poucos passos.",
  },
  {
    step: "02",
    title: "Ative sua presença em todos os canais",
    description:
      "Conecte Instagram, TikTok, YouTube, LinkedIn e qualquer destino relevante.",
  },
  {
    step: "03",
    title: "Acompanhe o que converte",
    description:
      "Visualize cliques, crescimento e comportamento para evoluir sua página com dados.",
  },
];

export const showcasePages: ShowcasePage[] = [
  {
    title: "Creator Signature",
    category: "Lifestyle Creator",
    accent: "from-amber-300 via-orange-200 to-rose-200",
    description: "Editorial suave, foco em cursos, comunidade e collabs.",
  },
  {
    title: "Expert Authority",
    category: "Consultoria & Mentoria",
    accent: "from-sky-300 via-cyan-200 to-white",
    description: "Arquitetura limpa para prova social, agenda e captação de leads.",
  },
  {
    title: "Studio Commerce",
    category: "Marca de Produto",
    accent: "from-violet-300 via-fuchsia-200 to-pink-100",
    description: "Vitrine premium para lançamentos, bundles e campanhas especiais.",
  },
];

export const featureItems: FeatureItem[] = [
  {
    icon: "sparkles",
    title: "Temas refinados",
    description:
      "Paletas premium com superfícies suaves, contraste elegante e bordas generosas.",
  },
  {
    icon: "bar-chart-3",
    title: "Analytics práticos",
    description:
      "KPIs claros com leitura rápida para entender o que gera atenção e ação.",
  },
  {
    icon: "smartphone",
    title: "Mobile-first real",
    description:
      "Todas as páginas nascem pensadas para a experiência do smartphone, sem perder sofisticação no desktop.",
  },
  {
    icon: "shield-check",
    title: "Base segura",
    description:
      "Rotas protegidas, fallback defensivo e helpers preparados para autenticação SSR.",
  },
  {
    icon: "cloud-upload",
    title: "Mídia preparada",
    description:
      "Estrutura pronta para armazenar imagens e assets com Cloudinary no momento certo.",
  },
  {
    icon: "badge-check",
    title: "Visual de alta percepção",
    description:
      "Detalhes de UI, espaçamento consistente e linguagem visual premium em toda a aplicação.",
  },
];

export const dashboardNav: NavItem[] = [
  { label: "Visão geral", href: "/dashboard", section: "dashboard" },
  { label: "Links", href: "/dashboard/links", section: "links" },
  { label: "Visual", href: "/dashboard/design", section: "themes" },
  { label: "Perfil", href: "/dashboard/profile", section: "profile" },
  { label: "Métricas", href: "/dashboard/insights", section: "analytics" },
  { label: "Configurações", href: "/dashboard/settings", section: "settings" },
];

export const mockLinks: LinkItem[] = [
  {
    id: "link-1",
    title: "Mentoria MyBrand",
    url: "https://mybio.app/mentoria",
    description: "Sessões estratégicas para creators e experts em crescimento.",
    icon: "star",
    clicks: 1240,
    featured: true,
    active: true,
  },
  {
    id: "link-2",
    title: "Aula premium gratuita",
    url: "https://mybio.app/aula",
    description: "Lead magnet com estética editorial e alta conversão.",
    icon: "play-circle",
    clicks: 932,
    active: true,
  },
  {
    id: "link-3",
    title: "Comunidade fechada",
    url: "https://mybio.app/comunidade",
    description: "Acesso a bastidores, templates e networking qualificado.",
    icon: "users",
    clicks: 611,
    active: true,
  },
  {
    id: "link-4",
    title: "Agenda de collabs",
    url: "https://mybio.app/collabs",
    description: "Página para marcas e parceiros estratégicos.",
    icon: "calendar-heart",
    clicks: 278,
    active: false,
  },
];

export const mockSocials = [
  {
    platform: "instagram",
    handle: "@mybio.studio",
    url: "https://instagram.com/mybio.studio",
    followers: "84k",
  },
  {
    platform: "tiktok",
    handle: "@mybio.studio",
    url: "https://tiktok.com/@mybio.studio",
    followers: "112k",
  },
  {
    platform: "linkedin",
    handle: "MyBio Studio",
    url: "https://linkedin.com/company/mybio",
    followers: "12k",
  },
] as const;

export const themePresets: ThemePreset[] = [
  {
    id: "amber-signature",
    name: "Amber Signature",
    description: "Luz dourada, superfícies suaves e presença sofisticada.",
    accent: "linear-gradient(135deg, #f59e0b 0%, #fde68a 100%)",
    surface: "#fff9ee",
    text: "#422006",
    ring: "rgba(245, 158, 11, 0.32)",
    selected: true,
  },
  {
    id: "sky-editorial",
    name: "Sky Editorial",
    description: "Limpeza premium com azul leve e sensação de tecnologia calma.",
    accent: "linear-gradient(135deg, #38bdf8 0%, #bae6fd 100%)",
    surface: "#f2fbff",
    text: "#082f49",
    ring: "rgba(56, 189, 248, 0.24)",
  },
  {
    id: "violet-glow",
    name: "Violet Glow",
    description: "Criatividade, profundidade e um toque fashion-forward.",
    accent: "linear-gradient(135deg, #8b5cf6 0%, #ddd6fe 100%)",
    surface: "#f8f6ff",
    text: "#3b0764",
    ring: "rgba(139, 92, 246, 0.24)",
  },
];

export const kpis: KPI[] = [
  {
    title: "Cliques totais",
    value: "18.420",
    change: "+18,2%",
    trend: "up",
    detail: "Últimos 30 dias",
  },
  {
    title: "Taxa de conversão",
    value: "12,8%",
    change: "+2,4 p.p.",
    trend: "up",
    detail: "Visitantes para clique",
  },
  {
    title: "Retenção do perfil",
    value: "63%",
    change: "Estável",
    trend: "steady",
    detail: "Usuários que exploram 2+ links",
  },
];

export const analyticsSeries = [42, 56, 51, 68, 72, 81, 78, 94, 108, 122, 118, 136];

export const activityFeed: ActivityItem[] = [
  {
    title: "Tema Amber Signature aplicado",
    description: "Seu perfil recebeu novo acabamento visual premium.",
    time: "Hoje, 09:12",
  },
  {
    title: "Novo link destacado publicado",
    description: "Mentoria MyBrand foi movida para o topo da página.",
    time: "Ontem, 18:40",
  },
  {
    title: "Pico de tráfego identificado",
    description: "Seu perfil cresceu após menção no Instagram Stories.",
    time: "Ontem, 11:03",
  },
];

export const audienceHighlights = [
  "73% do tráfego vem do mobile",
  "Maior pico de acesso entre 19h e 22h",
  "Instagram é a principal origem",
];

export const mockProfile: UserProfile = {
  name: "Luna Ferraz",
  username: "lunaferraz",
  headline: "Creator, estrategista de marca e fundadora do Studio Atlas.",
  bio: "Transformo expertise em presença digital premium. Aulas, comunidade e projetos para creators que querem crescer com sofisticação.",
  avatar: "LF",
  location: "São Paulo, Brasil",
  verified: true,
  monthlyViews: "48 mil",
  conversionRate: "12,8%",
  links: mockLinks,
  socials: [...mockSocials],
  stats: [
    { label: "Visualizações/mês", value: "48 mil", detail: "crescimento de 21%" },
    { label: "CTR média", value: "12,8%", detail: "performance premium" },
    { label: "Principais origens", value: "Instagram + TikTok", detail: "audiência quente" },
  ],
};
