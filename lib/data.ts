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
  Code2,
  Palette,
  Wrench,
  Printer,
  ShieldCheck,
  Briefcase,
  Smartphone,
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

/** Statistiques clés — Hero section */
export const stats: Stat[] = [
  { icon: GraduationCap, value: "500+",  label: "Étudiants formés" },
  { icon: Briefcase,     value: "80+",   label: "Projets livrés" },
  { icon: Users,         value: "60+",   label: "Clients & entreprises" },
  { icon: Star,          value: "3 ans", label: "D'expérience" },
];

/** Piliers de l'entreprise — section "Notre Impact" (ex WhyChooseUs) */
export const whyChooseUs: WhyCard[] = [
  {
    icon: GraduationCap,
    title: "École professionnelle",
    description:
      "Des formations pratiques en développement web, design et compétences numériques, données par des professionnels du métier.",
    extendedDescription:
      "Loré Foundation forme des étudiants et des professionnels aux métiers du numérique les plus demandés. Chaque cours combine cours théoriques, exercices pratiques et devwa suivis sur notre plateforme, avec un accompagnement personnalisé jusqu'à l'obtention des compétences visées. Nos formateurs sont des praticiens actifs, pas seulement des enseignants.",
    features: [
      "Cours de développement web et logiciel",
      "Formation en design graphique et création visuelle",
      "Ateliers de bureautique et d'outils numériques professionnels",
      "Suivi des devoirs et corrections en ligne",
      "Certificats de fin de formation",
    ],
    satelliteIcons: [BookOpen, Star],
  },
  {
    icon: Code2,
    title: "Services numériques",
    description:
      "Développement web et logiciel sur mesure pour aider les entreprises haïtiennes à se digitaliser et à grandir.",
    extendedDescription:
      "Nous concevons des sites web, applications et outils de gestion adaptés aux besoins réels des entreprises et organisations en Haïti. De la conception à la mise en ligne, notre équipe accompagne chaque client avec des solutions fiables, modernes et pensées pour durer — que ce soit un site vitrine, une plateforme de gestion ou une application mobile.",
    features: [
      "Développement de sites web et d'applications sur mesure",
      "Logiciels de gestion pour commerces et organisations",
      "Design graphique et identité visuelle",
      "Maintenance, dépannage et support technique",
      "Hébergement et accompagnement technique continu",
    ],
    satelliteIcons: [Lightbulb, Rocket],
  },
  {
    icon: Wrench,
    title: "Accompagnement & support",
    description:
      "Un vrai suivi client, pas juste une livraison — nous restons disponibles avant, pendant et après chaque projet.",
    extendedDescription:
      "Chez Loré Foundation, chaque client et chaque étudiant bénéficie d'un accompagnement personnalisé. Nous prenons le temps de comprendre les besoins réels, de proposer des solutions adaptées au contexte local, et de rester disponibles pour le support technique, les mises à jour et les questions après la livraison d'un projet ou la fin d'une formation.",
    features: [
      "Support technique réactif par WhatsApp et téléphone",
      "Accompagnement personnalisé pour chaque projet",
      "Formation continue et mises à jour de compétences",
      "Conseils adaptés au contexte des entreprises locales",
      "Réseau de clients et partenaires à Cap-Haïtien et au-delà",
    ],
    satelliteIcons: [HandHeart, ShieldCheck],
  },
];

/** Nos Services — section Services */
export const services: Service[] = [
  {
    icon: Code2,
    title: "Développement web & logiciel",
    relatedPortfolioId: "developpement-web",
    description:
      "Sites web, applications et logiciels de gestion sur mesure, conçus pour les besoins réels des entreprises haïtiennes.",
  },
  {
    icon: GraduationCap,
    title: "École — Formations professionnelles",
    relatedPortfolioId: "ecole-formations",
    description:
      "Cours pratiques en développement web, design graphique et compétences numériques, avec devoirs et suivi en ligne.",
  },
  {
    icon: Palette,
    title: "Design graphique",
    relatedPortfolioId: "design-graphique",
    description:
      "Logos, identités visuelles, supports imprimés et digitaux qui donnent à votre marque une image professionnelle.",
  },
  {
    icon: Printer,
    title: "Sérigraphie & impression",
    relatedPortfolioId: "serigraphie",
    description:
      "Impression de t-shirts, casquettes et supports personnalisés pour entreprises, écoles et événements.",
  },
  {
    icon: Wrench,
    title: "Dépannage informatique",
    relatedPortfolioId: "depannage-informatique",
    description:
      "Réparation d'ordinateurs et de téléphones, installation de logiciels et assistance technique rapide.",
  },
  {
    icon: Smartphone,
    title: "Recharge & services mobiles",
    relatedPortfolioId: "recharge-mobile",
    description:
      "Recharge de crédit, transferts et services mobiles pratiques pour particuliers et petits commerces.",
  },
  {
    icon: ShieldCheck,
    title: "Cybersécurité & audit",
    relatedPortfolioId: "cybersecurite",
    description:
      "Sensibilisation, audits de base et bonnes pratiques pour protéger les données de votre entreprise.",
  },
  {
    icon: Briefcase,
    title: "Gestion de projets digitaux",
    relatedPortfolioId: "gestion-projets",
    description:
      "Accompagnement de bout en bout pour vos projets numériques : planification, exécution et suivi.",
  },
  {
    icon: Users,
    title: "Consultation & accompagnement",
    relatedPortfolioId: "consultation",
    description:
      "Conseils personnalisés pour digitaliser votre commerce ou organisation, adaptés au contexte local.",
  },
];

