import { useDynamicPricing } from "@/hooks/useDynamicPricing";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Zap } from "lucide-react";

const DynamicPriceDisplay = ({ itemId, isProduct = false, basePrice }) => {
  const { pricing, loading, error, isDiscounted, getDiscountPercentage } =
    useDynamicPricing(itemId, isProduct);

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
      </div>
    );
  }

  if (error || !pricing) {
    return (
      <div className="text-sm text-gray-500">
        <p>Base Price: ₹{basePrice?.toLocaleString()}</p>
      </div>
    );
  }

  const temperatureColors = {
    cold: "bg-blue-100 text-blue-800",
    cool: "bg-cyan-100 text-cyan-800",
    moderate: "bg-gray-100 text-gray-800",
    warm: "bg-orange-100 text-orange-800",
    hot: "bg-red-100 text-red-800",
  };

  const discountPercent = getDiscountPercentage();
  const recommendedPrice = pricing?.recommendedPrice || basePrice;
  const marketTemp = pricing?.currentMarketTemperature || "moderate";
  const demandScore = pricing?.demandScore || 0;
  const supplyScore = pricing?.supplyScore || 0;

  return (
    <div className="space-y-3">
      {/* Pricing Section */}
      <div className="flex items-end justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">AI-Recommended Price</p>
          <p className="text-2xl font-bold text-green-600">
            ₹{recommendedPrice.toLocaleString()}
          </p>
          {basePrice && (
            <p className="text-sm text-gray-500 line-through">
              Regular: ₹{basePrice.toLocaleString()}
            </p>
          )}
        </div>

        {/* Status Badge */}
        {isDiscounted() && (
          <Badge variant="default" className="h-fit bg-green-600 hover:bg-green-700">
            <TrendingDown className="w-3 h-3 mr-1" />
            Save {discountPercent}%
          </Badge>
        )}
      </div>

      {/* Market Temperature */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-600">Market Heat:</span>
        <Badge
          className={`${
            temperatureColors[marketTemp]
          } capitalize`}
          variant="outline"
        >
          <Zap className="w-3 h-3 mr-1" />
          {marketTemp}
        </Badge>
      </div>

      {/* Market Metrics */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-gray-50 p-2 rounded">
          <p className="text-gray-600">Demand</p>
          <p className="font-semibold text-gray-800">
            {demandScore}/100
          </p>
        </div>
        <div className="bg-gray-50 p-2 rounded">
          <p className="text-gray-600">Supply</p>
          <p className="font-semibold text-gray-800">
            {supplyScore}/100
          </p>
        </div>
      </div>

      {/* Price Factors */}
      {pricing.factors && (
        <details className="text-xs">
          <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
            View Pricing Factors
          </summary>
          <div className="mt-2 space-y-1 bg-gray-50 p-2 rounded text-gray-600">
            {pricing.factors.demandFactor && (
              <p>
                Demand Factor:{" "}
                <span className="font-semibold">
                  {(pricing.factors.demandFactor * 100).toFixed(0)}%
                </span>
              </p>
            )}
            {pricing.factors.supplyFactor && (
              <p>
                Supply Factor:{" "}
                <span className="font-semibold">
                  {(pricing.factors.supplyFactor * 100).toFixed(0)}%
                </span>
              </p>
            )}
            {pricing.factors.rateFactor && (
              <p>
                Rating Factor:{" "}
                <span className="font-semibold">
                  {(pricing.factors.rateFactor * 100).toFixed(0)}%
                </span>
              </p>
            )}
            {pricing.factors.trendFactor && (
              <p>
                Trend Factor:{" "}
                <span className="font-semibold">
                  {(pricing.factors.trendFactor * 100).toFixed(0)}%
                </span>
              </p>
            )}
          </div>
        </details>
      )}

      {/* Last Updated */}
      <p className="text-xs text-gray-500">
        Last updated: {new Date(pricing.lastUpdatedAt).toLocaleString()}
      </p>
    </div>
  );
};

export default DynamicPriceDisplay;
