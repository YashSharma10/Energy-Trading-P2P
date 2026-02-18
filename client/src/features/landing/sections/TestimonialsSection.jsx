import { Card, CardContent } from "@/components/ui/card";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Sustainability Director",
    company: "EcoTech Solutions",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    content: "CarbonEase has transformed how we approach our carbon offsetting strategy. The transparency and ease of use are unmatched.",
    rating: 5,
  },
  {
    name: "Rajesh Kumar",
    role: "CFO",
    company: "GreenEnergy India",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh",
    content: "The blockchain verification gives us complete confidence in our carbon credit purchases. A game-changer for corporate sustainability.",
    rating: 5,
  },
  {
    name: "Maria Garcia",
    role: "Environmental Consultant",
    company: "ClimateFirst Consulting",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    content: "Finally, a platform that makes carbon trading accessible and trustworthy. The real-time analytics help us track our impact effectively.",
    rating: 5,
  },
  {
    name: "David Chen",
    role: "Operations Manager",
    company: "Urban Logistics Co.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    content: "We've offset over 50,000 tons through CarbonEase. The platform is intuitive and the support team is exceptional.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "CEO",
    company: "Renewable Ventures",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    content: "As a seller, CarbonEase provides the perfect marketplace to connect with buyers who value verified, high-quality credits.",
    rating: 5,
  },
  {
    name: "James Wilson",
    role: "Sustainability Lead",
    company: "Global Manufacturing Inc.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    content: "The emission calculator and project mapping features have made our net-zero journey much more manageable and measurable.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="relative py-20 px-6 md:px-20 bg-gradient-to-b from-lime-50/20 via-emerald-50/20 to-background dark:from-lime-950/5 dark:via-emerald-950/5 dark:to-background overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#5CB33808_1px,transparent_1px),linear-gradient(to_bottom,#5CB33808_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-brandMainColor bg-brandMainColor/10 rounded-full border border-brandMainColor/20 dark:text-brandSubColor dark:bg-brandSubColor/10 dark:border-brandSubColor/20">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-brandMainColor dark:text-brandSubColor mb-4">
            Trusted by Climate Leaders
          </h2>
          <p className="text-lg text-muted-foreground dark:text-white/85 max-w-2xl mx-auto">
            See what our community says about their experience with CarbonEase
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="group bg-card/90 backdrop-blur-sm border-border/70 hover:border-brandMainColor/50 dark:hover:border-brandSubColor/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              <CardContent className="p-6">
                {/* Quote icon */}
                <div className="mb-4 w-12 h-12 bg-gradient-to-br from-brandMainColor to-emerald-600 dark:from-brandSubColor dark:to-lime-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Quote className="w-6 h-6" />
                </div>
                
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                {/* Content */}
                <p className="text-muted-foreground dark:text-white/80 mb-6 italic">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                
                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-100 to-lime-100 dark:from-emerald-900 dark:to-lime-900"
                  />
                  <div>
                    <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground dark:text-white/70">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
