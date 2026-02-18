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
    name: "Carbon Market Growth",
    username: "@carbon_markets",
    body: "The voluntary carbon market is projected to reach $100 billion by 2030, growing 15x from 2021 levels. Join the climate revolution!",
    img: <FaGlobeAmericas className="text-3xl text-emerald-600" />,
    bgClass: "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20",
    textClass: "text-emerald-900 dark:text-emerald-100",
  },
  {
    name: "Temperature Rising",
    username: "@climate_science",
    body: "Global temperatures have risen 1.2°C since pre-industrial times. Every 0.1°C matters - we must limit warming to 1.5°C by 2030.",
    img: <FaTemperatureHigh className="text-3xl text-orange-600" />,
    bgClass: "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20",
    textClass: "text-orange-900 dark:text-orange-100",
  },
  {
    name: "Renewable Revolution",
    username: "@clean_energy",
    body: "Renewable energy now accounts for 35% of global electricity in 2025! Solar and wind are now the cheapest sources of power.",
    img: <FaRecycle className="text-3xl text-green-600" />,
    bgClass: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
    textClass: "text-green-900 dark:text-green-100",
  },
  {
    name: "Forest Conservation",
    username: "@forest_guardian",
    body: "Reforestation projects can sequester 10 gigatons of CO₂ annually by 2050. Plant trees, buy credits, make a difference!",
    img: <FaTree className="text-3xl text-lime-600" />,
    bgClass: "bg-gradient-to-br from-lime-50 to-lime-100 dark:from-lime-900/20 dark:to-lime-800/20",
    textClass: "text-lime-900 dark:text-lime-100",
  },
  {
    name: "Corporate Commitments",
    username: "@net_zero_2030",
    body: "Over 5,000 companies have committed to net-zero emissions by 2030. Carbon credits are essential to achieving these goals.",
    img: <FaLeaf className="text-3xl text-teal-600" />,
    bgClass: "bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20",
    textClass: "text-teal-900 dark:text-teal-100",
  },
  {
    name: "India's Climate Action",
    username: "@india_climate",
    body: "India aims for 500 GW renewable capacity by 2030 and net-zero by 2070. CarbonEase supports this transition with verified credits.",
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

export function FactSection() {
  return (
    <div className="relative flex h-[600px] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-background via-brandMainColor/5 to-background">
      <div className="absolute top-8 z-10 text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-brandMainColor dark:text-brandSubColor mb-2">
          Climate Facts & Market Insights
        </h2>
        <p className="text-muted-foreground dark:text-white/70 max-w-2xl mx-auto">
          Stay informed with the latest climate statistics and carbon market trends
        </p>
      </div>
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
