import { getTestimonials } from "@/lib/testimonials";
import TestimonialsManager from "@/components/TestimonialsManager";

export default async function AdminTestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div>
      <h1 className="font-serif text-3xl mb-2">Reviews</h1>
      <p className="text-sm text-warmgray mb-8 max-w-xl">
        Reviews you add here appear in the Testimonials section on the homepage. Delete the
        demo reviews once you have real ones to add.
      </p>
      <TestimonialsManager initial={testimonials} />
    </div>
  );
}
