import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { toast } from "@/hooks/use-toast";
import { Loader2, Search, SlidersHorizontal } from "lucide-react";

const statusOptions = ["All", "Available", "Pending", "Sold"];

const ListingsPage = () => {
  const { token } = useAuth();
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      if (!token) {
        return;
      }

      setIsLoading(true);
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
        const response = await axios.get(
          `${API_BASE_URL}/credits/posted-data`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setListings(
          Array.isArray(response.data?.posted) ? response.data.posted : []
        );
      } catch (error) {
        console.error("Error fetching listings:", error);
        toast({
          title: "Unable to load listings",
          description: "Please try refreshing the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [token]);

  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      const matchesStatus =
        statusFilter === "All" ||
        (listing.status || "").toLowerCase() === statusFilter.toLowerCase();
      const matchesSearch = [
        listing.title,
        listing.description,
        listing.projectType,
      ]
        .filter(Boolean)
        .some((value) =>
          value.toLowerCase().includes(searchTerm.toLowerCase())
        );
      return matchesStatus && matchesSearch;
    });
  }, [listings, statusFilter, searchTerm]);

  const metrics = useMemo(() => {
    const activeListings = listings.filter(
      (listing) => listing.status === "Available"
    ).length;
    const totalVolume = listings.reduce(
      (sum, listing) => sum + (Number(listing.quantity) || 0),
      0
    );
    const averagePrice = listings.length
      ? listings.reduce(
          (sum, listing) => sum + (Number(listing.pricePerCredit) || 0),
          0
        ) / listings.length
      : 0;

    return {
      totalListings: listings.length,
      activeListings,
      totalVolume,
      averagePrice,
    };
  }, [listings]);

  const handleStatusChange = async (id, status) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
      await axios.put(
        `${API_BASE_URL}/listings/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setListings((prevListings) =>
        prevListings.map((listing) =>
          listing._id === id
            ? {
                ...listing,
                status,
              }
            : listing
        )
      );
      toast({
        title: "Listing updated",
        description: `Status set to ${status}.`,
      });
    } catch (error) {
      console.error("Error updating listing status:", error);
      toast({
        title: "Update failed",
        description: "We could not update the status. Please retry.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-full flex-col bg-gradient-to-b from-background via-background/95 to-muted/30">
      <section className="border-b border-border/60 bg-card/40 px-8 py-10 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <div className="space-y-2">
            <Badge
              variant="secondary"
              className="w-fit bg-primary/15 text-primary"
            >
              Inventory
            </Badge>
            <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
              Manage your marketplace listings
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Keep your projects accurate and up to date so buyers can quickly
              discover the credits that fit their climate goals.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card className="border border-border/60 bg-card shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  Total Listings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <NumberTicker
                  value={metrics.totalListings}
                  className="text-3xl font-semibold"
                />
              </CardContent>
            </Card>
            <Card className="border border-border/60 bg-card shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  Active Listings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <NumberTicker
                  value={metrics.activeListings}
                  className="text-3xl font-semibold"
                />
              </CardContent>
            </Card>
            <Card className="border border-border/60 bg-card shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  Total Credits Available
                </CardTitle>
              </CardHeader>
              <CardContent>
                <NumberTicker
                  value={metrics.totalVolume}
                  className="text-3xl font-semibold"
                />
              </CardContent>
            </Card>
            <Card className="border border-border/60 bg-card shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  Avg. Price Per Credit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <NumberTicker
                  value={metrics.averagePrice}
                  className="text-3xl font-semibold"
                  decimalPlaces={0}
                  prefix="$"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-8 md:px-8">
        <Card className="border border-border/60 bg-card shadow-sm">
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">
                Listings Overview
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Update status, pricing, and availability in real-time.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search listings..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-60"
                />
              </div>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Description
                  </TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price / Credit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-8 text-center text-sm text-muted-foreground"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Loading
                        listings...
                      </span>
                    </TableCell>
                  </TableRow>
                ) : filteredListings.length ? (
                  filteredListings.map((listing) => {
                    const status = listing.status || "Available";
                    const badgeVariant =
                      status === "Available"
                        ? "outline"
                        : status === "Sold"
                        ? "destructive"
                        : "secondary";

                    return (
                      <TableRow key={listing._id} className="last:border-0">
                        <TableCell className="font-medium text-foreground">
                          <div className="flex flex-col">
                            <span>{listing.title}</span>
                            <span className="text-xs text-muted-foreground">
                              {listing.projectType || "General"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden max-w-sm lg:table-cell">
                          <p className="line-clamp-2 text-xs text-muted-foreground">
                            {listing.description || "No description provided."}
                          </p>
                        </TableCell>
                        <TableCell>
                          {Number(listing.quantity || 0).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          $
                          {Number(listing.pricePerCredit || 0).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={badgeVariant} className="capitalize">
                            {status.toLowerCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Select
                              value={status}
                              onValueChange={(value) =>
                                handleStatusChange(listing._id, value)
                              }
                            >
                              <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Available">
                                  Available
                                </SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Sold">Sold</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleStatusChange(listing._id, "Sold")
                              }
                            >
                              Mark sold
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-8 text-center text-sm text-muted-foreground"
                    >
                      No listings match your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default ListingsPage;
