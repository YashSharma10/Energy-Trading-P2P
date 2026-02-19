import { Marquee } from "@/components/animations/marquee";
import { cn } from "@/lib/utils";
import {
  FaLeaf,
  FaTemperatureHigh,
  FaRecycle,
  FaTree,
  FaGlobeAmericas,
} from "react-icons/fa"; // Adding icons

const reviews = [
  {
    name: "Carbon Market Size",
    username: "@market_trends",
    body: "Voluntary carbon market hit $2B in 2023 and growing. Average credit prices: $8-30 depending on project type and verification.",
    img: <FaGlobeAmericas className="text-3xl text-emerald-600" />,
    bgClass: "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20",
    textClass: "text-emerald-900 dark:text-emerald-100",
  },
  {
    name: "India's Solar Growth",
    username: "@renewable_india",
    body: "India's renewable capacity crossed 180 GW in 2025. Solar is now the dominant generation source. Credits flowing into local and global markets.",
    img: <FaTemperatureHigh className="text-3xl text-orange-600" />,
    bgClass: "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20",
    textClass: "text-orange-900 dark:text-orange-100",
  },
  {
    name: "Corporate Demand",
    username: "@esg_track",
    body: "5000+ companies committed to net-zero by 2030. They need verified credits. Demand > Supply creates pricing efficiency.",
    img: <FaRecycle className="text-3xl text-green-600" />,
    bgClass: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
    textClass: "text-green-900 dark:text-green-100",
  },
  {
    name: "End-to-End Trading",
    username: "@peer2peer",
    body: "P2P eliminates broker markups (typically 20-40%). Direct price discovery. Faster settlements. Better value for all participants.",
    img: <FaTree className="text-3xl text-lime-600" />,
    bgClass: "bg-gradient-to-br from-lime-50 to-lime-100 dark:from-lime-900/20 dark:to-lime-800/20",
    textClass: "text-lime-900 dark:text-lime-100",
  },
  {
    name: "Energy Credits Volume",
    username: "@renewable_projects",
    body: "Wind, solar, and hydro projects generating 2M+ credits annually in India alone. Limited trading infrastructure = price inefficiency.",
    img: <FaLeaf className="text-3xl text-teal-600" />,
    bgClass: "bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20",
    textClass: "text-teal-900 dark:text-teal-100",
  },
  {
    name: "Blockchain Adoption",
    username: "@dlt_energy",
    body: "Distributed ledger tech for energy trading reduces fraud, settles instantly, and creates auditable trail. Already live in Nordic countries.",
    img: <FaLeaf className="text-3xl text-emerald-700" />,
    bgClass: "bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30",
    textClass: "text-emerald-950 dark:text-emerald-50",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({ img, name, username, body, bgClass, textClass }) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
        bgClass
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <div className="flex items-center justify-center rounded-full p-2 bg-white">
          {img}
        </div>
        <div className="flex flex-col">
          <figcaption className={`text-sm font-medium ${textClass}`}>
            {name}
          </figcaption>
          <p className="text-xs font-medium text-gray-500 dark:text-white/40">
            {username}
          </p>
        </div>
      </div>
      <blockquote className={`mt-2 text-sm ${textClass}`}>{body}</blockquote>
    </figure>
  );
};

function FactSection() {
  return (
    <div className="relative flex h-[600px] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-background via-brandMainColor/5 to-background">
      <div className="absolute top-8 z-10 text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground dark:text-white mb-2">
          Market & industry insights
        </h2>
        <p className="text-muted-foreground dark:text-white/70 max-w-2xl mx-auto">Trends driving demand for direct trading
        </p>
      </div>

      {/* Marquee content below */}
      <Marquee pauseOnHover className="[--duration:25s] mt-24">
        {firstRow.map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
    </div>
  );
}

export default FactSection;
