import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  FileText,
  ClipboardList,
  Tag,
  MapPin,
  CheckCircle,
  DollarSign,
  Link as LinkIcon,
  Loader2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import FileUpload from "@/components/common/FileUpload";

const createInitialFormState = () => ({
  title: "",
  description: "",
  quantity: "",
  pricePerCredit: "",
  location: "",
  projectType: "",
  verification: {
    verifiedBy: "",
    certificateUrl: "",
  },
  status: "Available",
});

const FormComponent = ({ isOpen, setIsOpen }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState(createInitialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice =
    Number(formData.quantity || 0) * Number(formData.pricePerCredit || 0);

  const handleOpenChange = (openState) => {
    if (!openState) {
      setFormData(createInitialFormState());
      setIsSubmitting(false);
    }
    setIsOpen(openState);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleVerificationChange = (name, value) => {
    setFormData((previous) => ({
      ...previous,
      verification: {
        ...previous.verification,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!token) {
      toast({
        title: "You need to be signed in",
        description: "Log in again to create a new listing.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        quantity: Number(formData.quantity) || 0,
        pricePerCredit: Number(formData.pricePerCredit) || 0,
        totalPrice,
        verification: {
          verifiedBy: formData.verification.verifiedBy || "Others",
          certificateUrl: formData.verification.certificateUrl || "",
        },
      };

      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
      await axios.post(`${API_BASE_URL}/credits/post`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast({
        title: "Listing created",
        description: "Your project is now available in the marketplace.",
      });

      setFormData(createInitialFormState());
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating listing:", error);
      toast({
        title: "Unable to create listing",
        description:
          error.response?.data?.message ||
          "Please review your details and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl overflow-hidden border border-border/70 bg-card/95 p-0 shadow-xl">
        <form
          onSubmit={handleSubmit}
          className="flex max-h-[75vh] flex-col gap-6"
        >
          <DialogHeader className="space-y-2 px-6 pt-6">
            <DialogTitle className="text-2xl font-semibold">
              Create a marketplace listing
            </DialogTitle>
            <DialogDescription>
              Share project details, pricing, and verification so buyers can act
              with confidence.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6">
            <div className="grid gap-6 pb-2">
              <div className="grid gap-3">
                <Label htmlFor="title">Project title</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Mangrove restoration in Bali"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="description">Summary</Label>
                <div className="relative">
                  <ClipboardList className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Outline the climate impact, methodology, and project milestones."
                    className="min-h-[120px] resize-y pl-10"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-3">
                  <Label htmlFor="quantity">Available credits</Label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder="e.g. 5,000"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="pricePerCredit">Price per credit (USD)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="pricePerCredit"
                      name="pricePerCredit"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.pricePerCredit}
                      onChange={handleChange}
                      placeholder="e.g. 12"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="totalPrice">Estimated contract value</Label>
                  <div className="relative">
                    <CheckCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="totalPrice"
                      name="totalPrice"
                      value={totalPrice ? totalPrice.toLocaleString() : "0"}
                      readOnly
                      className="pl-10 font-semibold text-foreground"
                    />
                  </div>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="location">Project location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="City, Country"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-3">
                  <Label htmlFor="projectType">Project type</Label>
                  <Select
                    value={formData.projectType || undefined}
                    onValueChange={(value) =>
                      setFormData((previous) => ({
                        ...previous,
                        projectType: value,
                      }))
                    }
                  >
                    <SelectTrigger id="projectType">
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Reforestation">
                        Reforestation
                      </SelectItem>
                      <SelectItem value="Renewable Energy">
                        Renewable Energy
                      </SelectItem>
                      <SelectItem value="Waste Management">
                        Waste Management
                      </SelectItem>
                      <SelectItem value="Agriculture">Agriculture</SelectItem>
                      <SelectItem value="Blue Carbon">Blue Carbon</SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="status">Listing status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData((previous) => ({
                        ...previous,
                        status: value,
                      }))
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Sold">Sold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-3">
                  <Label>Verified by</Label>
                  <Select
                    value={formData.verification.verifiedBy || undefined}
                    onValueChange={(value) =>
                      handleVerificationChange("verifiedBy", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select standard" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VCS">
                        Verified Carbon Standard
                      </SelectItem>
                      <SelectItem value="Gold Standard">
                        Gold Standard
                      </SelectItem>
                      <SelectItem value="CDM">
                        Clean Development Mechanism
                      </SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="certificateUrl">Certificate URL</Label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="certificateUrl"
                      name="certificateUrl"
                      type="url"
                      placeholder="Link to verification or registry entry"
                      value={formData.verification.certificateUrl}
                      onChange={(event) =>
                        handleVerificationChange(
                          "certificateUrl",
                          event.target.value
                        )
                      }
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-dashed border-border/60 bg-muted/30 p-4 text-xs text-muted-foreground">
                Attach supporting documentation such as monitoring reports,
                methodologies, or imagery to help buyers validate your claims.
              </div>

              <FileUpload />
            </div>
          </div>

          <DialogFooter className="gap-2 border-t border-border/70 bg-card/80 px-6 py-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Publishing
                </span>
              ) : (
                "Publish listing"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

FormComponent.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

export default FormComponent;
