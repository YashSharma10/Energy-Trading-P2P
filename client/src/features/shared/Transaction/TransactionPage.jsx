import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast, Toaster } from "sonner";
import {
  CreditCard,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

const TransactionPage = () => {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const pricePerCredit = Number(searchParams.get("price")) || 0;
  const title = searchParams.get("title");
  const maxQuantity = Number(searchParams.get("maxQuantity")) || 1;

  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    upiId: "",
  });

  const totalPrice = pricePerCredit * quantity;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    try {
      const payload = {
        listingId: id,
        quantity: Number(quantity),
        paymentMethod,
      };

      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
      const response = await axios.post(
        `${API_BASE_URL}/credits/payment`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        const transactionId = response.data.data.transactionId;
        
        toast.success(
          <div className="flex items-center gap-3">
            <img
              src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExeXBlNzgxMjd1ZWN3bGI0MHM0NTJneTd2NzE2cXpvY2pwNms1aGEweCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/s14jtoFmzJM3n4uyfi/giphy.gif"
              alt="Success"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-semibold text-lg">Payment Successful!</p>
              <p className="text-sm text-gray-500">
                Your transaction has been completed.
              </p>
            </div>
          </div>,
          { duration: 4000 }
        );
        setTimeout(() => {
          navigate(`/receipt/${transactionId}`);
        }, 2000);
      } else {
        throw new Error("Payment failed. Please try again.");
      }
    } catch (error) {
      toast.error("Payment failed. Please try again.");
      console.error("Payment Error:", error);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <Toaster position="top-center" richColors />
      <div className="absolute inset-0 bg-gradient-to-b from-brandMainColor/15 via-transparent to-transparent dark:from-brandSubColor/20" />
      <div className="absolute left-12 top-24 hidden h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl dark:bg-emerald-300/10 lg:block" />
      <div className="absolute right-24 bottom-16 hidden h-64 w-64 rounded-full bg-lime-300/20 blur-3xl dark:bg-lime-200/10 lg:block" />

      <main className="relative mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-16 lg:flex-row lg:px-0">
        <section className="flex-1 space-y-6">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-sm font-medium text-primary dark:text-primary-foreground">
              <ShieldCheck className="h-4 w-4" /> Secure checkout
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Finalize your carbon credit purchase
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Complete payment to reserve credits from{" "}
              <span className="font-medium text-foreground">{title}</span>. A
              retirement certificate and transaction summary will be available
              instantly after confirmation.
            </p>
          </div>

          <Card className="border border-border/70 bg-card/90 shadow-2xl">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl font-semibold text-foreground">
                Payment details
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Choose your preferred method. Payments are encrypted and
                auditable.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Method
                </Label>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="grid gap-3 sm:grid-cols-2"
                >
                  <label
                    htmlFor="card"
                    className={`flex cursor-pointer items-center gap-3 rounded-2xl border border-border/70 bg-background/80 px-4 py-3 text-sm transition-all ${
                      paymentMethod === "card"
                        ? "border-brandMainColor/60 shadow-md"
                        : "hover:border-border"
                    }`}
                  >
                    <RadioGroupItem
                      value="card"
                      id="card"
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-brandMainColor/10 p-2 text-brandMainColor">
                        <CreditCard className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Card</p>
                        <p className="text-xs text-muted-foreground">
                          Visa, Mastercard, Amex
                        </p>
                      </div>
                    </div>
                  </label>
                  <label
                    htmlFor="upi"
                    className={`flex cursor-pointer items-center gap-3 rounded-2xl border border-border/70 bg-background/80 px-4 py-3 text-sm transition-all ${
                      paymentMethod === "upi"
                        ? "border-brandMainColor/60 shadow-md"
                        : "hover:border-border"
                    }`}
                  >
                    <RadioGroupItem value="upi" id="upi" className="sr-only" />
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-brandMainColor/10 p-2 text-brandMainColor">
                        <Smartphone className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">UPI</p>
                        <p className="text-xs text-muted-foreground">
                          Pay via BHIM, Google Pay, PhonePe
                        </p>
                      </div>
                    </div>
                  </label>
                </RadioGroup>
              </div>

              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Card number</Label>
                    <Input
                      type="text"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      maxLength={16}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Expiry (MM/YY)</Label>
                      <Input
                        type="text"
                        name="expiry"
                        placeholder="MM/YY"
                        maxLength={5}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>CVV</Label>
                      <Input
                        type="password"
                        name="cvv"
                        placeholder="***"
                        maxLength={3}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "upi" && (
                <div className="space-y-2">
                  <Label>UPI ID</Label>
                  <Input
                    type="text"
                    name="upiId"
                    placeholder="yourname@upi"
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    We&apos;ll redirect you to your UPI app to approve the
                    payment securely.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button
                className="h-12 w-full rounded-xl bg-brandMainColor text-sm font-semibold text-white hover:bg-brandMainColor/90 dark:bg-brandSubColor dark:text-slate-950 dark:hover:bg-brandSubColor/90"
                onClick={handlePayment}
              >
                Confirm and pay ₹{totalPrice.toLocaleString()}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                By paying, you acknowledge the purchase of verified carbon
                credits and agree to CarbonEase&apos;s terms.
              </p>
            </CardFooter>
          </Card>
        </section>

        <aside className="flex-1 space-y-6">
          <Card className="border border-border/70 bg-card/90 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground">
                Order summary
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Review the project information, pricing, and quantity.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Project
                </p>
                <p className="mt-1 text-lg font-semibold text-foreground">
                  {title || "Carbon credit listing"}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity (credits)</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={maxQuantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(Math.max(1, Number(e.target.value)), maxQuantity))}
                  className="text-lg font-semibold"
                />
                <p className="text-xs text-muted-foreground">
                  Maximum available: {maxQuantity.toLocaleString()} credits
                </p>
              </div>
              <div className="flex justify-between rounded-2xl border border-border/70 bg-background/80 p-4 text-sm">
                <span className="text-muted-foreground">Price per credit</span>
                <span className="font-semibold text-foreground">
                  ₹{pricePerCredit.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between rounded-2xl border border-border/70 bg-background/80 p-4 text-sm">
                <span className="text-muted-foreground">Quantity</span>
                <span className="font-semibold text-foreground">
                  {quantity.toLocaleString()} credits
                </span>
              </div>
              <div className="flex justify-between rounded-2xl border border-primary/30 bg-primary/10 p-4 text-lg font-bold">
                <span className="text-foreground">Total payable</span>
                <span className="text-foreground">
                  ₹{totalPrice.toLocaleString()}
                </span>
              </div>
              <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4 text-sm text-primary dark:text-primary-foreground/90">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <p>
                    Secure receipt, project documents, and retirement
                    certificate will be emailed after payment.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/70 bg-card/90 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">
                Need help?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Reach out to payments@carbonease.com or your account manager for
                assisted procurement or invoicing requests.
              </p>
              <p>
                Refunds follow registry and project-specific terms. Credits are
                retired upon payment confirmation.
              </p>
            </CardContent>
          </Card>
        </aside>
      </main>
    </div>
  );
};

export default TransactionPage;
