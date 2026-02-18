import { ArrowRight, CheckCircle2, ShoppingBag, TrendingUp, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    icon: <Wallet className="w-8 h-8" />,
    title: "Create Account",
    description: "Sign up in seconds and get instant access to the carbon marketplace",
    color: "from-emerald-500 to-teal-500",
    delay: "0ms",
  },
  {
    icon: <ShoppingBag className="w-8 h-8" />,
    title: "Browse Credits",
    description: "Explore verified carbon credits from renewable energy and reforestation projects",
    color: "from-teal-500 to-cyan-500",
    delay: "150ms",
  },
  {
    icon: <CheckCircle2 className="w-8 h-8" />,
    title: "Purchase & Verify",
    description: "Buy credits with flexible payment options and get blockchain-verified certificates",
    color: "from-cyan-500 to-blue-500",
    delay: "300ms",
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Track Impact",
    description: "Monitor your carbon offset journey with real-time analytics and reporting",
    color: "from-blue-500 to-emerald-500",
    delay: "450ms",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="relative py-20 px-6 md:px-20 bg-gradient-to-b from-background via-emerald-50/20 to-emerald-50/30 dark:from-background dark:via-emerald-950/5 dark:to-emerald-950/10 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(92,179,56,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(155,234,108,0.03),transparent_50%)]"></div>
      
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-brandMainColor bg-brandMainColor/10 rounded-full border border-brandMainColor/20 dark:text-brandSubColor dark:bg-brandSubColor/10 dark:border-brandSubColor/20">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-brandMainColor dark:text-brandSubColor mb-4">
            Start Your Climate Action in 4 Simple Steps
          </h2>
          <p className="text-lg text-muted-foreground dark:text-white/85 max-w-2xl mx-auto">
            Join thousands making a real impact on climate change through transparent carbon credit trading
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-1/4 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20"></div>
          
          {steps.map((step, index) => (
            <Card 
              key={index}
              className="group relative bg-card/80 backdrop-blur-sm border-border/70 hover:border-brandMainColor/50 dark:hover:border-brandSubColor/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              style={{ animationDelay: step.delay }}
            >
              <CardContent className="p-6 text-center">
                {/* Step number */}
                <div className="absolute -top-4 -right-4 w-10 h-10 bg-gradient-to-br from-brandMainColor to-emerald-600 dark:from-brandSubColor dark:to-lime-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className={`mx-auto mb-4 w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  {step.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-brandMainColor dark:group-hover:text-brandSubColor transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground dark:text-white/80">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brandMainColor to-emerald-600 dark:from-brandSubColor dark:to-lime-500 text-white font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            Get Started Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
