import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  MapPin,
  IndianRupee,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Sparkles,
  Leaf,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, API_ENDPOINTS, PAGINATION, LISTING_STATUS } from "@/constants/api";

const Marketplace = () => {
  const navigate = useNavigate();
  const [allListings, setAllListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [filters, setFilters] = useState({
    title: "",
    location: "",
    minPrice: "",
  });
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(PAGINATION.DEFAULT_PAGE);
  const itemsPerPage = PAGINATION.ITEMS_PER_PAGE.MARKETPLACE;
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchListings();
  }, [currentPage, filters, sortOrder]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        status: LISTING_STATUS.AVAILABLE,
      };
      
      if (filters.title) params.search = filters.title;
      if (filters.location) params.location = filters.location;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (sortOrder) params.sortBy = `pricePerCredit:${sortOrder}`;

      const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.CREDITS.BASE}`, { params });
      const listings = response.data.data || [];
      setAllListings(listings);
      setFilteredListings(listings);
      
      if (response.data.pagination) {
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.totalItems);
      }
    } catch (err) {
      console.error("Failed to load listings:", err);
      setError("Failed to load listings");
    }
    setLoading(false);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = (nextFilters = filters, nextSort = sortOrder) => {
    setFilters(nextFilters);
    setSortOrder(nextSort);
    setCurrentPage(PAGINATION.DEFAULT_PAGE);
  };

  const handleApplyFilters = () => {
    applyFilters(filters, sortOrder);
  };

  const handleClearFilters = () => {
    const cleared = { title: "", location: "", minPrice: "" };
    setFilters(cleared);
    applyFilters(cleared, sortOrder);
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
    applyFilters(filters, value);
  };

  // Pagination Logic
  const currentListings = filteredListings;
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage + 1;
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalItems);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const marketInsights = useMemo(() => {
    if (!allListings.length) {
      return {
        totalProjects: 0,
        averagePrice: 0,
        regions: 0,
      };
    }

    const totalProjects = allListings.length;
    const totalPrice = allListings.reduce(
      (sum, project) => sum + (Number(project.pricePerCredit) || 0),
      0
    );
    const regions = new Set(
      allListings
        .map((project) => project.location?.toLowerCase().trim())
        .filter(Boolean)
    ).size;

    return {
      totalProjects,
      averagePrice: totalPrice / totalProjects || 0,
      regions,
    };
  }, [allListings]);

  return (
    <div className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-brandMainColor/15 via-transparent to-transparent dark:from-brandSubColor/20" />
      <div className="absolute left-16 top-24 hidden h-56 w-56 rounded-full bg-emerald-400/15 blur-3xl dark:bg-emerald-300/10 lg:block" />
      <div className="absolute right-24 bottom-16 hidden h-64 w-64 rounded-full bg-lime-400/15 blur-3xl dark:bg-lime-300/10 lg:block" />

      <main className="relative mx-auto max-w-6xl px-6 py-16 lg:px-0">
        <section className="grid gap-8 rounded-3xl border border-border/70 bg-card/90 p-10 shadow-2xl backdrop-blur-sm lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-sm font-medium text-primary dark:text-primary-foreground">
              <Sparkles className="h-4 w-4" /> Carbon credit marketplace
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Discover high-integrity climate projects ready for investment
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Browse verified listings across renewable energy, nature-based
              solutions, and carbon removal. Filter by location, price, and
              project type to build a diversified offset portfolio.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="border border-border/60 bg-background/80 shadow-inner">
                <CardContent className="space-y-1 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Live projects
                  </p>
                  <p className="text-2xl font-semibold text-foreground">
                    {marketInsights.totalProjects}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Across compliance and voluntary markets
                  </p>
                </CardContent>
              </Card>
              <Card className="border border-border/60 bg-background/80 shadow-inner">
                <CardContent className="space-y-1 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Avg. price / credit
                  </p>
                  <p className="text-2xl font-semibold text-foreground">
                    ₹{marketInsights.averagePrice.toFixed(0)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Based on current marketplace listings
                  </p>
                </CardContent>
              </Card>
              <Card className="border border-border/60 bg-background/80 shadow-inner">
                <CardContent className="space-y-1 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Regions represented
                  </p>
                  <p className="text-2xl font-semibold text-foreground">
                    {marketInsights.regions}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Climate-positive projects worldwide
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          <Card className="border border-primary/30 bg-primary/10 shadow-xl dark:border-brandSubColor/30 dark:bg-brandSubColor/10">
            <CardContent className="flex h-full flex-col justify-between p-8">
              <div className="space-y-4">
                <CardTitle className="text-2xl font-semibold text-primary dark:text-primary-foreground">
                  Why climate leaders choose CarbonEase
                </CardTitle>
                <ul className="space-y-3 text-sm text-primary/80 dark:text-primary-foreground/80">
                  <li className="flex items-start gap-2">
                    <Leaf className="mt-0.5 h-4 w-4" /> Rigorous due diligence
                    per listing, including registry documentation and MRV
                    status.
                  </li>
                  <li className="flex items-start gap-2">
                    <Leaf className="mt-0.5 h-4 w-4" /> Integrated procurement
                    workflows from exploration to retirement certificates.
                  </li>
                  <li className="flex items-start gap-2">
                    <Leaf className="mt-0.5 h-4 w-4" /> Collaborative workspace
                    for finance, sustainability, and procurement teams.
                  </li>
                </ul>
              </div>
              <Button
                variant="outline"
                className="mt-6 h-12 rounded-full border-primary/40 text-primary hover:bg-primary/10 dark:border-primary-foreground/30 dark:text-primary-foreground"
                onClick={fetchListings}
              >
                Refresh marketplace inventory
              </Button>
            </CardContent>
          </Card>
        </section>

        <section className="mt-12 grid gap-10 lg:grid-cols-[280px,1fr]">
          <div className="space-y-4">
            <Card className="hidden lg:block border border-border/70 bg-card/90 shadow-xl">
              <CardHeader className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Search className="h-4 w-4" /> Refine results
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Narrow listings by title, geography, and minimum price.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  name="title"
                  value={filters.title}
                  placeholder="Project or registry title"
                  onChange={handleFilterChange}
                />
                <Input
                  name="location"
                  value={filters.location}
                  placeholder="Location"
                  onChange={handleFilterChange}
                />
                <Input
                  name="minPrice"
                  value={filters.minPrice}
                  placeholder="Min price per credit"
                  type="number"
                  onChange={handleFilterChange}
                />
                <div className="flex flex-col gap-3">
                  <Button
                    className="h-11 w-full rounded-xl bg-brandMainColor text-sm font-semibold text-white hover:bg-brandMainColor/90 dark:bg-brandSubColor dark:text-slate-950 dark:hover:bg-brandSubColor/90"
                    onClick={handleApplyFilters}
                  >
                    <Search className="mr-2 h-4 w-4" /> Apply filters
                  </Button>
                  <Button
                    variant="outline"
                    className="h-11 w-full rounded-xl border-border/70 text-sm font-semibold"
                    onClick={handleClearFilters}
                  >
                    Clear filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between gap-3 lg:hidden">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter size={16} /> Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="space-y-4 p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <Button variant="ghost" onClick={handleClearFilters}>
                      Reset
                    </Button>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Input
                      name="title"
                      value={filters.title}
                      placeholder="Project or registry title"
                      onChange={handleFilterChange}
                    />
                    <Input
                      name="location"
                      value={filters.location}
                      placeholder="Location"
                      onChange={handleFilterChange}
                    />
                    <Input
                      name="minPrice"
                      value={filters.minPrice}
                      placeholder="Min price per credit"
                      type="number"
                      onChange={handleFilterChange}
                    />
                    <Button
                      className="h-11 rounded-xl bg-brandMainColor text-sm font-semibold text-white hover:bg-brandMainColor/90 dark:bg-brandSubColor dark:text-slate-950 dark:hover:bg-brandSubColor/90"
                      onClick={() => {
                        handleApplyFilters();
                        setIsSheetOpen(false);
                      }}
                    >
                      Apply filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              <Select onValueChange={handleSortChange} value={sortOrder}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Price: low to high</SelectItem>
                  <SelectItem value="desc">Price: high to low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card className="hidden lg:flex flex-col gap-4 border border-border/70 bg-card/90 p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Sort results
                </h3>
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
              </div>
              <Select onValueChange={handleSortChange} value={sortOrder}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Price: low to high</SelectItem>
                  <SelectItem value="desc">Price: high to low</SelectItem>
                </SelectContent>
              </Select>
            </Card>
          </div>

          <section className="space-y-6">
            {loading && (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <Skeleton key={`marketplace-skeleton-${Date.now()}-${idx}`} className="h-64 w-full rounded-2xl" />
                ))}
              </div>
            )}
            {!loading && error && (
              <Card className="border border-destructive/40 bg-destructive/10 p-6 text-destructive">
                <CardContent className="p-0">{error}</CardContent>
              </Card>
            )}
            {!loading && !error && filteredListings.length === 0 && (
              <Card className="border border-border/70 bg-card/90 p-10 text-center shadow-xl">
                <CardContent className="space-y-3 p-0">
                  <h2 className="text-xl font-semibold text-foreground">
                    No listings found
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Adjust your filters or refresh the marketplace to view more
                    projects.
                  </p>
                  <Button variant="outline" onClick={handleClearFilters}>
                    Clear filters
                  </Button>
                </CardContent>
              </Card>
            )}
            {!loading && !error && filteredListings.length > 0 && (
              <>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {currentListings.map((listing) => (
                    <Card
                      key={listing._id}
                      className="group border border-border/70 bg-card/90 shadow-xl transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl"
                    >
                      <div className="h-1 w-full bg-gradient-to-r from-brandMainColor via-emerald-500 to-lime-400 dark:from-brandSubColor" />
                      <CardHeader className="space-y-2 pb-2">
                        <CardTitle className="text-lg font-semibold text-foreground">
                          {listing.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                          {listing.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 text-brandMainColor" />
                          {listing.location || "Not specified"}
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          <IndianRupee className="h-4 w-4 text-brandMainColor" />
                          {Number(listing.pricePerCredit).toLocaleString()} /
                          credit
                        </div>
                        <div className="rounded-2xl border border-border/60 bg-background/80 p-4 text-xs text-muted-foreground">
                          Includes verification reports, registry attestations,
                          and monitoring data for due diligence.
                        </div>
                        <Button
                          className="h-11 w-full rounded-xl bg-brandMainColor text-sm font-semibold text-white transition-colors hover:bg-brandMainColor/90 dark:bg-brandSubColor dark:text-slate-950 dark:hover:bg-brandSubColor/90"
                          onClick={() => {
                            const pricePerCredit =
                              Number(listing.pricePerCredit) || 0;
                            const totalPrice =
                              listing.totalPrice ?? pricePerCredit;
                            navigate(
                              `/payment?id=${
                                listing._id
                              }&amount=${pricePerCredit}&title=${encodeURIComponent(
                                listing.title
                              )}&totalPrice=${totalPrice}`
                            );
                          }}
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" /> Purchase
                          credits
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card/90 p-4 shadow-lg sm:flex-row">
                  <p className="text-sm text-muted-foreground">
                    Showing {indexOfFirstItem}-{indexOfLastItem} of{" "}
                    {totalItems} listings
                  </p>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1"
                    >
                      <ChevronLeft className="h-4 w-4" /> Previous
                    </Button>
                    <span className="text-sm font-semibold text-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1"
                    >
                      Next <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </section>
        </section>
      </main>
    </div>
  );
};

export default Marketplace;
