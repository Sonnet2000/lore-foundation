import {
  Facebook,
  Instagram,
  Youtube,
  Send,
  Linkedin,
  Twitter,
  Music2,
  MessageCircle,
  Link2,
  type LucideIcon,
} from "lucide-react";

export type SocialPlatform =
  | "facebook"
  | "instagram"
  | "tiktok"
  | "youtube"
  | "telegram"
  | "whatsapp"
  | "whatsapp_channel"
  | "linkedin"
  | "twitter"
  | "other";

export type SocialLink = {
  id: string;
  platform: SocialPlatform;
  /** Sèlman itilize si platform === "other" */
  label: string;
  url: string;
};

export type ContactInfo = {
  phones: string[];
  email: string;
  address: string;
  /** Chif sèlman (peyi + nimewo), pou lyen wa.me/mesaj otomatik la */
  whatsappNumber: string;
  socialLinks: SocialLink[];
};

export const PLATFORM_META: Record<SocialPlatform, { label: string; Icon: LucideIcon; placeholder: string }> = {
  facebook:          { label: "Facebook",         Icon: Facebook,      placeholder: "https://facebook.com/..." },
  instagram:         { label: "Instagram",        Icon: Instagram,     placeholder: "https://instagram.com/..." },
  tiktok:            { label: "TikTok",           Icon: Music2,        placeholder: "https://tiktok.com/@..." },
  youtube:           { label: "YouTube",          Icon: Youtube,       placeholder: "https://youtube.com/@..." },
  telegram:          { label: "Telegram",         Icon: Send,          placeholder: "https://t.me/..." },
  whatsapp:          { label: "WhatsApp",         Icon: MessageCircle, placeholder: "https://wa.me/message/..." },
  whatsapp_channel:  { label: "Chanèl WhatsApp",  Icon: MessageCircle, placeholder: "https://whatsapp.com/channel/..." },
  linkedin:          { label: "LinkedIn",         Icon: Linkedin,      placeholder: "https://linkedin.com/company/..." },
  twitter:           { label: "X (Twitter)",      Icon: Twitter,       placeholder: "https://x.com/..." },
  other:             { label: "Lòt rezo",         Icon: Link2,         placeholder: "https://..." },
};

export const DEFAULT_CONTACT: ContactInfo = {
  phones: ["+509 41 55 9094", "+509 34 82 3501"],
  email: "contact@lorefoundation.com",
  address: "Cap-Haïtien, Nord, Haïti",
  whatsappNumber: "50941559094",
  socialLinks: [
    {
      id: "default-facebook",
      platform: "facebook",
      label: "Facebook",
      url: "https://m.facebook.com/story.php?story_fbid=pfbid02r7f2egh23aUwKjVPp6z1J1Rjo97Q3KHHCt5Qc99xkex1VFRgVbc4aTbeUcmED6xTl&id=61589651334475",
    },
    {
      id: "default-instagram",
      platform: "instagram",
      label: "Instagram",
      url: "https://www.instagram.com/lore_foundation?igsh=aWgwbWhlcmF4eTVl",
    },
    {
      id: "default-whatsapp",
      platform: "whatsapp",
      label: "WhatsApp",
      url: "https://wa.me/message/QSQVE7F4WDBGF1",
    },
  ],
};

/** Non yon lyen — non platfòm nan pa "other", oswa non pèsonalize a. */
export function socialLinkLabel(link: SocialLink): string {
  return link.platform === "other" && link.label ? link.label : PLATFORM_META[link.platform].label;
}

/** Fusionne valè ki soti nan Supabase ak default yo, pou pa gen chan vid si done pasyèl. */
export function mergeContactInfo(partial: Partial<ContactInfo> | null | undefined): ContactInfo {
  if (!partial) return DEFAULT_CONTACT;
  return {
    phones: Array.isArray(partial.phones) && partial.phones.length > 0 ? partial.phones : DEFAULT_CONTACT.phones,
    email: partial.email || DEFAULT_CONTACT.email,
    address: partial.address || DEFAULT_CONTACT.address,
    whatsappNumber: partial.whatsappNumber || DEFAULT_CONTACT.whatsappNumber,
    socialLinks: Array.isArray(partial.socialLinks) ? partial.socialLinks : DEFAULT_CONTACT.socialLinks,
  };
}
