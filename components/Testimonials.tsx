import { getSupabase } from "@/lib/supabase";
import { testimonials as fallbackTestimonials, type Testimonial } from "@/lib/data";
import TestimonialsClient from "@/components/TestimonialsClient";

async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data) throw error;

    return data.map((row) => ({
      name: row.name,
      role: row.role,
      quote: row.quote,
      initials: row.initials,
    }));
  } catch {
    return fallbackTestimonials;
  }
}

export default async function Testimonials() {
  const items = await getTestimonials();
  return <TestimonialsClient items={items} />;
}
