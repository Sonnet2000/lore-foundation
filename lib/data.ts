import {
  BookOpen,
  Laptop,
  Users,
  Lightbulb,
  Heart,
  Globe,
  Rocket,
  GraduationCap,
  HandHeart,
  TreePine,
  Instagram,
  Facebook,
  MessageCircle,
  Star,
  type LucideIcon,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
  relatedPortfolioId: string;
};

export type Stat = {
  icon: LucideIcon;
  value: string;
  label: string;
};

export type WhyCard = {
  icon: LucideIcon;
  title: string;
  description: string;
  extendedDescription: string;
  features: string[];
  satelliteIcons: [LucideIcon, LucideIcon];
};

export type TeamMember = {
  name: string;
  role: string;
  initials: string;
  photo: string;
  showSocial?: boolean;
};

export type MediaItem = { url: string; type: "image" | "video" };

export type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  images?: string[];
  media?: MediaItem[];
};

export type Testimonial = {
  name: string;
  role: string;
  quote: string;
  initials: string;
};

export type Announcement = {
  id: string;
  message: string;
  linkUrl: string | null;
  linkLabel: string | null;
};

export type SeminarMediaItem = { url: string; type: "image" | "video" };

export type Seminar = {
  id: string;
  title: string;
  description: string;
  startsAt: string | null;
  location: string;
  registrationOpen: boolean;
  media: SeminarMediaItem[];
};

// ─── Contenu ──────────────────────────────────────────────────────────────────

/** Statistiques d'impact — Hero section */
export const stats: Stat[] = [
  { icon: GraduationCap, value: "500+",  label: "Jeunes formés" },
  { icon: Users,         value: "30+",   label: "Bénévoles actifs" },
  { icon: Globe,         value: "10+",   label: "Communautés touchées" },
  { icon: Heart,         value: "3 ans", label: "D'engagement" },
];

/** Piliers d'impact — section "Notre Impact" (ex WhyChooseUs) */
export const whyChooseUs: WhyCard[] = [
  {
    icon: BookOpen,
    title: "Éducation",
    description:
      "Nous croyons que l'éducation est la clé de toute transformation durable. Nos initiatives soutiennent l'accès au savoir pour tous.",
    extendedDescription:
      "À travers des programmes de soutien scolaire, des bibliothèques communautaires et des partenariats avec des institutions éducatives, Loré Foundation œuvre pour que chaque jeune haïtien ait accès à une éducation de qualité. Nous intervenons dans les zones les plus reculées pour y apporter des ressources pédagogiques et former des enseignants capables de faire la différence.",
    features: [
      "Soutien scolaire et tutorat pour élèves en difficulté",
      "Distribution de matériel pédagogique dans les zones rurales",
      "Partenariats avec des établissements scolaires locaux",
      "Programmes de bourses pour jeunes méritants",
      "Sensibilisation à l'importance de l'éducation des filles",
    ],
    satelliteIcons: [GraduationCap, Star],
  },
  {
    icon: Laptop,
    title: "Formation Numérique",
    description:
      "La technologie est un levier puissant. Nous formons la jeunesse haïtienne aux compétences numériques essentielles pour l'avenir.",
    extendedDescription:
      "Notre programme de formation numérique prépare les jeunes et les professionnels aux métiers de demain. Des ateliers pratiques en développement web, design graphique, bureautique et gestion digitale sont organisés régulièrement. Nous croyons que maîtriser les outils numériques, c'est ouvrir des portes à des opportunités infinies — localement et à l'international.",
    features: [
      "Ateliers de compétences numériques pour débutants",
      "Formation informatique pour enseignants et professionnels",
      "Initiation au développement web et au design",
      "Cours de bureautique et d'outils de productivité",
      "Accompagnement à la recherche d'emploi dans le numérique",
    ],
    satelliteIcons: [Lightbulb, Rocket],
  },
  {
    icon: Users,
    title: "Leadership & Communauté",
    description:
      "Nous accompagnons les jeunes leaders et renforçons les liens communautaires pour bâtir une Haïti plus solidaire.",
    extendedDescription:
      "Loré Foundation organise des séminaires de leadership, des camps de jeunes et des projets communautaires qui permettent aux participants de développer leur confiance en soi, leur sens des responsabilités et leur capacité à mobiliser leur entourage. Parce qu'une communauté forte naît de leaders éclairés, nous investissons dans ceux qui feront demain.",
    features: [
      "Séminaires et ateliers de leadership pour jeunes",
      "Projets communautaires participatifs",
      "Mentorat par des professionnels et des bénévoles",
      "Camps de développement personnel et de cohésion",
      "Réseaux d'ambassadeurs dans les quartiers et régions",
    ],
    satelliteIcons: [HandHeart, TreePine],
  },
];