/** Nos Réalisations — section Portfolio */
export const portfolio: PortfolioItem[] = [
  {
    id: "developpement-web",
    title: "Sites Web & Plateformes Sur Mesure",
    category: "Développement Web",
    description:
      "Conception et développement de sites web et plateformes de gestion pour des entreprises et organisations à Cap-Haïtien, incluant sites vitrines, plateformes de gestion et applications métier.",
    images: [],
  },
  {
    id: "ecole-formations",
    title: "Formations École Loré",
    category: "Formation Professionnelle",
    description:
      "Plus de 500 étudiants formés en développement web, design graphique et compétences numériques à travers nos cours pratiques avec suivi de devoirs en ligne.",
    images: [],
  },
  {
    id: "design-graphique",
    title: "Identités Visuelles & Design",
    category: "Design Graphique",
    description:
      "Création de logos, chartes graphiques et supports visuels pour des dizaines d'entreprises et organisations locales souhaitant une image de marque professionnelle.",
    images: [],
  },
  {
    id: "serigraphie",
    title: "Impression & Sérigraphie",
    category: "Impression",
    description:
      "Production de t-shirts, casquettes et supports personnalisés pour entreprises, écoles et événements à travers le Nord d'Haïti.",
    images: [],
  },
  {
    id: "depannage-informatique",
    title: "Service de Dépannage",
    category: "Support Technique",
    description:
      "Réparation et assistance technique pour des centaines de particuliers et d'entreprises : ordinateurs, téléphones et logiciels.",
    images: [],
  },
  {
    id: "gestion-projets",
    title: "Accompagnement de Projets Digitaux",
    category: "Gestion de Projets",
    description:
      "Accompagnement de bout en bout d'organisations locales dans la digitalisation de leurs opérations, de la planification à la mise en œuvre.",
    images: [],
  },
];

/** Témoignages clients & étudiants */
export const testimonials: Testimonial[] = [
  {
    name: "Marie-Ange Joseph",
    role: "Propriétaire, Boutique en ligne",
    quote:
      "L'équipe de Loré Foundation a développé mon site de vente en ligne de A à Z. Le résultat est professionnel et mes clients adorent la facilité d'utilisation. Un vrai partenaire pour mon commerce.",
    initials: "MJ",
  },
  {
    name: "Kensley Augustin",
    role: "Diplômé, École Loré — Développement Web",
    quote:
      "Les cours pratiques et le suivi des devoirs en ligne m'ont permis d'apprendre à mon rythme. Aujourd'hui je travaille comme développeur freelance grâce aux compétences acquises.",
    initials: "KA",
  },
  {
    name: "Farah Delorme",
    role: "Directrice, École primaire",
    quote:
      "Loré Foundation a conçu notre plateforme de gestion scolaire et formé notre personnel à son utilisation. Le support technique est toujours rapide et disponible.",
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
  { label: "Accueil",      href: "/#accueil" },
  { label: "À propos",     href: "/a-propos" },
  { label: "École",        href: "/ecole" },
  { label: "Services",     href: "/#services" },
  { label: "Projets",      href: "/projects" },
  { label: "Blog",         href: "/blog" },
  { label: "Contact",      href: "/#contact" },
];

export const siteInfo = {
  name: "Loré Foundation",
  slogan: "L'excellence au service de votre réussite",
  tagline: "Former, Créer, Réussir",
  mission:
    "Former les talents numériques de demain et accompagner les entreprises et organisations haïtiennes avec des services professionnels de qualité : développement web, design graphique et bien plus.",
  phones: ["+509 41 55 9094", "+509 34 82 3501"],
  address: "Cap-Haïtien, Nord, Haïti",
  email: "contact@lorefoundation.com",
  whatsapp: "https://wa.me/message/QSQVE7F4WDBGF1",
  whatsappNumber: "50941559094",
};

export const fallbackAnnouncement: Announcement | null = null;
export const fallbackSeminars: Seminar[] = [];
