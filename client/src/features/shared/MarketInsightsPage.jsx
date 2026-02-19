import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MarketInsights from "@/components/MarketInsights";
import { BarChart3, TrendingUp } from "lucide-react";

const MarketInsightsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-muted/40 dark:bg-muted/20">
        <div className="mx-auto max-w-6xl px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Market Insights</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Real-time analysis of carbon credits and eco-products market trends
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-8 py-10">
        <div className="space-y-6">
          {/* Main Insights Card */}
          <MarketInsights />

          {/* Additional Info Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border border-border/70 bg-card/90 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Our AI-powered dynamic pricing system analyzes market conditions in real-time to provide optimal price recommendations.
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Demand & supply analysis</li>
                  <li>Seller rating influence</li>
                  <li>Market trend tracking</li>
                  <li>Price multiplier optimization</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-border/70 bg-card/90 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  Market Indicators
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <p className="font-semibold text-foreground">Market Temperature</p>
                  <p>Cold → Cool → Moderate → Warm → Hot</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Price Multiplier</p>
                  <p>0.5x (50% discount) to 2x (100% premium)</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tips Card */}
          <Card className="border border-primary/30 bg-primary/5 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">💡</span>
                Pro Tips for Using Market Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <ul className="space-y-2 list-disc list-inside">
                <li>Monitor market temperature to understand overall market health</li>
                <li>Use AI recommendations to stay competitive with pricing</li>
                <li>Track demand scores to identify trending categories</li>
                <li>Review price history to understand price movements</li>
                <li>Compare your pricing with market averages regularly</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MarketInsightsPage;
