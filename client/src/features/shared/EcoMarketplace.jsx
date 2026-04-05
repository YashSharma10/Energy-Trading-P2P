import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import PaymentSuccessDialog from "@/components/common/PaymentSuccessDialog";
import {
  Search,
  Leaf,
  ShoppingCart,
  Star,
  Filter,
  ChevronLeft,
  ChevronRight,
  Package,
  IndianRupee,
  RefreshCw,
  X,
  CreditCard,
  Wind,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import {
  getEcoProducts,
  createCheckoutSession,
  getMyEcoOrders,
} from "@/services/ecoProductService";
import { ECO_PRODUCT_CATEGORIES } from "@/constants/api";
import api from "@/lib/api";

const parseTags = (tags) => {
  if (!tags) return [];
  const tagsArray = Array.isArray(tags) ? tags : [tags];
  return tagsArray
    .flatMap((t) => (typeof t === "string" ? t.split(",").map((s) => s.trim()) : []))
    .filter(Boolean);
};

const EcoMarketplace = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Purchase dialog
  const [purchaseProduct, setPurchaseProduct] = useState(null);
  const [purchaseQty, setPurchaseQty] = useState(1);
  const [shippingAddress, setShippingAddress] = useState("");
  const [purchasing, setPurchasing] = useState(false);

  // Orders dialog
  const [showOrders, setShowOrders] = useState(false);
  const [myOrders, setMyOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Payment success dialog
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successOrderDetails, setSuccessOrderDetails] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, search, category, sortOrder]);

  // Check for payment success on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get("success");
    const orderId = urlParams.get("orderId");

    if (success === "true" && orderId) {
      // Fetch order details
      fetchOrderDetails(orderId);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const fetchOrderDetails = async (orderId) => {
    const maxAttempts = 12;
    let attempts = 0;

    const check = async () => {
      try {
        const { data } = await api.get(`/eco-products/order/${orderId}`);
        const order = data.data;

        if (order?.paymentStatus === "completed") {
          setSuccessOrderDetails({
            orderHash: order.orderHash,
            productName: order.product?.name,
            quantity: order.quantity,
            totalAmount: order.totalAmount,
          });
          setShowSuccessDialog(true);
          fetchProducts();
          return;
        }
      } catch (err) {
        console.error("Failed to fetch order details:", err);
      }

      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(check, 2500);
      } else {
        // Show dialog anyway after timeout
        setShowSuccessDialog(true);
        fetchProducts();
      }
    };

    check();
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 12,
        status: "Active",
        sortBy: "createdAt",
        sortOrder,
      };
      if (search) params.search = search;
      if (category && category !== "all") params.category = category;

      const res = await getEcoProducts(params);
      setProducts(res.data || []);
      if (res.pagination) {
        setTotalPages(res.pagination.totalPages);
        setTotalItems(res.pagination.totalItems);
      }
    } catch (err) {
      console.error("Failed to load eco products:", err);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to purchase products",
        variant: "destructive",
      });
      return;
    }
    setPurchasing(true);
    try {
      // Create Stripe checkout session
      const res = await createCheckoutSession({
        productId: purchaseProduct._id,
        quantity: purchaseQty,
        shippingAddress,
      });

      // Redirect to Stripe checkout using the session URL
      if (res.data.sessionUrl) {
        window.location.href = res.data.sessionUrl;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err) {
      toast({
        title: "Payment Failed",
        description:
          err.response?.data?.message || err.message || "Something went wrong",
        variant: "destructive",
      });
      setPurchasing(false);
    }
    // Don't reset purchasing state here as user will be redirected
  };

  const openOrders = async () => {
    setShowOrders(true);
    setOrdersLoading(true);
    try {
      const res = await getMyEcoOrders();
      setMyOrders(res.data || []);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load your orders",
        variant: "destructive",
      });
    } finally {
      setOrdersLoading(false);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setSortOrder("desc");
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const FilterSidebar = () => (
    <div className="space-y-6 p-1">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Filter className="h-5 w-5" /> Filters
      </h3>
      <div>
        <Label>Category</Label>
        <Select
          value={category}
          onValueChange={(val) => {
            setCategory(val);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {ECO_PRODUCT_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Sort by Price</Label>
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Price: Low to High</SelectItem>
            <SelectItem value="desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button variant="outline" className="w-full" onClick={resetFilters}>
        <RefreshCw className="h-4 w-4 mr-2" /> Reset Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pt-24 lg:pt-28">
      {/* Compact Header Bar */}
      <div className="border-b border-border bg-green-50 dark:bg-green-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
            <div>
              <h1 className="text-lg font-semibold text-foreground leading-tight">
                Eco-Friendly Marketplace
              </h1>
              <p className="text-xs text-muted-foreground">
                {totalItems} sustainable products across{" "}
                {ECO_PRODUCT_CATEGORIES.length} categories
              </p>
            </div>
          </div>
          {user && (
            <Button
              size="sm"
              variant="outline"
              className="border-green-600 text-green-700 hover:bg-green-100 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-950/60 shrink-0"
              onClick={openOrders}
            >
              <Package className="h-4 w-4 mr-1.5" /> My Orders
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
        {/* Search bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Search eco products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Mobile filter trigger */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="sm:hidden">
                <Filter className="h-4 w-4 mr-2" /> Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-6">
              <FilterSidebar />
            </SheetContent>
          </Sheet>

          {/* Desktop filters inline */}
          <div className="hidden sm:flex gap-3">
            <Select
              value={category}
              onValueChange={(val) => {
                setCategory(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {ECO_PRODUCT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[170px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Newest First</SelectItem>
                <SelectItem value="asc">Price: Low → High</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" onClick={resetFilters}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-48 w-full rounded-t-lg" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-8 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Leaf className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground">
              No products found
            </h3>
            <p className="text-muted-foreground mt-1">
              Try adjusting your filters or search terms.
            </p>
            <Button variant="outline" className="mt-4" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-1">
            {products.map((product) => (
              <Card
                key={product._id}
                className="group flex flex-col overflow-hidden rounded-3xl border-2 border-border/40 bg-card hover:border-brandMainColor/50 hover:shadow-[0_0_30px_-5px_rgba(92,179,56,0.15)] transition-all duration-500"
              >
                {/* ── Image Section ── */}
                <div className="relative h-52 overflow-hidden bg-muted/20">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-green-50 dark:bg-green-900/20">
                      <Leaf className="h-16 w-16 text-green-300 dark:text-green-700/50" />
                    </div>
                  )}

                  {/* Gradient Overlay for Bottom Text Context */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

                  {/* Top Left: Stars (Eco Rating) */}
                  <div className="absolute left-3 top-3">
                    <Badge className="bg-background/95 text-yellow-500 backdrop-blur-sm shadow-sm border-border/50 text-[10px] tracking-widest pointer-events-none px-2.5 py-0.5">
                      {"★".repeat(product.ecoRating || 3)}
                    </Badge>
                  </div>

                  {/* Top Right: Carbon Impact */}
                  {product.carbonEmissionSaved != null && (
                    <div className="absolute right-3 top-3">
                      <div className="flex items-center gap-1.5 rounded-full bg-background/95 backdrop-blur-md px-2.5 py-1 border border-emerald-500/30 shadow-sm pointer-events-none">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] font-bold text-foreground tracking-wide">
                          {product.carbonEmissionSaved} kg CO₂ <span className="text-emerald-600 dark:text-emerald-400 uppercase">Offset</span>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Bottom Left: Category */}
                  <div className="absolute bottom-3 left-3 pointer-events-none">
                    <Badge variant="secondary" className="bg-background/90 backdrop-blur-md border-border/50 text-xs font-medium text-foreground px-2.5 py-0.5 shadow-sm">
                      {product.category}
                    </Badge>
                  </div>
                </div>

                {/* ── Content Section ── */}
                <CardContent className="flex flex-1 flex-col p-5">
                  <div className="mb-3">
                    <h3 className="line-clamp-1 text-xl font-bold text-foreground group-hover:text-brandMainColor transition-colors duration-300">
                      {product.name}
                    </h3>
                    <p className="line-clamp-2 mt-1.5 text-sm text-muted-foreground leading-snug">
                      {product.description}
                    </p>
                  </div>

                  {parseTags(product.tags).length > 0 && (
                    <div className="mt-auto mb-5 flex flex-wrap gap-1.5">
                      {parseTags(product.tags)
                        .slice(0, 3)
                        .map((tag, i) => (
                          <span
                            key={i}
                            className="rounded-md bg-muted px-2 py-0.5 text-[10px] text-muted-foreground border border-border/40 font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                  )}

                  {/* ── Bottom Action Row ── */}
                  <div className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">
                        Price
                      </p>
                      <p className="text-2xl font-black text-foreground">
                        ₹{product.price?.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-col items-end">
                      <Button
                        size="sm"
                        className="rounded-full bg-brandMainColor text-white font-semibold transition-all duration-300 hover:scale-105 hover:bg-brandMainColor/90 disabled:opacity-50 h-9 px-5 shadow-sm hover:shadow-[0_0_15px_-3px_rgba(92,179,56,0.5)]"
                        onClick={() => {
                          setPurchaseProduct(product);
                          setPurchaseQty(1);
                        }}
                        disabled={product.stock === 0}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {product.stock === 0 ? "Sold Out" : "Buy Now"}
                      </Button>
                      <p className="text-[10px] mt-1.5 font-medium text-muted-foreground">
                        {product.stock > 0 ? (
                          <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">{product.stock} in stock</span>
                        ) : (
                          <span className="text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">Unavailable</span>
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-10">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>

      {/* Purchase Dialog */}
      <Dialog
        open={!!purchaseProduct}
        onOpenChange={() => setPurchaseProduct(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-green-600" />
              Purchase Product
            </DialogTitle>
          </DialogHeader>
          {purchaseProduct && (
            <div className="space-y-4 mt-2">
              <div className="flex gap-4">
                {purchaseProduct.imageUrl ? (
                  <img
                    src={purchaseProduct.imageUrl}
                    alt={purchaseProduct.name}
                    className="h-20 w-20 rounded object-cover"
                  />
                ) : (
                  <div className="h-20 w-20 rounded bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <Leaf className="h-8 w-8 text-green-600" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold">{purchaseProduct.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {purchaseProduct.category}
                  </p>
                  <p className="text-lg font-bold text-green-700 dark:text-green-400">
                    ₹{purchaseProduct.price?.toLocaleString()} / unit
                  </p>
                </div>
              </div>

              <div>
                <Label>Quantity (max {purchaseProduct.stock})</Label>
                <Input
                  type="number"
                  min={1}
                  max={purchaseProduct.stock}
                  value={purchaseQty}
                  onChange={(e) =>
                    setPurchaseQty(
                      Math.min(Number(e.target.value), purchaseProduct.stock),
                    )
                  }
                />
              </div>

              <div>
                <Label>Shipping Address (optional)</Label>
                <Input
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Enter delivery address"
                />
              </div>

              <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4">
                <div className="flex justify-between text-sm">
                  <span>Unit Price</span>
                  <span>₹{purchaseProduct.price?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>Quantity</span>
                  <span>×{purchaseQty}</span>
                </div>
                <hr className="my-2 border-green-200 dark:border-green-800" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-green-700 dark:text-green-400">
                    ₹{(purchaseProduct.price * purchaseQty).toLocaleString()}
                  </span>
                </div>
              </div>

              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={handlePurchase}
                disabled={purchasing || purchaseQty < 1}
              >
                {purchasing ? (
                  <span className="flex items-center gap-2">
                    Redirecting to Payment...
                  </span>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay with Stripe - ₹
                    {(purchaseProduct.price * purchaseQty).toLocaleString()}
                  </>
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-2">
                Secure payment powered by Stripe
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* My Orders Dialog */}
      <Dialog open={showOrders} onOpenChange={setShowOrders}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-green-600" />
              My Eco Orders
            </DialogTitle>
          </DialogHeader>
          {ordersLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : myOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>No orders yet. Start shopping!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myOrders.map((order) => (
                <Card key={order._id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {order.product?.imageUrl ? (
                          <img
                            src={order.product.imageUrl}
                            alt={order.product?.name}
                            className="h-12 w-12 rounded object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded bg-green-100 dark:bg-green-900 flex items-center justify-center">
                            <Leaf className="h-5 w-5 text-green-600" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-sm">
                            {order.product?.name || "Product"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {order.quantity} • ₹
                            {order.totalAmount?.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={
                          order.orderStatus === "delivered"
                            ? "bg-green-600 text-white"
                            : ""
                        }
                      >
                        {order.orderStatus}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Success Dialog */}
      <PaymentSuccessDialog
        isOpen={showSuccessDialog}
        onClose={() => {
          setShowSuccessDialog(false);
          setSuccessOrderDetails(null);
        }}
        orderDetails={successOrderDetails}
      />
    </div>
  );
};

export default EcoMarketplace;
