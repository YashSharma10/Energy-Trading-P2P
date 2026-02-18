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
import { CheckCircle, Clock, Leaf, Sparkles, User, BarChart3 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { Link } from "react-router-dom";

const BuyerDashboard = () => {
  const { user, token } = useAuth();
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/credits/payment-data",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Buyer Data", response.data);

        if (response.data?.success && Array.isArray(response.data?.data?.transactions)) {
          setRecentPurchases(response.data.data.transactions);

          // Calculate the total amount spent
          const total = response.data.data.transactions.reduce(
            (sum, transaction) => sum + (Number(transaction.totalAmount) || 0),
            0
          );
          setTotalAmount(total);
        } else {
          console.error("Invalid data format:", response.data);
          setRecentPurchases([]);
          setTotalAmount(0);
        }
      } catch (error) {
        console.error("Error fetching buyer transactions:", error);
        setRecentPurchases([]);
        setTotalAmount(0);
      }
    };

    fetchListings();
  }, [token]);

  const overviewTotals = useMemo(() => {
    const orders = recentPurchases.length;
    const totalCredits = recentPurchases.reduce(
      (sum, tx) => sum + (Number(tx.quantity) || 0),
      0
    );
    return {
      totalSpent: totalAmount || 0,
      totalCredits,
      totalOrders: orders,
    };
  }, [recentPurchases, totalAmount]);

  return (
    <div className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-brandMainColor/15 via-transparent to-transparent dark:from-brandSubColor/20" />
      <div className="absolute left-16 top-16 hidden h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl dark:bg-emerald-300/10 lg:block" />
      <div className="absolute right-16 bottom-24 hidden h-64 w-64 rounded-full bg-lime-300/20 blur-3xl dark:bg-lime-200/10 lg:block" />

      <main className="relative mx-auto max-w-6xl px-6 py-16 lg:px-0">
        <section className="overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-10 shadow-2xl backdrop-blur-sm">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-sm font-medium text-primary dark:text-primary-foreground">
                <Sparkles className="h-4 w-4" /> Buyer dashboard
              </span>
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Your climate portfolio performance at a glance
              </h1>
              <p className="max-w-2xl text-lg text-muted-foreground">
                Monitor purchases, understand spend, and keep stakeholders
                aligned on the impact of every retired credit.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  asChild
                  className="rounded-full bg-brandMainColor px-6 text-sm font-semibold text-white hover:bg-brandMainColor/90 dark:bg-brandSubColor dark:text-slate-950 dark:hover:bg-brandSubColor/90"
                >
                  <Link to="/market">Browse marketplace</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full px-6 text-sm font-semibold"
                >
                  <Link to="/buyer-analytics">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Analytics
                  </Link>
                </Button>
                  asChild
                  variant="outline"
                  className="rounded-full border-border/70 text-sm font-semibold"
                >
                  <Link to="/transaction-listing">View transactions</Link>
                </Button>
              </div>
            </div>
            <Card className="flex max-w-sm flex-col items-center gap-4 border border-border/70 bg-background/80 p-6 shadow-xl">
              <div className="rounded-full bg-brandMainColor/10 p-4 text-brandMainColor">
                <User className="h-10 w-10" />
              </div>
              <CardTitle className="text-xl font-semibold text-foreground">
                {user?.name || "CarbonEase Buyer"}
              </CardTitle>
              <CardDescription className="text-center text-sm text-muted-foreground">
                {user?.email || "email@carbonease.com"}
              </CardDescription>
            </Card>
          </div>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1.15fr,0.85fr]">
          <div className="space-y-8">
            <div className="grid gap-6 sm:grid-cols-3">
              <Card className="border border-border/70 bg-card/90 p-6 shadow-xl">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <Leaf className="h-5 w-5 text-brandMainColor" /> Total credits
                  purchased
                </div>
                <CardContent className="mt-4 p-0">
                  <NumberTicker
                    value={overviewTotals.totalCredits}
                    className="text-4xl font-semibold text-foreground"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Aggregated credits from verified projects
                  </p>
                </CardContent>
              </Card>
              <Card className="border border-border/70 bg-card/90 p-6 shadow-xl">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <CheckCircle className="h-5 w-5 text-brandMainColor" /> Total
                  spend (₹)
                </div>
                <CardContent className="mt-4 p-0">
                  <NumberTicker
                    value={overviewTotals.totalSpent}
                    className="text-4xl font-semibold text-foreground"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Captures payments recorded through CarbonEase
                  </p>
                </CardContent>
              </Card>
              <Card className="border border-border/70 bg-card/90 p-6 shadow-xl">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <Clock className="h-5 w-5 text-brandMainColor" /> Total orders
                </div>
                <CardContent className="mt-4 p-0">
                  <NumberTicker
                    value={overviewTotals.totalOrders}
                    className="text-4xl font-semibold text-foreground"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Includes pending fulfilments and settlements
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border border-border/70 bg-card/90 shadow-2xl">
              <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-2xl font-semibold text-foreground">
                    Recent purchases
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    Keep track of your latest transactions and associated spend.
                  </CardDescription>
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-border/70 text-sm font-semibold"
                >
                  <Link to="/transaction-listing">See all</Link>
                </Button>
              </CardHeader>
              <CardContent className="overflow-hidden rounded-2xl border border-border/60">
                <Table>
                  <TableHeader className="bg-muted/60">
                    <TableRow>
                      <TableHead>Seller</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead>Amount (₹)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentPurchases.length > 0 ? (
                      recentPurchases.slice(0, 5).map((order) => (
                        <TableRow key={order._id}>
                          <TableCell className="text-sm text-foreground">
                            {order.seller?.name || order.seller?.email || "Unknown Seller"}
                          </TableCell>
                          <TableCell className="text-sm text-foreground">
                            {Number(order.quantity || 0).toLocaleString()} credits
                          </TableCell>
                          <TableCell className="text-sm font-semibold text-foreground">
                            ₹{Number(order.totalAmount || 0).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="py-10 text-center text-sm text-muted-foreground"
                        >
                          No purchases recorded yet. Visit the marketplace to
                          get started.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card className="border border-border/70 bg-card/90 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-foreground">
                  Workspace tips
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Ways to keep your team aligned
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Share this dashboard with finance, sustainability, and
                  procurement leads so everyone tracks offsets and spend in real
                  time.
                </p>
                <p>
                  Use the transaction ledger export when reporting to auditors,
                  ESG stakeholders, or compliance bodies.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-primary/30 bg-primary/10 shadow-xl dark:border-brandSubColor/30 dark:bg-brandSubColor/10">
              <CardContent className="space-y-4 p-6 text-sm text-primary dark:text-primary-foreground/90">
                <p>
                  Ready to scale climate impact? Explore bundle purchases,
                  long-term offtakes, and curated portfolios tailored to your
                  industry.
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="w-full rounded-full border-primary/40 text-primary hover:bg-primary/10 dark:border-primary-foreground/30 dark:text-primary-foreground"
                >
                  <Link to="/contact">Talk to our team</Link>
                </Button>
              </CardContent>
            </Card>
          </aside>
        </section>
      </main>
    </div>
  );
};

export default BuyerDashboard;
