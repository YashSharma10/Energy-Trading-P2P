import { useMarketInsights } from "@/hooks/useDynamicPricing";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity, Info, BarChart, ThermometerSun, AlertCircle } from "lucide-react";

const MarketInsights = () => {
  const { insights, loading } = useMarketInsights(true);

  if (loading || !insights) {
    return (
      <Card className="border-border/40 bg-card/60 rounded-3xl backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="p-8 space-y-4">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-muted"></div>
          <div className="h-32 w-full animate-pulse rounded-2xl bg-muted/50"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-40 animate-pulse rounded-2xl bg-muted/50"></div>
            <div className="h-40 animate-pulse rounded-2xl bg-muted/50"></div>
            <div className="h-40 animate-pulse rounded-2xl bg-muted/50"></div>
          </div>
        </div>
      </Card>
    );
  }

  const avgPriceChange = insights.averagePriceChange || 0;
  const avgDemandScore = (insights.averageDemandScore || 0).toFixed(0);
  const avgSupplyScore = (insights.averageSupplyScore || 0).toFixed(0);
  const tempDistribution = insights.temperatureDistribution || {};

  const isPriceUp = avgPriceChange > 0;
  // const priceChangePercent = ((Math.abs(avgPriceChange) / 100) * 100).toFixed(1);

  return (
    <Card className="border border-border/30 bg-card/60 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <BarChart className="w-64 h-64 text-brandMainColor dark:text-brandSubColor" />
      </div>
      
      <CardHeader className="border-b border-border/20 bg-muted/10 pb-6 px-8 rounded-t-3xl relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-extrabold flex items-center gap-3">
              <Activity className="w-7 h-7 text-brandMainColor dark:text-brandSubColor" />
              Market Intelligence
            </CardTitle>
            <CardDescription className="text-sm mt-1 text-muted-foreground">
              Real-time analytics and predictive pricing trends
            </CardDescription>
          </div>
          <div className="hidden md:flex p-3 rounded-2xl bg-brandMainColor/10 dark:bg-brandSubColor/10">
            <Info className="w-5 h-5 text-brandMainColor dark:text-brandSubColor" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-8 space-y-8 relative z-10">
        {/* Top Summary Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Price Movement */}
          <div className="col-span-1 rounded-2xl border border-border/40 bg-background/50 p-6 flex flex-col justify-center shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Price Movement
              </span>
              <div className={`p-2 rounded-xl ${isPriceUp ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                {isPriceUp ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-extrabold tracking-tight ${isPriceUp ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {isPriceUp ? "+" : "-"}₹{Math.abs(avgPriceChange).toFixed(2)}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              Prices are {isPriceUp ? "rising" : "falling"} across the network
            </p>
          </div>

          {/* Scores */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border/40 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 flex flex-col justify-center shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Demand Score</span>
                <span className="text-3xl font-black text-blue-600 dark:text-blue-400">{avgDemandScore}<span className="text-lg text-muted-foreground font-medium">/100</span></span>
              </div>
              <div className="h-2 bg-blue-100 dark:bg-blue-950 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 dark:bg-blue-500 rounded-full" style={{ width: `${avgDemandScore}%` }} />
              </div>
              <p className="mt-3 text-xs font-medium text-blue-600/80 dark:text-blue-400/80">Overall buyer interest level</p>
            </div>
            
            <div className="rounded-2xl border border-border/40 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 p-6 flex flex-col justify-center shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Supply Score</span>
                <span className="text-3xl font-black text-purple-600 dark:text-purple-400">{avgSupplyScore}<span className="text-lg text-muted-foreground font-medium">/100</span></span>
              </div>
              <div className="h-2 bg-purple-100 dark:bg-purple-950 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 dark:bg-purple-500 rounded-full" style={{ width: `${avgSupplyScore}%` }} />
              </div>
              <p className="mt-3 text-xs font-medium text-purple-600/80 dark:text-purple-400/80">Available energy capacity</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Market Temperature */}
          <div className="col-span-1 lg:col-span-7 rounded-2xl border border-border/40 bg-background/50 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <ThermometerSun className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-bold">Network Temperature</h3>
            </div>
            <div className="space-y-4">
              {Object.entries(tempDistribution).map(([temp, count]) => {
                const tempStyles = {
                  cold: { color: "bg-blue-500", text: "text-blue-600 dark:text-blue-400" },
                  cool: { color: "bg-cyan-500", text: "text-cyan-600 dark:text-cyan-400" },
                  moderate: { color: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
                  warm: { color: "bg-orange-500", text: "text-orange-600 dark:text-orange-400" },
                  hot: { color: "bg-red-500", text: "text-red-600 dark:text-red-400" },
                };

                const style = tempStyles[temp] || tempStyles.moderate;
                const totalListings = Object.values(tempDistribution).reduce((a, b) => a + b, 0);
                const percentage = totalListings > 0 ? ((count / totalListings) * 100).toFixed(0) : 0;

                return (
                  <div key={temp} className="flex items-center group">
                    <div className="w-24 text-sm font-semibold capitalize text-muted-foreground group-hover:text-foreground transition-colors">
                      {temp}
                    </div>
                    <div className="flex-1 px-4">
                      <div className="h-3 w-full bg-muted/50 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${style.color} transition-all duration-1000 ease-out`} 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className={`w-24 flex justify-between text-sm font-bold ${style.text}`}>
                      <span>{count}</span>
                      <span>({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Price Multipliers */}
          {insights.priceMultiplierRange && (
            <div className="col-span-1 lg:col-span-5 rounded-2xl border border-border/40 bg-gradient-to-br from-slate-50 to-zinc-100 dark:from-slate-900/50 dark:to-zinc-900/50 p-6 flex flex-col shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brandMainColor/5 dark:bg-brandSubColor/5 rounded-full blur-3xl"></div>
              <h3 className="text-lg font-bold mb-6 relative z-10">Multiplier Range</h3>
              
              <div className="flex-1 flex flex-col justify-center space-y-8 relative z-10">
                <div className="flex justify-between items-end border-b border-border/50 pb-4">
                  <span className="text-sm font-medium text-muted-foreground">Highest Active</span>
                  <span className="text-2xl font-black text-rose-500">{insights.priceMultiplierRange.max.toFixed(2)}x</span>
                </div>
                
                <div className="flex justify-between items-end border-b border-border/50 pb-4">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    Market Average 
                    <Badge variant="outline" className="bg-background/50 border-muted-foreground/30 text-[10px] uppercase font-bold py-0 h-5">Current</Badge>
                  </span>
                  <span className="text-3xl font-black text-foreground">{insights.priceMultiplierRange.avg.toFixed(2)}x</span>
                </div>
                
                <div className="flex justify-between items-end">
                  <span className="text-sm font-medium text-muted-foreground">Lowest Active</span>
                  <span className="text-2xl font-black text-emerald-500">{insights.priceMultiplierRange.min.toFixed(2)}x</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketInsights;