/** Nos Programmes — section Services */
export const services: Service[] = [
  {
    icon: Laptop,
    title: "Formation informatique pour enseignants",
    relatedPortfolioId: "formation-enseignants",
    description:
      "Un programme adapté pour permettre aux enseignants de maîtriser les outils numériques et les intégrer dans leur pédagogie quotidienne.",
  },
  {
    icon: Lightbulb,
    title: "Ateliers de compétences numériques",
    relatedPortfolioId: "ateliers-numeriques",
    description:
      "Des ateliers pratiques ouverts à tous pour acquérir des compétences en bureautique, réseaux sociaux, et outils digitaux essentiels.",
  },
  {
    icon: Star,
    title: "Séminaires de leadership",
    relatedPortfolioId: "seminaires-leadership",
    description:
      "Des rencontres inspirantes qui outillent les jeunes pour devenir des acteurs de changement dans leurs communautés.",
  },
  {
    icon: Heart,
    title: "Accompagnement des jeunes",
    relatedPortfolioId: "accompagnement-jeunes",
    description:
      "Un suivi personnalisé pour aider les jeunes à définir leur projet de vie, accéder à des formations et saisir des opportunités.",
  },
  {
    icon: Globe,
    title: "Sensibilisation communautaire",
    relatedPortfolioId: "sensibilisation",
    description:
      "Des actions de terrain pour informer, éduquer et mobiliser les communautés autour d'enjeux essentiels pour leur développement.",
  },
  {
    icon: BookOpen,
    title: "Initiatives éducatives",
    relatedPortfolioId: "initiatives-educatives",
    description:
      "Des projets innovants qui rapprochent l'école et la communauté, en rendant l'apprentissage plus accessible et plus engageant.",
  },
  {
    icon: GraduationCap,
    title: "Bourses & soutien scolaire",
    relatedPortfolioId: "bourses-soutien",
    description:
      "Identification et soutien des jeunes talents qui manquent de ressources pour poursuivre leurs études et réaliser leur potentiel.",
  },
  {
    icon: HandHeart,
    title: "Volontariat & bénévolat",
    relatedPortfolioId: "volontariat",
    description:
      "Rejoignez notre réseau de bénévoles et contribuez directement à des projets qui transforment des vies dans toute Haïti.",
  },
  {
    icon: TreePine,
    title: "Innovation sociale",
    relatedPortfolioId: "innovation-sociale",
    description:
      "Des solutions créatives et locales aux défis sociaux, portées par des jeunes engagés qui veulent changer les choses concrètement.",
  },
];

/** Nos Actions & Réalisations — section Portfolio */
export const portfolio: PortfolioItem[] = [
  {
    id: "formation-enseignants",
    title: "Formation des Enseignants",
    category: "Formation Numérique",
    description:
      "Près de 80 enseignants du Nord d'Haïti ont été formés aux outils numériques pour enrichir leurs pratiques pédagogiques et mieux préparer leurs élèves.",
    images: [],
  },
  {
    id: "ateliers-numeriques",
    title: "Ateliers Numériques Communautaires",
    category: "Compétences Digitales",
    description:
      "Des ateliers hebdomadaires ouverts à tous à Cap-Haïtien pour initier la population aux outils informatiques, réseaux sociaux et opportunités en ligne.",
    images: [],
  },
  {
    id: "seminaires-leadership",
    title: "Séminaires de Leadership Jeunesse",
    category: "Leadership",
    description:
      "Des séminaires réguliers qui ont réuni plus de 200 jeunes pour développer leurs compétences en leadership, communication et gestion de projets communautaires.",
    images: [],
  },
  {
    id: "accompagnement-jeunes",
    title: "Programme d'Accompagnement",
    category: "Développement Personnel",
    description:
      "Un programme de mentorat individuel qui a permis à plus de 150 jeunes de définir leur projet professionnel et accéder à des formations adaptées.",
    images: [],
  },
  {
    id: "sensibilisation",
    title: "Campagnes de Sensibilisation",
    category: "Engagement Communautaire",
    description:
      "Des actions de terrain dans plusieurs quartiers de Cap-Haïtien pour informer les communautés sur l'éducation, la santé numérique et les droits des jeunes.",
    images: [],
  },
  {
    id: "initiatives-educatives",
    title: "Initiatives Éducatives Locales",
    category: "Éducation",
    description:
      "Des partenariats avec des écoles locales pour mettre en place des clubs informatiques, des bibliothèques numériques et des concours de créativité jeunesse.",
    images: [],
  },
];

