import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Leaf, Sparkles, Download } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const TransactionListing = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/credits/payment-data`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setRecentPurchases(response.data.transactions);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [token]);
  const totals = useMemo(() => {
    if (!recentPurchases.length) {
      return { totalCredits: 0, totalSpent: 0 };
    }
    return recentPurchases.reduce(
      (acc, tx) => {
        acc.totalCredits += Number(tx.amount) || 0;
        acc.totalSpent += Number(tx.quantity) || 0;
        return acc;
      },
      { totalCredits: 0, totalSpent: 0 }
    );
  }, [recentPurchases]);

  const overviewData = [
    {
      title: "Total credits purchased",
      value: totals.totalCredits,
      subtext: "Across all completed transactions",
      icon: <Leaf className="h-5 w-5 text-brandMainColor" />,
    },
    {
      title: "Total spent",
      value: totals.totalSpent,
      isCurrency: true,
      subtext: "In INR, excluding fees",
      icon: <CheckCircle className="h-5 w-5 text-brandMainColor" />,
    },
    {
      title: "Total orders",
      value: recentPurchases.length,
      subtext: "Including pending settlements",
      icon: <Clock className="h-5 w-5 text-brandMainColor" />,
    },
  ];

  return (
    <div className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-brandMainColor/15 via-transparent to-transparent dark:from-brandSubColor/20" />
      <div className="absolute left-20 top-24 hidden h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl dark:bg-emerald-300/10 lg:block" />
      <div className="absolute right-20 bottom-24 hidden h-64 w-64 rounded-full bg-lime-300/20 blur-3xl dark:bg-lime-200/10 lg:block" />

      <main className="relative mx-auto max-w-6xl px-6 py-16 lg:px-0">
        <section className="overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-10 shadow-2xl backdrop-blur-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-sm font-medium text-primary dark:text-primary-foreground">
                <Sparkles className="h-4 w-4" /> Order history
              </span>
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Track every carbon credit transaction in one place
              </h1>
              <p className="max-w-2xl text-lg text-muted-foreground">
                Access detailed purchase records, seller information, and spend
                summaries to keep your climate investments audit-ready.
              </p>
            </div>
            <Card className="border border-primary/30 bg-primary/10 shadow-xl dark:border-brandSubColor/30 dark:bg-brandSubColor/10">
              <CardContent className="space-y-3 p-6 text-sm text-primary dark:text-primary-foreground/90">
                <p>
                  Need to expand your portfolio? Visit the marketplace to source
                  new offsets aligned with your reduction roadmap.
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="w-full rounded-full border-primary/40 text-primary hover:bg-primary/10 dark:border-primary-foreground/30 dark:text-primary-foreground"
                >
                  <Link to="/market">Browse marketplace</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mt-10 space-y-10">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {loading ? (
              [...new Array(3)].map((_, i) => (
                <Skeleton key={`skeleton-${i}`} className="h-32" />
              ))
            ) : (
              overviewData.map((item) => (
                <Card
                  key={item.title}
                  className="border border-border/70 bg-card/90 shadow-xl"
                >
                  <CardContent className="space-y-3 p-6">
                    <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                      {item.icon}
                      {item.title}
                    </div>
                    <p className="text-3xl font-semibold text-foreground">
                      {item.isCurrency
                        ? `₹${Number(item.value || 0).toLocaleString()}`
                        : Number(item.value || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.subtext}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <Card className="border border-border/70 bg-card/90 shadow-2xl">
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-2xl font-semibold text-foreground">
                  Transaction ledger
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Export your purchase history for compliance, finance, or
                  sustainability reporting.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                className="rounded-full border-border/60 text-sm font-semibold"
              >
                Download CSV
              </Button>
            </CardHeader>
            <CardContent className="overflow-hidden rounded-2xl border border-border/60">
              <Table>
                <TableHeader className="bg-muted/60">
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Amount (₹)</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading && (
                    <TableRow>
                      <TableCell colSpan={5} className="py-10">
                        <div className="flex justify-center">
                          <Skeleton className="h-6 w-full" />
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  {!loading && recentPurchases.length > 0 && (
                    recentPurchases.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-mono text-sm text-muted-foreground">
                          {order._id}
                        </TableCell>
                        <TableCell className="text-sm text-foreground">
                          {order.sellerName}
                        </TableCell>
                        <TableCell className="text-sm text-foreground">
                          {Number(order.amount || 0).toLocaleString()} credits
                        </TableCell>
                        <TableCell className="text-sm font-semibold text-foreground">
                          ₹{Number(order.quantity || 0).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/receipt/${order._id}`)}}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Receipt
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                  {!loading && recentPurchases.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="py-10 text-center text-sm text-muted-foreground"
                      >
                        No transactions recorded yet. Visit the marketplace to
                        make your first purchase.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default TransactionListing;
