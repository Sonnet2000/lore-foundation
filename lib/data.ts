import {
  Code2,
  Smartphone,
  Palette,
  Clapperboard,
  Megaphone,
  BrainCircuit,
  Server,
  Shirt,
  Sparkles,
  Rocket,
  Users,
  HeadphonesIcon,
  Layers,
  Instagram,
  Facebook,
  MessageCircle,
  Bot,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
  /** id of the related portfolio item (see `portfolio`), used to deep-link
   *  service cards directly to a matching project. */
  relatedPortfolioId: string;
};

export const services: Service[] = [
  {
    icon: Code2,
    title: "Développement Web",
    relatedPortfolioId: "lore-store-enligne",
    description:
      "Sites vitrines, plateformes sur mesure et applications web rapides, sécurisées et évolutives.",
  },
  {
    icon: Smartphone,
    title: "Applications Mobiles",
    relatedPortfolioId: "miss-lore-salon",
    description:
      "Applications Android et iOS performantes, pensées pour une expérience fluide sur le terrain.",
  },
  {
    icon: Palette,
    title: "Design Graphique",
    relatedPortfolioId: "ewek-entreprise",
    description:
      "Identité visuelle, supports imprimés et créations graphiques qui reflètent votre image de marque.",
  },
  {
    icon: Clapperboard,
    title: "Montage Vidéo",
    relatedPortfolioId: "recharge-express",
    description:
      "Vidéos promotionnelles, réseaux sociaux et contenus visuels qui captent l'attention.",
  },
  {
    icon: Megaphone,
    title: "Publicité Digitale",
    relatedPortfolioId: "miss-lore-salon",
    description:
      "Stratégies publicitaires ciblées pour augmenter votre visibilité et générer des résultats concrets.",
  },
  {
    icon: BrainCircuit,
    title: "Intelligence Artificielle",
    relatedPortfolioId: "medicore-pro",
    description:
      "Automatisation, chatbots et outils intelligents pour optimiser vos processus métier.",
  },
  {
    icon: Server,
    title: "Hébergement Web",
    relatedPortfolioId: "ewek-entreprise",
    description:
      "Hébergement fiable et sécurisé avec maintenance continue pour garder votre site toujours en ligne.",
  },
  {
    icon: Shirt,
    title: "Sérigraphie",
    relatedPortfolioId: "recharge-express",
    description:
      "Impression sur textiles et objets personnalisés pour vos événements et votre marque.",
  },
  {
    icon: Sparkles,
    title: "Salon de Beauté",
    relatedPortfolioId: "miss-lore-salon",
    description:
      "Gestion moderne de salon : prise de rendez-vous, suivi client et expérience beauté digitalisée.",
  },
];

export type Stat = {
  icon: LucideIcon;
  value: string;
  label: string;
};

export const stats: Stat[] = [
  { icon: Rocket, value: "100+", label: "Projets réalisés" },
  { icon: Users, value: "500+", label: "Clients satisfaits" },
  { icon: HeadphonesIcon, value: "24/7", label: "Support disponible" },
  { icon: Layers, value: "10+", label: "Services offerts" },
];

export type WhyCard = {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Longer, more detailed pitch shown in the "En savoir plus" panel. */
  extendedDescription: string;
  /** Short bullet list of concrete deliverables/benefits. */
  features: string[];
  /** Two accent icons used to compose the decorative illustration. */
  satelliteIcons: [LucideIcon, LucideIcon];
};

export const whyChooseUs: WhyCard[] = [
  {
    icon: Code2,
    title: "Développement Web",
    description:
      "Des solutions web modernes, rapides et adaptées à tous les écrans, conçues pour durer et évoluer avec vous.",
    extendedDescription:
      "Nous concevons des sites vitrines, boutiques en ligne et plateformes sur mesure avec les technologies les plus récentes du marché. Chaque projet est pensé pour offrir une expérience fluide sur mobile comme sur ordinateur, un temps de chargement optimal et une base solide qui pourra grandir avec votre activité. Du premier croquis jusqu'à la mise en ligne, nous restons à vos côtés pour livrer un produit fini, fiable et fidèle à votre image de marque.",
    features: [
      "Sites vitrines et boutiques en ligne sur mesure",
      "Design responsive, rapide et accessible sur tous les écrans",
      "Architecture évolutive pensée pour la croissance",
      "Hébergement, sécurité et maintenance continue",
      "Référencement (SEO) de base inclus dès le lancement",
    ],
    satelliteIcons: [Smartphone, Server],
  },
  {
    icon: BrainCircuit,
    title: "Intelligence Artificielle",
    description:
      "Nous intégrons des outils intelligents pour automatiser vos tâches et vous faire gagner un temps précieux.",
    extendedDescription:
      "L'intelligence artificielle n'est plus réservée aux grandes entreprises. Nous concevons des assistants virtuels, chatbots et outils d'automatisation qui répondent à vos clients, traitent vos données et simplifient vos tâches répétitives — jour et nuit. Chaque solution est adaptée à la réalité de votre activité, qu'il s'agisse d'un salon de beauté, d'une boutique en ligne ou d'une institution, et nous formons votre équipe pour qu'elle en tire le meilleur parti dès le premier jour.",
    features: [
      "Chatbots et assistants virtuels personnalisés",
      "Automatisation des tâches répétitives et des suivis clients",
      "Analyse de données pour des décisions plus éclairées",
      "Intégration de l'IA dans vos outils existants",
      "Formation de votre équipe à l'utilisation des outils",
    ],
    satelliteIcons: [Bot, Sparkles],
  },
  {
    icon: Users,
    title: "Accompagnement Digital",
    description:
      "Un suivi personnalisé à chaque étape, de la conception au lancement, et bien après la mise en ligne.",
    extendedDescription:
      "Réussir sa transformation digitale ne s'arrête pas à la livraison d'un site ou d'une application. Nous vous accompagnons à chaque étape : définition de votre stratégie numérique, formation de vos équipes, puis suivi régulier après la mise en ligne. Notre objectif est de bâtir une relation de confiance durable, où chaque amélioration et chaque nouvelle idée trouve sa place au fil de la croissance de votre activité.",
    features: [
      "Stratégie digitale personnalisée selon vos objectifs",
      "Formation et prise en main simple des outils livrés",
      "Support technique réactif, disponible 24/7",
      "Suivi, mises à jour et évolutions continues",
      "Un seul partenaire, de la conception au lancement — et après",
    ],
    satelliteIcons: [HeadphonesIcon, Rocket],
  },
];