/** Témoignages & Histoires d'Impact */
export const testimonials: Testimonial[] = [
  {
    name: "Marie-Ange Joseph",
    role: "Enseignante, Cap-Haïtien",
    quote:
      "Grâce à la formation de Loré Foundation, j'utilise maintenant des outils numériques dans ma classe chaque jour. Mes élèves sont plus motivés et moi plus confiante. C'est une vraie révolution pour moi.",
    initials: "MJ",
  },
  {
    name: "Kensley Augustin",
    role: "Participant, Séminaire de Leadership",
    quote:
      "Ce séminaire a changé ma façon de voir les choses. J'ai appris à croire en moi, à fixer des objectifs clairs et à mobiliser mes amis autour de projets concrets pour notre communauté.",
    initials: "KA",
  },
  {
    name: "Farah Delorme",
    role: "Bénéficiaire, Programme Jeunesse",
    quote:
      "Loré Foundation m'a accompagnée à un moment difficile. Ils m'ont aidée à trouver une formation en design graphique et aujourd'hui je travaille à mon compte. Je suis fière du chemin parcouru.",
    initials: "FD",
  },
];

/** Équipe — bénévoles, formateurs, coordinateurs */
export const team: TeamMember[] = [
  {
    name: "Lovedine Laguerre",
    role: "Fondatrice & Directrice",
    initials: "LL",
    photo: "/team/lovedine-laguerre.jpg",
    showSocial: false,
  },
  {
    name: "Remy Sonnet",
    role: "Co-fondateur & Coordinateur Digital",
    initials: "RS",
    photo: "/team/remy-sonnet.jpg",
    showSocial: true,
  },
];

export const socialLinks = [
  {
    name: "Facebook",
    Icon: Facebook,
    href: "https://m.facebook.com/story.php?story_fbid=pfbid02r7f2egh23aUwKjVPp6z1J1Rjo97Q3KHHCt5Qc99xkex1VFRgVbc4aTbeUcmED6xTl&id=61589651334475",
  },
  {
    name: "Instagram",
    Icon: Instagram,
    href: "https://www.instagram.com/lore_foundation?igsh=aWgwbWhlcmF4eTVl",
  },
  {
    name: "WhatsApp",
    Icon: MessageCircle,
    href: "https://wa.me/message/QSQVE7F4WDBGF1",
  },
];

export const navLinks = [
  { label: "Accueil",      href: "#accueil" },
  { label: "À propos",     href: "/a-propos" },
  { label: "Programmes",   href: "#services" },
  { label: "Projets",      href: "/projects" },
  { label: "Blog",         href: "/blog" },
  { label: "Faire un don", href: "/don" },
  { label: "Contact",      href: "#contact" },
];

export const siteInfo = {
  name: "Loré Foundation",
  slogan: "L'excellence au cœur de l'impact",
  tagline: "Former, Inspirer, Transformer",
  mission:
    "Améliorer la vie des gens à travers l'éducation, la formation digitale, le développement des jeunes, le leadership, l'innovation et l'action communautaire.",
  phones: ["+509 41 55 9094", "+509 34 82 3501"],
  address: "Cap-Haïtien, Nord, Haïti",
  email: "contact@lorefoundation.com",
  whatsapp: "https://wa.me/message/QSQVE7F4WDBGF1",
  whatsappNumber: "50941559094",
};

export const fallbackAnnouncement: Announcement | null = null;
export const fallbackSeminars: Seminar[] = [];
