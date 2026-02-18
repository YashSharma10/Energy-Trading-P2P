import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  DollarSign, 
  Zap, 
  History, 
  TrendingDown,
  BarChart3,
  Search
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ConsumerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSpent: 0,
    energyPurchased: 0,
    activePurchases: 0,
    totalTransactions: 0
  });

  useEffect(() => {
    // TODO: Fetch real stats from API
    // For now using mock data
    setStats({
      totalSpent: 850.75,
      energyPurchased: 320,
      activePurchases: 3,
      totalTransactions: 18
    });
  }, []);

  const statsCards = [
    {
      title: "Total Spent",
      value: `$${stats.totalSpent.toFixed(2)}`,
      description: "Last 30 days",
      icon: DollarSign,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/20"
    },
    {
      title: "Energy Purchased",
      value: `${stats.energyPurchased} kWh`,
      description: "This month",
      icon: Zap,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
      title: "Active Purchases",
      value: stats.activePurchases,
      description: "Pending delivery",
      icon: ShoppingCart,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/20"
    },
    {
      title: "Transactions",
      value: stats.totalTransactions,
      description: "Total completed",
      icon: TrendingDown,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/20"
    }
  ];

  const availableListings = [
    { id: 1, seller: "Solar Farm A", energy: "50 kWh", price: "$24.50", rating: 4.8 },
    { id: 2, seller: "Wind Energy Co", energy: "100 kWh", price: "$47.00", rating: 4.9 },
    { id: 3, seller: "Green Power Inc", energy: "75 kWh", price: "$35.25", rating: 4.7 },
  ];

  const recentPurchases = [
    { id: 1, seller: "Solar Farm A", energy: "25 kWh", amount: "$12.25", date: "3 hours ago", status: "Completed" },
    { id: 2, seller: "Wind Energy Co", energy: "50 kWh", amount: "$23.50", date: "1 day ago", status: "Completed" },
    { id: 3, seller: "Hydro Plant B", energy: "30 kWh", amount: "$14.50", date: "2 days ago", status: "Completed" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Consumer Dashboard
              </h1>
              <p className="mt-2 text-muted-foreground">
                Welcome back, {user?.name || user?.email}! Browse and purchase clean energy.
              </p>
            </div>
            <Button 
              onClick={() => navigate("/marketplace")}
              className="bg-brandMainColor hover:bg-brandMainColor/90 dark:bg-brandSubColor dark:hover:bg-brandSubColor/90"
            >
              <Search className="mr-2 h-4 w-4" />
              Browse Marketplace
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="marketplace" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="marketplace">
              <Search className="mr-2 h-4 w-4" />
              Marketplace
            </TabsTrigger>
            <TabsTrigger value="purchases">
              <History className="mr-2 h-4 w-4" />
              Purchases
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Available Energy Listings</CardTitle>
                <CardDescription>
                  Browse and purchase clean energy from verified producers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availableListings.map((listing) => (
                    <div
                      key={listing.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                          <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{listing.seller}</p>
                          <p className="text-sm text-muted-foreground">
                            {listing.energy} • ⭐ {listing.rating}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-lg text-foreground">{listing.price}</p>
                          <p className="text-xs text-muted-foreground">Per listing</p>
                        </div>
                        <Button 
                          size="sm"
                          className="bg-brandMainColor hover:bg-brandMainColor/90 dark:bg-brandSubColor dark:hover:bg-brandSubColor/90"
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Buy
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate("/marketplace")}
                  >
                    View All Listings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="purchases" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Purchase History</CardTitle>
                <CardDescription>
                  Your recent energy purchases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPurchases.map((purchase) => (
                    <div
                      key={purchase.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-foreground">{purchase.seller}</p>
                        <p className="text-sm text-muted-foreground">{purchase.date}</p>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <div>
                          <p className="font-semibold text-foreground">{purchase.amount}</p>
                          <p className="text-sm text-muted-foreground">{purchase.energy}</p>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          {purchase.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate("/transaction-listing")}
                  >
                    View All Purchases
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Consumption Analytics</CardTitle>
                <CardDescription>
                  Track your energy consumption and spending
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Advanced analytics coming soon
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => navigate("/buyer-analytics")}
                  >
                    View Detailed Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ConsumerDashboard;
