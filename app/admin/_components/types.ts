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

export type BlogCategory =
  | "technologie" | "education" | "ia"
  | "entrepreneuriat" | "activites" | "actualites" | "leadership";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_url: string | null;
  category: BlogCategory;
  tags: string[];
  author_name: string;
  author_photo: string | null;
  is_published: boolean;
  is_featured: boolean;
  read_time_minutes: number;
  views: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type UserRow = {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  avatar_url: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  banned: boolean;
  provider: string;
  donationsCount: number;
  donationsTotal: number;
  paymentsCount: number;
  paymentsTotal: number;
  seminarsCount: number;
};

export type DailyStat = { date: string; views: number; visitors: number };
export type TopPage = { path: string; views: number };
export type TopReferrer = { referrer: string; views: number };

export type AnalyticsSummary = {
  totalViews: number;
  totalVisitors: number;
  viewsToday: number;
  visitorsToday: number;
  views7d: number;
  visitors7d: number;
  views30d: number;
  visitors30d: number;
  daily: DailyStat[];
  topPages: TopPage[];
  topReferrers: TopReferrer[];
};

export type ProjectCategory = 'education'|'numerique'|'leadership'|'communaute'|'sante'|'autre';
export type ProjectStatus = 'actif'|'complete'|'pause';

export type ProjectMedia = { url: string; type: 'image'|'video' };

export type Project = {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_desc: string;
  category: ProjectCategory;
  goal_amount: number;
  raised_amount: number;
  currency: string;
  cover_url: string | null;
  media: ProjectMedia[];
  location: string;
  beneficiaries: number;
  start_date: string | null;
  end_date: string | null;
  is_published: boolean;
  is_featured: boolean;
  status: ProjectStatus;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type CourseFormat = "online" | "in_person" | "hybrid";

export type CourseRow = {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_url: string | null;
  price: string;
  duration: string;
  format: CourseFormat;
  is_published: boolean;
  sort_order: number;
  created_at: string;
};

export type EnrollmentRow = {
  id: string;
  course_id: string;
  user_id: string;
  status: "pending" | "approved" | "rejected";
  note: string;
  payment_method: string | null;
  payment_reference: string | null;
  payment_proof_url: string | null;
  created_at: string;
  decided_at: string | null;
  full_name: string;
  phone: string;
  email: string;
};

export type AssignmentRow = {
  id: string;
  course_id: string;
  title: string;
  description: string;
  attachment_url: string | null;
  due_at: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
};

export type SubmissionRow = {
  id: string;
  assignment_id: string;
  user_id: string;
  text_response: string;
  link_url: string | null;
  file_url: string | null;
  status: "submitted" | "graded";
  grade: string | null;
  feedback: string | null;
  submitted_at: string;
  graded_at: string | null;
  full_name: string;
  email: string;
};

export type AdRow = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  link_url: string | null;
  cta_label: string;
  is_published: boolean;
  sort_order: number;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
};

export type PaymentRequestRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  subject: string;
  amount: string;
  method: string;
  reference: string;
  proof_url: string | null;
  status: "pending" | "confirmed" | "rejected";
  notes: string;
  created_at: string;
  confirmed_at: string | null;
};

export type LessonRow = {
  id: string;
  course_id: string;
  title: string;
  description: string;
  video_url: string | null;
  content: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
};
