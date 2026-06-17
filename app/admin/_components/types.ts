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
