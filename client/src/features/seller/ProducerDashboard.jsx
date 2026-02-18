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
  Grid, 
  Plus, 
  Eye,
  Activity,
  BarChart3
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getPostedListings, getTransactionData } from "@/services/listingService";
import { toast } from "sonner";

const ProducerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEarnings: 0,
    activeListings: 0,
    energySold: 0,
    totalTransactions: 0
  });
  const [listings, setListings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch posted listings and transactions in parallel
      const [listingsResponse, transactionsResponse] = await Promise.all([
        getPostedListings(),
        getTransactionData()
      ]);

      const userListings = listingsResponse.posted || [];
      const sellerTransactions = transactionsResponse.data?.sellerTransactions || [];

      setListings(userListings);
      setTransactions(sellerTransactions);

      // Calculate stats from real data
      const totalEarnings = sellerTransactions.reduce((sum, t) => sum + (t.totalAmount || 0), 0);
      const energySold = sellerTransactions.reduce((sum, t) => sum + (t.quantity || 0), 0);
      const activeListings = userListings.filter(l => l.status === "Available").length;

      setStats({
        totalEarnings,
        activeListings,
        energySold,
        totalTransactions: sellerTransactions.length
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Total Earnings",
      value: `$${stats.totalEarnings.toFixed(2)}`,
      description: "Last 30 days",
      icon: DollarSign,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/20"
    },
    {
      title: "Active Listings",
      value: stats.activeListings,
      description: "Currently available",
      icon: Grid,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
      title: "Energy Sold",
      value: `${stats.energySold} kWh`,
      description: "This month",
      icon: Zap,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20"
    },
    {
      title: "Transactions",
      value: stats.totalTransactions,
      description: "Total completed",
      icon: TrendingUp,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/20"
    }
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Producer Dashboard
              </h1>
              <p className="mt-2 text-muted-foreground">
                Welcome back, {user?.name || user?.email}! Manage your energy listings and track your earnings.
              </p>
            </div>
            <Button 
              onClick={() => navigate("/form")}
              className="bg-brandMainColor hover:bg-brandMainColor/90 dark:bg-brandSubColor dark:hover:bg-brandSubColor/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Listing
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
        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="listings">
              <Grid className="mr-2 h-4 w-4" />
              Listings
            </TabsTrigger>
            <TabsTrigger value="transactions">
              <Activity className="mr-2 h-4 w-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Listings</CardTitle>
                <CardDescription>
                  Your currently available energy listings
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
                      <p className="text-muted-foreground">No listings yet. Create your first listing!</p>
                    </div>
                  ) : (
                    <>
                      {listings.slice(0, 3).map((listing) => (
                        <div
                          key={listing._id}
                          className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                              <Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{listing.quantity} {listing.unit || 'kWh'}</p>
                              <p className="text-sm text-muted-foreground">
                                {listing.projectType || 'Energy'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-bold text-lg text-foreground">{formatCurrency(listing.pricePerCredit)}</p>
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                {listing.status}
                              </Badge>
                            </div>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate("/listings")}
                      >
                        View All Listings
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Your latest energy sales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Loading transactions...</p>
                    </div>
                  ) : transactions.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No transactions yet.</p>
                    </div>
                  ) : (
                    <>
                      {transactions.slice(0, 3).map((transaction) => (
                        <div
                          key={transaction._id}
                          className="flex items-center justify-between p-4 border border-border rounded-lg"
                        >
                          <div>
                            <p className="font-semibold text-foreground">
                              {transaction.buyer?.name || transaction.buyer?.email || 'Anonymous Buyer'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(transaction.purchaseDate || transaction.createdAt)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-foreground">
                              {formatCurrency(transaction.totalAmount)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {transaction.quantity} credits
                            </p>
                          </div>
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate("/transaction-listing")}
                      >
                        View All Transactions
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
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>
                  Track your selling performance
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
                    onClick={() => navigate("/seller-analytics")}
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

export default ProducerDashboard;
