import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  ShoppingCart,
  ArrowLeftRight,
  Activity,
  Eye,
  History
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CombinedDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalSpent: 0,
    energySold: 0,
    energyPurchased: 0,
    activeListings: 0,
    activePurchases: 0
  });

  useEffect(() => {
    // TODO: Fetch real stats from API
    // For now using mock data
    setStats({
      totalEarnings: 1250.5,
      totalSpent: 850.75,
      energySold: 450,
      energyPurchased: 320,
      activeListings: 5,
      activePurchases: 3
    });
  }, []);

  const netBalance = stats.totalEarnings - stats.totalSpent;

  const statsCards = [
    {
      title: "Total Earnings",
      value: `$${stats.totalEarnings.toFixed(2)}`,
      description: "From selling energy",
      icon: TrendingUp,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/20"
    },
    {
      title: "Total Spent",
      value: `$${stats.totalSpent.toFixed(2)}`,
      description: "On purchasing energy",
      icon: DollarSign,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/20"
    },
    {
      title: "Net Balance",
      value: `$${netBalance.toFixed(2)}`,
      description: netBalance >= 0 ? "Profit" : "Loss",
      icon: ArrowLeftRight,
      color: netBalance >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
      bgColor: netBalance >= 0 ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20"
    },
    {
      title: "Energy Balance",
      value: `${stats.energySold - stats.energyPurchased} kWh`,
      description: stats.energySold > stats.energyPurchased ? "Surplus sold" : "Net consumed",
      icon: Zap,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20"
    }
  ];

  const sellerListings = [
    { id: 1, energy: "50 kWh", price: "$25.00", status: "Active", buyers: 3 },
    { id: 2, energy: "100 kWh", price: "$48.00", status: "Active", buyers: 7 },
    { id: 3, energy: "75 kWh", price: "$36.00", status: "Active", buyers: 2 },
  ];

  const buyerListings = [
    { id: 1, seller: "Solar Farm A", energy: "50 kWh", price: "$24.50", rating: 4.8 },
    { id: 2, seller: "Wind Energy Co", energy: "100 kWh", price: "$47.00", rating: 4.9 },
    { id: 3, seller: "Green Power Inc", energy: "75 kWh", price: "$35.25", rating: 4.7 },
  ];

  const recentTransactions = [
    { id: 1, type: "Sale", party: "John Doe", energy: "25 kWh", amount: "$12.50", date: "2 hours ago" },
    { id: 2, type: "Purchase", party: "Wind Energy Co", energy: "50 kWh", amount: "-$23.50", date: "5 hours ago" },
    { id: 3, type: "Sale", party: "Jane Smith", energy: "30 kWh", amount: "$15.00", date: "1 day ago" },
    { id: 4, type: "Purchase", party: "Solar Farm A", energy: "40 kWh", amount: "-$19.00", date: "2 days ago" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                Combined Dashboard
                <Badge variant="outline" className="text-purple-600 border-purple-600">
                  <ArrowLeftRight className="mr-1 h-3 w-3" />
                  Producer + Consumer
                </Badge>
              </h1>
              <p className="mt-2 text-muted-foreground">
                Welcome back, {user?.name || user?.email}! Manage both your buying and selling activities.
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => navigate("/marketplace")}
                variant="outline"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Buy Energy
              </Button>
              <Button 
                onClick={() => navigate("/form")}
                className="bg-brandMainColor hover:bg-brandMainColor/90 dark:bg-brandSubColor dark:hover:bg-brandSubColor/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Sell Energy
              </Button>
            </div>
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
        <Tabs defaultValue="sell" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="sell">
              <Zap className="mr-2 h-4 w-4" />
              Sell Energy
            </TabsTrigger>
            <TabsTrigger value="buy">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Buy Energy
            </TabsTrigger>
            <TabsTrigger value="transactions">
              <Activity className="mr-2 h-4 w-4" />
              Transactions
            </TabsTrigger>
          </TabsList>

          {/* Sell Energy Tab */}
          <TabsContent value="sell" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    My Listings
                  </CardTitle>
                  <CardDescription>
                    Your active energy listings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sellerListings.map((listing) => (
                      <div
                        key={listing.id}
                        className="flex items-center justify-between p-3 border border-border rounded-lg"
                      >
                        <div>
                          <p className="font-semibold text-foreground">{listing.energy}</p>
                          <p className="text-xs text-muted-foreground">
                            {listing.buyers} interested buyers
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-foreground">{listing.price}</p>
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate("/listings")}
                    >
                      View All
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                    Selling Stats
                  </CardTitle>
                  <CardDescription>
                    Your selling performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Active Listings</span>
                      <span className="font-bold text-foreground">{stats.activeListings}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Energy Sold</span>
                      <span className="font-bold text-foreground">{stats.energySold} kWh</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Earnings</span>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        ${stats.totalEarnings.toFixed(2)}
                      </span>
                    </div>
                    <Button 
                      className="w-full bg-brandMainColor hover:bg-brandMainColor/90 dark:bg-brandSubColor dark:hover:bg-brandSubColor/90"
                      onClick={() => navigate("/seller-analytics")}
                    >
                      View Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Buy Energy Tab */}
          <TabsContent value="buy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Available Energy
                </CardTitle>
                <CardDescription>
                  Browse energy listings from verified producers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {buyerListings.map((listing) => (
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
                        <p className="font-bold text-lg text-foreground">{listing.price}</p>
                        <Button 
                          size="sm"
                          className="bg-brandMainColor hover:bg-brandMainColor/90 dark:bg-brandSubColor dark:hover:bg-brandSubColor/90"
                        >
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
                    Browse All Listings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  All Transactions
                </CardTitle>
                <CardDescription>
                  Your complete transaction history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant="outline" 
                          className={transaction.type === "Sale" 
                            ? "text-green-600 border-green-600" 
                            : "text-blue-600 border-blue-600"
                          }
                        >
                          {transaction.type}
                        </Badge>
                        <div>
                          <p className="font-semibold text-foreground">{transaction.party}</p>
                          <p className="text-sm text-muted-foreground">
                            {transaction.energy} • {transaction.date}
                          </p>
                        </div>
                      </div>
                      <p className={`font-bold ${
                        transaction.type === "Sale" 
                          ? "text-green-600 dark:text-green-400" 
                          : "text-red-600 dark:text-red-400"
                      }`}>
                        {transaction.amount}
                      </p>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate("/transaction-listing")}
                  >
                    View All Transactions
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

export default CombinedDashboard;
