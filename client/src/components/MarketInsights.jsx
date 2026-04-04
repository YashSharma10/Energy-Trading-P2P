import { useMarketInsights } from "@/hooks/useDynamicPricing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

const MarketInsights = () => {
  const { insights, loading } = useMarketInsights(true);

  if (loading || !insights) {
    return (
      <Card className="border-border/60 bg-card/95 p-4 shadow-lg dark:bg-card/90">
        <div className="space-y-3">
          <div className="h-6 animate-pulse rounded bg-muted"></div>
          <div className="h-4 w-3/4 animate-pulse rounded bg-muted"></div>
        </div>
      </Card>
    );
  }

  const avgPriceChange = insights.averagePriceChange || 0;
  const avgDemandScore = (insights.averageDemandScore || 0).toFixed(0);
  const avgSupplyScore = (insights.averageSupplyScore || 0).toFixed(0);
  const tempDistribution = insights.temperatureDistribution || {};

  const isPriceUp = avgPriceChange > 0;
  const priceChangePercent = ((Math.abs(avgPriceChange) / 100) * 100).toFixed(1);

  return (
    <Card className="border border-border/60 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 shadow-lg dark:border-border/60 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <span className="text-2xl">📊</span>
          Market Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Average Price Change */}
        <div className="space-y-2 rounded-lg border border-border/60 bg-white p-4 shadow-sm dark:border-border/60 dark:bg-slate-900/80">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Average Price Movement
            </span>
            <div className="flex items-center gap-1">
              {isPriceUp ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span
                className={`font-bold text-lg ${
                  isPriceUp ? "text-green-600" : "text-red-600"
                }`}
              >
                {isPriceUp ? "+" : "-"}₹{Math.abs(avgPriceChange).toFixed(2)}
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Market prices are{" "}
            {isPriceUp ? "increasing" : "decreasing"} on average
          </p>
        </div>

        {/* Demand & Supply Scores */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border/60 bg-white p-3 shadow-sm dark:border-border/60 dark:bg-slate-900/80">
            <p className="mb-1 text-xs font-medium text-slate-600 dark:text-slate-300">
              Avg Demand Score
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {avgDemandScore}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">/100</span>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${avgDemandScore}%` }}
              ></div>
            </div>
          </div>

          <div className="rounded-lg border border-border/60 bg-white p-3 shadow-sm dark:border-border/60 dark:bg-slate-900/80">
            <p className="mb-1 text-xs font-medium text-slate-600 dark:text-slate-300">
              Avg Supply Score
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {avgSupplyScore}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">/100</span>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-full bg-purple-500"
                style={{ width: `${avgSupplyScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Market Temperature Distribution */}
        <div className="rounded-lg border border-border/60 bg-white p-4 shadow-sm dark:border-border/60 dark:bg-slate-900/80">
          <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-200">
            Market Temperature Distribution
          </p>
          <div className="space-y-2">
            {Object.entries(tempDistribution).map(([temp, count]) => {
              const tempColors = {
                cold: "bg-blue-400",
                cool: "bg-cyan-400",
                moderate: "bg-gray-400",
                warm: "bg-orange-400",
                hot: "bg-red-500",
              };

              const tempBgColors = {
                cold: "bg-blue-50",
                cool: "bg-cyan-50",
                moderate: "bg-gray-50",
                warm: "bg-orange-50",
                hot: "bg-red-50",
              };

              const totalListings = Object.values(tempDistribution).reduce(
                (a, b) => a + b,
                0
              );
              const percentage = ((count / totalListings) * 100).toFixed(0);

              return (
                <div
                  key={temp}
                  className={`${tempBgColors[temp]} flex items-center justify-between rounded border border-border/40 p-2 dark:border-border/60 dark:bg-slate-800/70`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${tempColors[temp]}`}
                    ></div>
                    <span className="text-sm font-medium capitalize text-slate-700 dark:text-slate-200">
                      {temp}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {count} ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Price Multiplier Range */}
        {insights.priceMultiplierRange && (
          <div className="rounded-lg border border-border/60 bg-white p-4 shadow-sm dark:border-border/60 dark:bg-slate-900/80">
            <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              Price Multiplier Range
            </p>
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
              <div>
                <p className="text-slate-500 dark:text-slate-400">Min</p>
                <p className="font-semibold text-slate-800 dark:text-slate-100">
                  {insights.priceMultiplierRange.min.toFixed(2)}x
                </p>
              </div>
              <div className="text-center">
                <p className="text-slate-500 dark:text-slate-400">Average</p>
                <p className="font-semibold text-slate-800 dark:text-slate-100">
                  {insights.priceMultiplierRange.avg.toFixed(2)}x
                </p>
              </div>
              <div className="text-right">
                <p className="text-slate-500 dark:text-slate-400">Max</p>
                <p className="font-semibold text-slate-800 dark:text-slate-100">
                  {insights.priceMultiplierRange.max.toFixed(2)}x
                </p>
              </div>
            </div>
          </div>
        )}

        <p className="pt-2 text-xs text-slate-500 dark:text-slate-400">
          💡 Use these insights to make informed pricing decisions
        </p>
      </CardContent>
    </Card>
  );
};

export default MarketInsights;
