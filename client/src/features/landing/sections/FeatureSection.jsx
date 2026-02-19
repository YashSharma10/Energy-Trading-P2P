import { cn } from "@/lib/utils";
import {
  DollarSign,
  MessageCircle,
  Leaf,
  ShieldCheck,
  MapPin,
  CreditCard,
} from "lucide-react";

const notifications = [
  {
    name: "Secure Transactions",
    description: "Blockchain-backed verification. Every trade is recorded and traceable. No disputes, no reversals.",
    icon: <ShieldCheck size={24} className="text-white" />,
    gradient: "from-brandMainColor via-emerald-600 to-emerald-700",
  },
  {
    name: "Verified Credits Only",
    description: "All credits come from Verra, Gold Standard, or ACR certified projects. We check so you don't have to.",
    icon: <Leaf size={24} className="text-white" />,
    gradient: "from-emerald-500 via-brandMainColor to-emerald-700",
  },
  {
    name: "Direct P2P Trading",
    description: "Cut out the middleman. Trade directly with buyers and sellers. Better prices, faster settlements.",
    icon: <DollarSign size={24} className="text-white" />,
    gradient: "from-brandSubColor via-brandMainColor to-emerald-600",
  },
  {
    name: "Live Price Feeds",
    description: "Real-time market data. Know exactly what credits are trading for before you buy or sell.",
    icon: <MessageCircle size={24} className="text-white" />,
    gradient: "from-brandMainColor via-emerald-500 to-brandSubColor",
  },
  {
    name: "Project Directory",
    description: "Browse active renewable energy projects by type, location, and impact metrics. See where your money goes.",
    icon: <MapPin size={24} className="text-white" />,
    gradient: "from-emerald-700 via-brandMainColor to-emerald-900",
  },
  {
    name: "Instant Payouts",
    description: "Multiple payment methods: card, UPI, bank transfer, or crypto. Withdraw anytime.",
    icon: <CreditCard size={24} className="text-white" />,
    gradient: "from-brandMainColor via-emerald-700 to-emerald-900",
  },
];

const Notification = ({ name, description, icon, gradient }) => {
  return (
    <div className="group flex flex-col items-center rounded-2xl border border-border/70 bg-card/95 backdrop-blur-sm p-6 text-center shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-brandMainColor/50 dark:hover:border-brandSubColor/50">
      <div
        className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${gradient} shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl`}
      >
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground group-hover:text-brandMainColor dark:group-hover:text-brandSubColor transition-colors">{name}</h3>
      <p className="mt-2 text-sm text-muted-foreground dark:text-white/80">
        {description}
      </p>
    </div>
  );
}

function FeatureSection({ className }) {
  return (
    <section
      className={cn(
        "relative w-full py-20 px-6 md:px-20 bg-gradient-to-b from-cyan-50/20 via-emerald-50/30 to-lime-50/20 dark:from-cyan-950/5 dark:via-emerald-950/10 dark:to-lime-950/5 text-center",
        className
      )}
    >
      <h1 className="text-3xl md:text-4xl font-bold text-foreground dark:text-white">
        What You Get
      </h1>
      <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground dark:text-white/80">
        A platform built for energy traders. No complexity, no delays, no surprises.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-12">
        {notifications.map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </div>
    </section>
  );
}

export default FeatureSection;
