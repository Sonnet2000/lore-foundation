export type PortfolioRow = {
  id: string;
  title: string;
  category: string;
  description: string;
  images: string[];
  sort_order: number;
};

export type ServiceRow = {
  id: string;
  title: string;
  icon: string;
  description: string;
  related_portfolio_id: string | null;
  sort_order: number;
};

export type TeamRow = {
  id: string;
  name: string;
  role: string;
  initials: string;
  photo_url: string | null;
  show_social: boolean;
  sort_order: number;
};

export type TestimonialRow = {
  id: string;
  name: string;
  role: string;
  quote: string;
  initials: string;
  sort_order: number;
};

export type AnnouncementRow = {
  id: string;
  message: string;
  link_url: string | null;
  link_label: string | null;
  is_active: boolean;
  notified_at: string | null;
  created_at: string;
};

export type SeminarMediaItem = { url: string; type: "image" | "video" };

export type SeminarRow = {
  id: string;
  title: string;
  description: string;
  starts_at: string | null;
  location: string;
  registration_open: boolean;
  is_published: boolean;
  media: SeminarMediaItem[];
  sort_order: number;
  notified_at: string | null;
};

export type RegistrationRow = {
  id: string;
  seminar_id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
};

export type SubscriberRow = {
  id: string;
  email: string;
  created_at: string;
};
