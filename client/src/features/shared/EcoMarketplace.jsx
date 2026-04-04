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
import DynamicPriceDisplay from "@/components/DynamicPriceDisplay";
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
    try {
      const { data } = await api.get(`/eco-products/my-orders`);
      const order = data.data?.find((o) => o._id === orderId);
      if (order) {
        setSuccessOrderDetails({
          orderHash: order.orderHash,
          productName: order.product?.name,
          quantity: order.quantity,
          totalAmount: order.totalAmount,
        });
        setShowSuccessDialog(true);
        // Refresh products to update stock
        fetchProducts();
      }
    } catch (err) {
      console.error("Failed to fetch order details:", err);
    }
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card
                key={product._id}
                className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
              >
                {/* Image */}
                <div className="relative h-48 bg-green-50 dark:bg-green-950 overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Leaf className="h-16 w-16 text-green-300 dark:text-green-700" />
                    </div>
                  )}
                  {/* Eco badge */}
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-green-600 text-white text-xs">
                      {"★".repeat(product.ecoRating || 3)} Eco
                    </Badge>
                  </div>
                  {product.stock <= 5 && product.stock > 0 && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="destructive" className="text-xs">
                        Only {product.stock} left!
                      </Badge>
                    </div>
                  )}
                </div>

                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base line-clamp-1">
                      {product.name}
                    </CardTitle>
                  </div>
                  <Badge variant="outline" className="w-fit text-xs">
                    {product.category}
                  </Badge>
                </CardHeader>

                <CardContent className="pt-0">
                  <CardDescription className="text-sm line-clamp-2 mb-3">
                    {product.description}
                  </CardDescription>

                  {product.tags && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.tags.slice(0, 3).map((tag, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="mb-3">
                    <DynamicPriceDisplay
                      itemId={product._id}
                      isProduct={true}
                      basePrice={product.price}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => {
                        setPurchaseProduct(product);
                        setPurchaseQty(1);
                      }}
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      {product.stock === 0 ? "Sold Out" : "Buy"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {product.stock} in stock
                  </p>
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
