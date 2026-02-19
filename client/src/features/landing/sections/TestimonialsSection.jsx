import { Card, CardContent } from "@/components/ui/card";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Akshay Patel",
    role: "Renewable Energy Consultant",
    company: "Solar Power Solutions",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Akshay",
    content: "Sold 5000 credits in the first month. The P2P model cuts out middlemen and I get paid instantly. Prices are fair too.",
    rating: 5,
  },
  {
    name: "Neha Desai",
    role: "Operations",
    company: "Manufacturing Firm",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neha",
    content: "We use CarbonEase to track and sell our excess carbon credits. Each listing gets multiple offers within hours. Good inventory management tool too.",
    rating: 5,
  },
  {
    name: "Rohan Sharma",
    role: "Freelance Trader",
    company: "Self-Employed",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan",
    content: "Made this my side income. Credit prices are transparent and I can see the project details before buying. No surprises.",
    rating: 5,
  },
  {
    name: "Priya Khanna",
    role: "ESG Manager",
    company: "Tech Company",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    content: "Buy verified credits here for our net-zero commitments. The blockchain receipts satisfy our auditors. Good prices compared to traditional brokers.",
    rating: 5,
  },
  {
    name: "Vikram Singh",
    role: "Wind Farm Owner",
    company: "Green Power Ltd",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
    content: "Directly list our generated credits here. No agents, no delays. Settlement happens same day. This is how trading should work.",
    rating: 5,
  },
  {
    name: "Deepa Gupta",
    role: "Compliance Officer",
    company: "Carbon Consulting",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Deepa",
    content: "Every trade is documented on chain. Audit trails are complete. Makes compliance reporting straightforward for our clients.",
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
            From Our Users
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-white mb-4">
            What traders are saying
          </h2>
          <p className="text-lg text-muted-foreground dark:text-white/80 max-w-2xl mx-auto">
            Real feedback from people actually using the platform
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
