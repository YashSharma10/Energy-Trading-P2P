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
import { getAllListings, getTransactionData } from "@/services/listingService";
import { toast } from "sonner";
import DynamicPriceDisplay from "@/components/DynamicPriceDisplay";
import MarketInsights from "@/components/MarketInsights";

const ConsumerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSpent: 0,
    energyPurchased: 0,
    activePurchases: 0,
    totalTransactions: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch marketplace listings and buyer transactions
      const [listingsData, transactionsData] = await Promise.all([
        getAllListings(),
        getTransactionData()
      ]);

      // Set listings from marketplace (only Available ones)
      const availableListings = (listingsData?.data || []).filter(
        listing => listing.status === 'Available'
      );
      setListings(availableListings);

      // Get buyer transactions (where user is the buyer)
      const buyerTransactions = transactionsData?.data?.transactions || [];
      setTransactions(buyerTransactions);

      // Calculate stats from real data
      const totalSpent = buyerTransactions.reduce((sum, t) => sum + (t.totalAmount || 0), 0);
      const energyPurchased = buyerTransactions.reduce((sum, t) => sum + (t.quantity || 0), 0);
      const completedTransactions = buyerTransactions.filter(t => t.paymentStatus === 'completed').length;

      setStats({
        totalSpent,
        energyPurchased,
        activePurchases: availableListings.filter(l => l.status === 'Available').length,
        totalTransactions: completedTransactions
      });

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  // Format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const statsCards = [
    {
      title: "Total Spent",
      value: formatCurrency(stats.totalSpent),
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
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <Card key={i} className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                  <div className="h-8 w-8 bg-muted animate-pulse rounded-lg"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-20 bg-muted animate-pulse rounded mb-2"></div>
                  <div className="h-3 w-32 bg-muted animate-pulse rounded"></div>
                </CardContent>
              </Card>
            ))
          ) : (
            statsCards.map((stat) => {
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
            })
          )}
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
                  {loading ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Loading listings...</p>
                    </div>
                  ) : listings.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No listings available at the moment.</p>
                    </div>
                  ) : (
                    <>
                      {listings.slice(0, 3).map((listing) => (
                        <div
                          key={listing._id}
                          className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                              <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">
                                {listing.projectType || 'Energy Listing'}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {listing.quantity} credits
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <DynamicPriceDisplay
                                itemId={listing._id}
                                isProduct={false}
                                basePrice={listing.pricePerCredit}
                              />
                            </div>
                            <Button 
                              size="sm"
                              className="bg-brandMainColor hover:bg-brandMainColor/90 dark:bg-brandSubColor dark:hover:bg-brandSubColor/90"
                              onClick={() => navigate(`/marketplace/${listing._id}`)}
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
                    </>
                  )}
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
                  {loading ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Loading purchases...</p>
                    </div>
                  ) : transactions.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No purchases yet.</p>
                    </div>
                  ) : (
                    <>
                      {transactions.slice(0, 3).map((purchase) => (
                        <div
                          key={purchase._id}
                          className="flex items-center justify-between p-4 border border-border rounded-lg"
                        >
                          <div>
                            <p className="font-semibold text-foreground">
                              {purchase.seller?.name || purchase.seller?.email || 'Seller'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(purchase.purchaseDate || purchase.createdAt)}
                            </p>
                          </div>
                          <div className="text-right flex items-center gap-3">
                            <div>
                              <p className="font-semibold text-foreground">
                                {formatCurrency(purchase.totalAmount)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {purchase.quantity} credits
                              </p>
                            </div>
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              {purchase.paymentStatus || 'completed'}
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
                    </>
                  )}
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

        {/* Market Insights Section */}
        <div className="mt-10">
          <MarketInsights />
        </div>
      </div>
    </div>
  );
};

export default ConsumerDashboard;
