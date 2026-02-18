import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { year: "2015", emissions: 35.9 },
  { year: "2016", emissions: 36.2 },
  { year: "2017", emissions: 36.5 },
  { year: "2018", emissions: 36.6 },
  { year: "2019", emissions: 36.7 },
  { year: "2020", emissions: 34.7 },
  { year: "2021", emissions: 36.3 },
  { year: "2022", emissions: 37.1 },
  { year: "2023", emissions: 37.4 },
  { year: "2024", emissions: 37.8 },
  { year: "2025", emissions: 38.2 },
];

const StatsSection = () => {
  return (
    <section className="flex w-full flex-col items-center justify-between gap-10 bg-gradient-to-b from-background via-teal-50/20 to-cyan-50/20 dark:from-background dark:via-teal-950/5 dark:to-cyan-950/5 py-10 px-6 lg:flex-row">
      {/* Left: Graph Section */}
      <div className="w-full lg:w-2/3 h-[350px] flex flex-col items-center">
        <h2 className="mb-6 text-center text-2xl font-bold text-brandMainColor dark:text-brandSubColor lg:text-left">
          Global CO₂ Emissions (2015 - 2025)
        </h2>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 40, left: 60, bottom: 10 }} // Adjusted margins for spacing
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis
              label={{
                value: "Billion Metric Tons",
                angle: -90,
                position: "outsideLeft",
                dx: -15, // Moves label further left
                fontSize: 14,
              }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value) => `${value} Billion Metric Tons`}
              labelFormatter={(label) => `Year: ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="emissions"
              stroke="#5CB338"
              strokeWidth={3}
              dot={{ r: 4, fill: "#4A8E2B" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Right: About Section */}
      <div className="w-full rounded-2xl border border-border/70 bg-gradient-to-br from-card/95 to-card/80 p-6 shadow-xl backdrop-blur-sm lg:w-1/3">
        <h3 className="text-xl font-semibold text-brandMainColor dark:text-brandSubColor">
          Understanding the Data
        </h3>
        <p className="mt-3 text-muted-foreground dark:text-white/85">
          This graph tracks <b>global CO₂ emissions</b> from{" "}
          <b>2015 to 2025</b> in <b>billion metric tons</b>. Understanding these trends
          is critical for climate action and carbon markets.
        </p>

        <ul className="mt-4 space-y-2 text-sm text-muted-foreground dark:text-white/85">
          <li>
            🌍 Peak emissions of <b>38.2 billion metric tons</b> projected for <b>2025</b>
          </li>
          <li>
            📉 COVID-19 caused a historic drop in <b>2020 (34.7)</b>, but emissions rebounded
          </li>
          <li>
            📈 Current trajectory shows <b>3% increase</b> since 2020, highlighting urgent need for action
          </li>
        </ul>

        <h4 className="mt-5 text-lg font-semibold text-brandMainColor dark:text-brandSubColor">
          Why CarbonEase Matters
        </h4>
        <p className="mt-2 text-muted-foreground dark:text-white/85">
          With the <b>voluntary carbon market</b> projected to reach <b>$100B by 2030</b>,
          understanding emissions helps you:
        </p>
        <ul className="mt-3 space-y-1 text-sm text-muted-foreground dark:text-white/85">
          <li>
            💰 Trade <strong>verified carbon credits</strong> transparently and securely
          </li>
          <li>
            🎯 Achieve <b>net-zero goals</b> through measurable offset strategies
          </li>
          <li>
            🌱 Support <b>renewable energy projects</b> worldwide
          </li>
          <li>
            📊 Track real-time impact with <b>blockchain-verified transactions</b>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default StatsSection;
