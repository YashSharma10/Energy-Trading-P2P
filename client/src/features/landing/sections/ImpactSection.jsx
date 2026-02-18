import { NumberTicker } from "@/components/magicui/number-ticker";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, Leaf, TrendingUp, Users } from "lucide-react";

const stats = [
  {
    icon: <Leaf className="w-8 h-8" />,
    value: 250000,
    suffix: "+",
    label: "Carbon Credits Traded",
    description: "Tons of CO₂ offset globally",
    color: "from-emerald-500 to-green-600",
  },
  {
    icon: <Users className="w-8 h-8" />,
    value: 15000,
    suffix: "+",
    label: "Active Users",
    description: "Making climate action daily",
    color: "from-teal-500 to-cyan-600",
  },
  {
    icon: <Globe className="w-8 h-8" />,
    value: 45,
    suffix: "+",
    label: "Countries Served",
    description: "Global reach, local impact",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    value: 98,
    suffix: "%",
    label: "Verification Rate",
    description: "Blockchain-certified credits",
    color: "from-lime-500 to-emerald-600",
  },
];

const ImpactSection = () => {
  return (
    <section className="relative py-20 px-6 md:px-20 bg-gradient-to-b from-emerald-50/30 via-lime-50/20 to-background dark:from-emerald-950/10 dark:via-lime-950/5 dark:to-background overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-400/15 rounded-full mix-blend-multiply filter blur-3xl animate-pulse dark:bg-emerald-500/8"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-lime-400/15 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000 dark:bg-lime-500/8"></div>
      
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-brandMainColor bg-brandMainColor/10 rounded-full border border-brandMainColor/20 dark:text-brandSubColor dark:bg-brandSubColor/10 dark:border-brandSubColor/20">
            Our Impact
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-brandMainColor dark:text-brandSubColor mb-4">
            Creating Real Climate Impact
          </h2>
          <p className="text-lg text-muted-foreground dark:text-white/85 max-w-2xl mx-auto">
            Together we're making a measurable difference in the fight against climate change
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="group relative bg-card/90 backdrop-blur-sm border-border/70 hover:border-brandMainColor/50 dark:hover:border-brandSubColor/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              <CardContent className="p-6 text-center relative z-10">
                {/* Icon */}
                <div className={`mx-auto mb-4 w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                  {stat.icon}
                </div>
                
                {/* Animated number */}
                <div className="flex items-center justify-center mb-2">
                  <NumberTicker
                    value={stat.value}
                    className="text-4xl md:text-5xl font-bold text-foreground"
                  />
                  <span className="text-4xl md:text-5xl font-bold text-brandMainColor dark:text-brandSubColor ml-1">
                    {stat.suffix}
                  </span>
                </div>
                
                {/* Label */}
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {stat.label}
                </h3>
                <p className="text-sm text-muted-foreground dark:text-white/80">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center p-8 rounded-3xl bg-gradient-to-r from-brandMainColor/10 to-brandSubColor/10 dark:from-brandMainColor/20 dark:to-brandSubColor/20 border border-brandMainColor/20 dark:border-brandSubColor/20">
          <h3 className="text-2xl md:text-3xl font-bold text-brandMainColor dark:text-brandSubColor mb-3">
            Ready to be part of the solution?
          </h3>
          <p className="text-muted-foreground dark:text-white/85 mb-6 max-w-2xl mx-auto">
            Join our community of climate-conscious individuals and businesses making a real difference
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-8 py-3 bg-gradient-to-r from-brandMainColor to-emerald-600 dark:from-brandSubColor dark:to-lime-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              Start Trading Credits
            </button>
            <button className="px-8 py-3 bg-background border-2 border-brandMainColor dark:border-brandSubColor text-brandMainColor dark:text-brandSubColor font-semibold rounded-full hover:bg-brandMainColor/10 dark:hover:bg-brandSubColor/10 transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