export type TeamMember = {
  name: string;
  role: string;
  initials: string;
  photo: string;
  showSocial?: boolean;
};

export const team: TeamMember[] = [
  {
    name: "Lovedine Laguerre",
    role: "CEO",
    initials: "LL",
    photo: "/team/lovedine-laguerre.jpg",
    showSocial: false,
  },
  {
    name: "Remy Sonnet",
    role: "Co-fondateur",
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

export type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  /** Short description shown in the project gallery. */
  description: string;
  /**
   * Gallery image URLs for this project. Add direct image links here
   * (e.g. Google Drive "lh3.googleusercontent.com/d/FILE_ID" links — see
   * README for the exact format) to populate the project gallery. Leave
   * empty to show a "coming soon" placeholder.
   */
  images?: string[];
};

export const portfolio: PortfolioItem[] = [
  {
    id: "lore-store-enligne",
    title: "Loré Store Enligne",
    category: "E-commerce",
    description:
      "Boutique en ligne complète avec catalogue de produits, panier et paiement, pensée pour offrir une expérience d'achat fluide et moderne aux clients en Haïti.",
    images: [],
  },
  {
    id: "miss-lore-salon",
    title: "Miss Loré Salon",
    category: "Application Mobile",
    description:
      "Application mobile de prise de rendez-vous pour salon de beauté : réservation en quelques clics, rappels automatiques et suivi client digitalisé.",
    images: [],
  },
  {
    id: "medicore-pro",
    title: "MediCore Pro",
    category: "Plateforme Santé",
    description:
      "Plateforme de gestion pour établissements de santé : dossiers patients, rendez-vous et outils intelligents pour fluidifier le suivi médical au quotidien.",
    images: [],
  },
  {
    id: "ewek-entreprise",
    title: "EWEK Entreprise",
    category: "Tableau de Bord",
    description:
      "Tableau de bord d'entreprise avec identité visuelle complète, conçu pour donner une vue claire et en temps réel des activités de l'organisation.",
    images: [],
  },
  {
    id: "recharge-express",
    title: "Recharge Express",
    category: "Application Web",
    description:
      "Application web de recharge et de services rapides, accompagnée de supports visuels et de contenus promotionnels pour renforcer la marque.",
    images: [],
  },
  {
    id: "ti-kane-epargne",
    title: "Ti Kanè Épargne",
    category: "Gestion Financière",
    description:
      "Solution de gestion financière et d'épargne communautaire, conçue pour aider les utilisateurs à suivre leurs cotisations et leur progression en toute simplicité.",
    images: [],
  },
];

export type Testimonial = {
  name: string;
  role: string;
  quote: string;
  initials: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Carline Mésidor",
    role: "Fondatrice, Salon Belle Étoile",
    quote:
      "Loré Foundation a transformé notre salon avec une application de réservation simple et élégante. Nos clientes adorent et notre organisation s'est nettement améliorée.",
    initials: "CM",
  },
  {
    name: "Frantz Désir",
    role: "Directeur, EWEK Entreprise",
    quote:
      "Une équipe à l'écoute, rapide et toujours disponible. Notre tableau de bord est désormais beaucoup plus clair et nous fait gagner un temps précieux chaque jour.",
    initials: "FD",
  },
  {
    name: "Naika Beauchard",
    role: "Propriétaire, Loré Store Enligne",
    quote:
      "Grâce à leur expertise, notre boutique en ligne tourne parfaitement et nos ventes ont augmenté. Un vrai partenaire de confiance pour notre croissance digitale.",
    initials: "NB",
  },
];

export const navLinks = [
  { label: "Accueil", href: "#accueil" },
  { label: "Services", href: "#services" },
  { label: "À Propos", href: "#a-propos" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Contact", href: "#contact" },
];

export const siteInfo = {
  name: "Loré Foundation",
  slogan: "L'excellence au cœur de l'impact",
  tagline: "Votre partenaire en innovation numérique",
  phones: ["+509 41 55 9094", "+509 34 82 3501"],
  address: "Cap-Haïtien, Nord, Haïti",
  email: "contact@lorefoundation.com",
  whatsapp: "https://wa.me/message/QSQVE7F4WDBGF1",
  /** Used to build links with a pre-filled message (`?text=`), which the
   *  /message/<code> short link does not reliably support on its own. */
  whatsappNumber: "50941559094",
};

export type Announcement = {
  id: string;
  message: string;
  linkUrl: string | null;
  linkLabel: string | null;
};

// No fallback announcement — the banner simply doesn't render until one is
// created in the admin panel.
export const fallbackAnnouncement: Announcement | null = null;

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

// No fallback seminars — the section only appears once a seminar is
// published from the admin panel.
export const fallbackSeminars: Seminar[] = [];
