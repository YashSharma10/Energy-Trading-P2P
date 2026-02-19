import { useState, useEffect } from "react";
import { Zap, TrendingUp, TrendingDown, Activity, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useMarketInsights } from "@/hooks/useDynamicPricing";
import { Switch } from "@/components/ui/switch";

const emissionFactors = {
  electricity: 0.5, // kg CO2/kWh
  diesel: 2.68, // kg CO2/liter
  petrol: 2.31, // kg CO2/liter
  flight: 0.15, // kg CO2/passenger-km
  naturalGas: 2.03, // kg CO2/m3
  coal: 2.86, // kg CO2/kg
  bus: 0.1, // kg CO2/passenger-km
  train: 0.05, // kg CO2/passenger-km
};

const unitOptions = {
  electricity: ["kWh", "MWh"],
  diesel: ["liters", "gallons"],
  petrol: ["liters", "gallons"],
  flight: ["passenger-km", "miles"],
  naturalGas: ["m3", "cubic feet"],
  coal: ["kg", "tons"],
  bus: ["passenger-km", "miles"],
  train: ["passenger-km", "miles"],
};

const CarbonEmissionCalculator = () => {
  const { insights, loading: insightsLoading, refreshInsights } = useMarketInsights(true);
  
  const [activities, setActivities] = useState(
    Object.keys(emissionFactors).map((type) => ({
      type,
      amount: 0,
      unit: unitOptions[type][0],
    })),
  );

  const [totalEmissions, setTotalEmissions] = useState(0);
  const [requiredCredits, setRequiredCredits] = useState(0);
  const [useMarketPrice, setUseMarketPrice] = useState(true);
  const [customCreditCost, setCustomCreditCost] = useState(10);
  const [showResults, setShowResults] = useState(false);

  // Calculate market average price from insights
  const marketAveragePrice = insights?.averagePrice || 10;
  const creditCost = useMarketPrice ? marketAveragePrice : customCreditCost;

  // Update custom price when market price changes (first time)
  useEffect(() => {
    if (insights?.averagePrice && customCreditCost === 10) {
      setCustomCreditCost(insights.averagePrice);
    }
  }, [insights?.averagePrice]);

  const handleActivityChange = (index, field, value) => {
    const updatedActivities = [...activities];
    updatedActivities[index] = { ...updatedActivities[index], [field]: value };
    setActivities(updatedActivities);
  };

  const calculateEmissions = () => {
    const emissions = activities.reduce((total, activity) => {
      const amount = parseFloat(activity.amount) || 0;
      return total + amount * (emissionFactors[activity.type] || 0);
    }, 0);

    const totalEmissionsTons = emissions / 1000;
    setTotalEmissions(totalEmissionsTons);
    setRequiredCredits(Math.ceil(totalEmissionsTons));
    setShowResults(true);
  };

  return (
    <div className="bg-background">
      <div className="border-b border-border bg-yellow-50 dark:bg-yellow-950/30">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary shrink-0" />
          <div>
            <h1 className="text-lg font-semibold text-foreground leading-tight">
              Carbon Emission Calculator
            </h1>
            <p className="text-xs text-muted-foreground">
              Estimate emissions across power, travel, and fuel usage and
              translate them into verified carbon credits
            </p>
          </div>
        </div>
      </div>

      <section className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.65fr,1fr]">
          <Card className="border border-border/70 bg-card/90 shadow-xl">
            <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="text-left">
                <CardTitle className="text-2xl font-semibold text-foreground">
                  Activity inputs
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                  Feed in your energy, mobility, and fuel data—CarbonEase
                  converts it into emissions instantly.
                </CardDescription>
              </div>
              <span className="w-fit rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                Live calculator
              </span>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {activities.map((activity, index) => (
                  <div
                    key={activity.type}
                    className="flex h-full flex-col justify-between rounded-2xl border border-border/70 bg-background/80 p-5 shadow-inner transition-transform duration-150 hover:-translate-y-1"
                  >
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {activity.type === "flight" ||
                        activity.type === "bus" ||
                        activity.type === "train"
                          ? "Mobility"
                          : activity.type === "electricity" ||
                              activity.type === "naturalGas"
                            ? "Energy"
                            : "Fuel"}
                      </p>
                      <h3 className="text-lg font-semibold text-foreground">
                        {activity.type.charAt(0).toUpperCase() +
                          activity.type.slice(1)}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Enter usage to include this source in the footprint.
                      </p>
                    </div>
                    <div className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor={`amount-${index}`}
                          className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                        >
                          Amount
                        </Label>
                        <Input
                          id={`amount-${index}`}
                          type="number"
                          className="border border-border bg-background/[0.85] text-foreground placeholder:text-muted-foreground focus:border-brandMainColor focus:ring-brandMainColor"
                          value={activity.amount}
                          onChange={(e) =>
                            handleActivityChange(
                              index,
                              "amount",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          placeholder={`Enter ${activity.type} usage`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Unit
                        </Label>
                        <Select
                          value={activity.unit}
                          onValueChange={(value) =>
                            handleActivityChange(index, "unit", value)
                          }
                        >
                          <SelectTrigger className="border border-border bg-background/[0.85] text-foreground focus:border-brandMainColor focus:ring-brandMainColor">
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                          <SelectContent>
                            {unitOptions[activity.type].map((unit) => (
                              <SelectItem key={unit} value={unit}>
                                {unit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-6 lg:sticky lg:top-24">
            <Card className="border border-border/70 bg-card/90 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold text-foreground">
                      Credits and pricing
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      Dynamic market-based pricing for accurate cost estimation
                    </CardDescription>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={refreshInsights}
                    disabled={insightsLoading}
                  >
                    <RefreshCw className={`h-4 w-4 ${insightsLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Market Price Display */}
                <div className="rounded-lg border border-border/60 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-semibold text-foreground">Market Price</span>
                    </div>
                    <Badge variant="outline" className="text-blue-600 border-blue-600">
                      Live
                    </Badge>
                  </div>
                  
                  {insightsLoading ? (
                    <div className="space-y-2">
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-3xl font-bold text-foreground">
                          ${marketAveragePrice.toFixed(2)}
                        </span>
                        <span className="text-sm text-muted-foreground">per credit</span>
                      </div>
                      
                      {insights?.averagePriceChange !== undefined && (
                        <div className="flex items-center gap-1 text-sm">
                          {insights.averagePriceChange > 0 ? (
                            <>
                              <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                              <span className="text-green-600 dark:text-green-400 font-medium">
                                +${Math.abs(insights.averagePriceChange).toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <>
                              <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                              <span className="text-red-600 dark:text-red-400 font-medium">
                                -${Math.abs(insights.averagePriceChange).toFixed(2)}
                              </span>
                            </>
                          )}
                          <span className="text-muted-foreground ml-1">from average</span>
                        </div>
                      )}

                      {/* Market Metrics */}
                      {insights && (
                        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border/30">
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground mb-1">Demand</p>
                            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                              {(insights.averageDemandScore || 0).toFixed(0)}/100
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground mb-1">Supply</p>
                            <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                              {(insights.averageSupplyScore || 0).toFixed(0)}/100
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Toggle between market and custom price */}
                <div className="flex items-center justify-between space-x-2 rounded-lg border border-border/60 bg-muted/30 p-3">
                  <Label htmlFor="market-price-toggle" className="text-sm font-medium cursor-pointer">
                    Use Market Price
                  </Label>
                  <Switch
                    id="market-price-toggle"
                    checked={useMarketPrice}
                    onCheckedChange={setUseMarketPrice}
                  />
                </div>

                {/* Custom price input (only show when not using market price) */}
                {!useMarketPrice && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="custom-credit-cost"
                      className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                    >
                      Custom Cost per Credit (USD)
                    </Label>
                    <Input
                      id="custom-credit-cost"
                      type="number"
                      className="border border-border bg-background/[0.85] text-foreground placeholder:text-muted-foreground focus:border-brandMainColor focus:ring-brandMainColor"
                      value={customCreditCost}
                      onChange={(e) =>
                        setCustomCreditCost(parseFloat(e.target.value) || 0)
                      }
                      placeholder="Enter custom cost per credit"
                    />
                  </div>
                )}

                <Button
                  onClick={calculateEmissions}
                  className="w-full bg-brandMainColor text-sm font-semibold text-white hover:bg-brandMainColor/90"
                >
                  Calculate emissions
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-border/70 bg-card/95 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-foreground">
                  Results snapshot
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Shareable metrics for finance, sustainability, and leadership
                  teams.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {showResults ? (
                  <div className="grid gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Total emissions
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-foreground">
                        {totalEmissions.toFixed(2)} tCO₂e
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Credits required
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-foreground">
                        {requiredCredits}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Estimated offset cost
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-foreground">
                        ${(requiredCredits * creditCost).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-border/60 bg-background/80 p-5 text-sm text-muted-foreground">
                    Run the calculator to surface total emissions, credits to
                    retire, and procurement-ready cost estimates.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border border-brandMainColor/40 bg-gradient-to-br from-brandMainColor/15 via-background to-background p-6 text-center shadow-xl dark:border-brandSubColor/40 dark:from-brandSubColor/20">
              <CardContent className="space-y-4">
                <CardTitle className="text-lg font-semibold text-foreground">
                  Need verified offsets?
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                  Export scenarios directly into the CarbonEase marketplace and
                  fast-track credit sourcing aligned to your reduction plan.
                </CardDescription>
                <Link
                  to="/market"
                  className="inline-flex items-center justify-center rounded-full bg-brandMainColor px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brandMainColor/90 dark:bg-brandSubColor dark:text-slate-950 dark:hover:bg-brandSubColor/90"
                >
                  Browse verified credits
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CarbonEmissionCalculator;
