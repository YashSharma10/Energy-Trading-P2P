import { useMarketInsights } from "@/hooks/useDynamicPricing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

const MarketInsights = () => {
  const { insights, loading } = useMarketInsights(true);

  if (loading || !insights) {
    return (
      <Card className="p-4">
        <div className="space-y-3">
          <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
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
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">📊</span>
          Market Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Average Price Change */}
        <div className="bg-white rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
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
          <p className="text-xs text-gray-500">
            Market prices are{" "}
            {isPriceUp ? "increasing" : "decreasing"} on average
          </p>
        </div>

        {/* Demand & Supply Scores */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-3">
            <p className="text-xs font-medium text-gray-600 mb-1">
              Avg Demand Score
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-blue-600">
                {avgDemandScore}
              </span>
              <span className="text-xs text-gray-500">/100</span>
            </div>
            <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${avgDemandScore}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3">
            <p className="text-xs font-medium text-gray-600 mb-1">
              Avg Supply Score
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-purple-600">
                {avgSupplyScore}
              </span>
              <span className="text-xs text-gray-500">/100</span>
            </div>
            <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500"
                style={{ width: `${avgSupplyScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Market Temperature Distribution */}
        <div className="bg-white rounded-lg p-4">
          <p className="text-sm font-medium text-gray-700 mb-3">
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
                  className={`${tempBgColors[temp]} rounded p-2 flex items-center justify-between`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${tempColors[temp]}`}
                    ></div>
                    <span className="text-sm font-medium capitalize text-gray-700">
                      {temp}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {count} ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Price Multiplier Range */}
        {insights.priceMultiplierRange && (
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Price Multiplier Range
            </p>
            <div className="flex justify-between text-xs text-gray-600">
              <div>
                <p className="text-gray-500">Min</p>
                <p className="font-semibold text-gray-800">
                  {insights.priceMultiplierRange.min.toFixed(2)}x
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-500">Average</p>
                <p className="font-semibold text-gray-800">
                  {insights.priceMultiplierRange.avg.toFixed(2)}x
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-500">Max</p>
                <p className="font-semibold text-gray-800">
                  {insights.priceMultiplierRange.max.toFixed(2)}x
                </p>
              </div>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500 pt-2">
          💡 Use these insights to make informed pricing decisions
        </p>
      </CardContent>
    </Card>
  );
};

export default MarketInsights;
