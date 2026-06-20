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

export type SponsorTier = "bronze" | "silver" | "gold";
export type SponsorStatus = "pending" | "approved" | "rejected";
export type PaymentMethod = "moncash" | "natcash" | "sogebank" | "autre";
export type PaymentStatus = "pending" | "confirmed" | "rejected";
export type PaymentPurpose = "sponsor" | "service" | "seminar" | "autre";

export type SponsorRow = {
  id: string;
  name: string;
  organization: string;
  email: string;
  phone: string;
  tier: SponsorTier;
  message: string;
  logo_url: string | null;
  website_url: string | null;
  status: SponsorStatus;
  is_public: boolean;
  created_at: string;
};

export type PaymentRow = {
  id: string;
  sponsor_id: string | null;
  purpose: PaymentPurpose;
  amount: number;
  currency: string;
  method: PaymentMethod;
  sender_name: string;
  sender_phone: string;
  reference: string;
  proof_url: string | null;
  status: PaymentStatus;
  note: string;
  created_at: string;
};

export type PaymentMethodRow = {
  id: string;
  type: "moncash" | "natcash" | "sogebank" | "autre";
  label: string;
  number: string;
  details: string;
  instructions: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};
