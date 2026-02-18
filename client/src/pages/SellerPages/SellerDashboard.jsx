import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowUpRight,
  CheckCircle,
  Loader2,
  PackageCheck,
  TrendingUp,
  User,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";

const formatCurrency = (value) => {
  const amount = Number(value) || 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

const SellerDashboard = () => {
  const { user, token } = useAuth();
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      if (!token) {
        return;
      }
      setIsLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:3000/api/credits/payment-data",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data?.success && Array.isArray(response.data?.data?.sellerTransactions)) {
          setRecentPurchases(response.data.data.sellerTransactions);
        } else {
          setRecentPurchases([]);
        }
      } catch (error) {
        console.error("Error fetching seller transactions:", error);
        setRecentPurchases([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [token]);

  const metrics = useMemo(() => {
    const totalRevenue = recentPurchases.reduce(
      (sum, transaction) => sum + (Number(transaction.totalAmount) || 0),
      0
    );
    const totalCreditsSold = recentPurchases.reduce(
      (sum, transaction) => sum + (Number(transaction.quantity) || 0),
      0
    );
    const totalOrders = recentPurchases.length;
    const avgDealSize = totalOrders ? totalRevenue / totalOrders : 0;
    const pendingOrders = recentPurchases.filter((transaction) => {
      const status = (transaction.paymentStatus || "").toLowerCase();
      return status === "pending";
    }).length;

    return {
      totalRevenue,
      totalCreditsSold,
      totalOrders,
      avgDealSize,
      pendingOrders,
    };
  }, [recentPurchases]);

  const overviewCards = [
    {
      title: "Revenue",
      value: metrics.totalRevenue,
      icon: <TrendingUp className="h-4 w-4 text-primary" />,
      isCurrency: true,
      description: "Total earnings from completed sales",
    },
    {
      title: "Credits sold",
      value: metrics.totalCreditsSold,
      icon: <PackageCheck className="h-4 w-4 text-primary" />,
      description: "Volume moved across all transactions",
    },
    {
      title: "Orders",
      value: metrics.totalOrders,
      icon: <CheckCircle className="h-4 w-4 text-primary" />,
      description: "Fulfilled and in-progress deals",
    },
    {
      title: "Avg deal size",
      value: metrics.avgDealSize,
      icon: <User className="h-4 w-4 text-primary" />,
      isCurrency: true,
      description: "Mean revenue per transaction",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background via-background/95 to-muted/30">
      <section className="border-b border-border/60 bg-card/40 px-8 py-10 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Badge
                variant="secondary"
                className="w-fit bg-primary/15 text-primary"
              >
                Seller Portal
              </Badge>
              <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
                Sales performance dashboard
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Track revenue, credits sold, and buyer trends for your carbon
                offset portfolio.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/seller-analytics">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics
              </Link>
            </Button>
          </div>
      description: "Total confirmed transactions this month",
      isCurrency: true,
    },
    {
      title: "Credits Sold",
      value: metrics.totalCreditsSold,
      icon: <PackageCheck className="h-4 w-4 text-primary" />,
      description: "Verified carbon credits delivered to buyers",
    },
    {
      title: "Open Orders",
      value: metrics.pendingOrders,
      icon: <CheckCircle className="h-4 w-4 text-primary" />,
      description: "Awaiting confirmation or fulfillment",
    },
    {
      title: "Avg. Deal Size",
      value: metrics.avgDealSize,
      icon: <ArrowUpRight className="h-4 w-4 text-primary" />,
      description: "Average value per order",
      isCurrency: true,
    },
  ];

  return (
    <div className="flex min-h-full flex-col bg-gradient-to-b from-background via-background/95 to-muted/40">
      <section className="border-b border-border/60 bg-card/40 px-8 py-10 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <Badge
                className="w-fit bg-primary/15 text-primary"
                variant="secondary"
              >
                Seller HQ
              </Badge>
              <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
                Welcome back, {user?.name || "Carbon Partner"}
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Track performance, manage listings, and keep tabs on incoming
                orders. Your latest activity and KPIs update in real-time as
                buyers complete their transactions.
              </p>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="outline">
                <Link to="/listings">Manage Listings</Link>
              </Button>
              <Button asChild>
                <Link to="/transaction-listing">View Transactions</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-8 md:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {overviewCards.map((card) => (
            <Card
              key={card.title}
              className="border border-border/60 bg-card shadow-sm"
            >
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                  <span>{card.description}</span>
                  {card.icon}
                </div>
                <CardTitle className="text-base font-semibold text-foreground">
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <NumberTicker
                  value={card.value || 0}
                  className="text-4xl font-semibold tracking-tight text-foreground"
                  formatValue={(value) =>
                    card.isCurrency
                      ? formatCurrency(value)
                      : Math.round(value).toLocaleString()
                  }
                />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="border border-border/60 bg-card shadow-sm lg:col-span-2">
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">
                  Recent Transactions
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Last {recentPurchases.length ? recentPurchases.length : "few"}{" "}
                  orders placed by buyers
                </p>
              </div>
              <Button variant="outline" size="sm" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" /> Syncing
                  </span>
                ) : (
                  "Refresh"
                )}
              </Button>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Buyer</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Credits
                    </TableHead>
                    <TableHead>Total Paid</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Status
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="py-8 text-center text-sm text-muted-foreground"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" /> Loading
                          latest transactions...
                        </span>
                      </TableCell>
                    </TableRow>
                  ) : recentPurchases.length ? (
                    recentPurchases.map((transaction) => {
                      const statusLabel = (
                        transaction.paymentStatus || "completed"
                      ).toLowerCase();
                      const badgeVariant =
                        statusLabel === "pending"
                          ? "secondary"
                          : statusLabel === "cancelled"
                          ? "destructive"
                          : "outline";

                      return (
                        <TableRow
                          key={transaction._id}
                          className="last:border-0"
                        >
                          <TableCell className="font-medium">
                            {transaction.buyer?.name ||
                              transaction.buyer?.email ||
                              "Unknown"}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {Number(transaction.quantity)?.toLocaleString() || "-"}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(transaction.totalAmount)}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge
                              variant={badgeVariant}
                              className="capitalize"
                            >
                              {statusLabel}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                            {transaction.purchaseDate
                              ? new Date(
                                  transaction.purchaseDate
                                ).toLocaleDateString()
                              : "-"}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="py-8 text-center text-sm text-muted-foreground"
                      >
                        No transactions yet. Share your listings to attract the
                        first buyers.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-border/60 bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Seller Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {user?.name || "Seller"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email || "team@carbonease.com"}
                    </p>
                  </div>
                </div>
                <div className="rounded-lg border border-dashed border-border/70 bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
                  Keep project documentation up to date to maintain marketplace
                  visibility and build buyer trust.
                </div>
                <Button asChild variant="outline" size="sm">
                  <a href="/profile">Update profile</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-border/60 bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Sales Momentum
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Orders this month</span>
                  <span className="text-foreground">{metrics.totalOrders}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Credits fulfilled</span>
                  <span className="text-foreground">
                    {metrics.totalCreditsSold.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Best day</span>
                  <span className="text-foreground">
                    {recentPurchases[0]?.createdAt
                      ? new Date(
                          recentPurchases[0].createdAt
                        ).toLocaleDateString()
                      : "--"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SellerDashboard;
