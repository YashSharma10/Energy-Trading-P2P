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
  Search,
  MessageCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllListings, getTransactionData } from "@/services/listingService";
import { toast } from "sonner";
import DynamicPriceDisplay from "@/components/DynamicPriceDisplay";
import MarketInsights from "@/components/MarketInsights";
import LiveChatPanel from "@/components/common/LiveChatPanel";

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
    return `₹${Number(amount).toLocaleString('en-IN')}`;
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
    <div className="min-h-screen bg-gradient-to-br from-background via-brandMainColor/5 to-emerald-500/5 dark:via-brandSubColor/5 dark:to-lime-400/5 pt-24 lg:pt-28 relative">
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] bg-[size:20px_20px]" />
      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-10 relative z-10">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-card/60 backdrop-blur-xl border border-border/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              Consumer Dashboard
            </h1>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              Welcome back, <span className="text-brandMainColor dark:text-brandSubColor">{user?.name || user?.email}</span>! Browse and purchase clean energy.
            </p>
          </div>
          <Button 
            onClick={() => navigate("/marketplace")}
            className="h-11 rounded-xl bg-brandMainColor px-6 text-sm font-semibold shadow-md hover:bg-brandMainColor/90 hover:shadow-lg transition-all dark:bg-brandSubColor dark:text-slate-950 dark:hover:bg-brandSubColor/90"
          >
            <Search className="mr-2 h-4 w-4" />
            Browse Marketplace
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 mb-10 md:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <Card key={i} className="border-border/30 bg-card/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl">
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
                <Card key={stat.title} className="group overflow-hidden border border-border/30 bg-card/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 rounded-2xl relative">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transform translate-x-4 -translate-y-4 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                    <Icon className={`h-24 w-24 ${stat.color.split(' ')[0]}`} />
                  </div>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-semibold text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-xl ${stat.bgColor} shadow-sm`}>
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="text-3xl font-extrabold text-foreground tracking-tight">{stat.value}</div>
                    <p className="text-xs font-medium text-muted-foreground mt-1">
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
          <TabsList className="grid w-full max-w-xl grid-cols-4">
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
            <TabsTrigger value="chat">
              <MessageCircle className="mr-2 h-4 w-4" />
              Live Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace" className="space-y-4">
            <Card className="border border-border/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-card/60 backdrop-blur-xl rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-border/30 bg-muted/20 pb-6">
                <CardTitle className="text-lg font-bold">Available Energy Listings</CardTitle>
                <CardDescription>
                  Browse and purchase clean energy from verified producers
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
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
                          className="flex py-3 md:py-4 px-4 items-center justify-between border border-border/30 bg-background/40 rounded-xl hover:bg-card/80 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300"
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
                        className="w-full h-11 rounded-xl border-border/50 text-sm font-semibold hover:bg-muted/50 transition-all"
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
            <Card className="border border-border/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-card/60 backdrop-blur-xl rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-border/30 bg-muted/20 pb-6">
                <CardTitle className="text-lg font-bold">Purchase History</CardTitle>
                <CardDescription>
                  Your recent energy purchases
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
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
                          className="flex py-3 md:py-4 px-4 items-center justify-between border border-border/30 bg-background/40 rounded-xl hover:bg-card/80 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300"
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
                        className="w-full h-11 rounded-xl border-border/50 text-sm font-semibold hover:bg-muted/50 transition-all"
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
            <Card className="border border-border/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-card/60 backdrop-blur-xl rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-border/30 bg-muted/20 pb-6">
                <CardTitle className="text-lg font-bold">Consumption Analytics</CardTitle>
                <CardDescription>
                  Track your energy consumption and spending
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
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

          <TabsContent value="chat" className="space-y-4">
            <Card className="border border-border/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-card/60 backdrop-blur-xl rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-border/30 bg-muted/20 pb-6">
                <CardTitle className="text-lg font-bold">Live Chat</CardTitle>
                <CardDescription>
                  Connect with producers in real time to finalize energy deals.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <LiveChatPanel />
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
