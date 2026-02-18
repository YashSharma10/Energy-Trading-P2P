import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const emissionFactors = {
  electricity: 0.5, // kg CO2/kWh
  diesel: 2.68, // kg CO2/liter
  petrol: 2.31, // kg CO2/liter
  flight: 0.15, // kg CO2/passenger-km
  naturalGas: 2.03, // kg CO2/m3
  coal: 2.86, // kg CO2/kg
  bus: 0.1, // kg CO2/passenger-km
  train: 0.05, // kg CO2/passenger-km
};

const unitOptions = {
  electricity: ["kWh", "MWh"],
  diesel: ["liters", "gallons"],
  petrol: ["liters", "gallons"],
  flight: ["passenger-km", "miles"],
  naturalGas: ["m3", "cubic feet"],
  coal: ["kg", "tons"],
  bus: ["passenger-km", "miles"],
  train: ["passenger-km", "miles"],
};

const CarbonEmissionCalculator = () => {
  const [activities, setActivities] = useState(
    Object.keys(emissionFactors).map((type) => ({
      type,
      amount: 0,
      unit: unitOptions[type][0],
    }))
  );

  const [totalEmissions, setTotalEmissions] = useState(0);
  const [requiredCredits, setRequiredCredits] = useState(0);
  const [creditCost, setCreditCost] = useState(10);
  const [showResults, setShowResults] = useState(false);

  const handleActivityChange = (index, field, value) => {
    const updatedActivities = [...activities];
    updatedActivities[index] = { ...updatedActivities[index], [field]: value };
    setActivities(updatedActivities);
  };

  const calculateEmissions = () => {
    const emissions = activities.reduce((total, activity) => {
      const amount = parseFloat(activity.amount) || 0;
      return total + amount * (emissionFactors[activity.type] || 0);
    }, 0);

    const totalEmissionsTons = emissions / 1000;
    setTotalEmissions(totalEmissionsTons);
    setRequiredCredits(Math.ceil(totalEmissionsTons));
    setShowResults(true);
  };

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-brandMainColor/15 via-background to-background py-16">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 text-center lg:px-8">
          <span className="mx-auto inline-flex items-center rounded-full border border-brandMainColor/40 bg-brandMainColor/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-brandMainColor">
            CarbonEase Tools
          </span>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl dark:text-white">
            Carbon Emission Calculator
          </h1>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground dark:text-white/80">
            Estimate emissions across power, travel, and fuel usage. Generate
            accurate offsets in minutes and translate them into verified carbon
            credit requirements.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.65fr,1fr]">
          <Card className="border border-border/70 bg-card/90 shadow-xl">
            <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="text-left">
                <CardTitle className="text-2xl font-semibold text-foreground">
                  Activity inputs
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                  Feed in your energy, mobility, and fuel data—CarbonEase
                  converts it into emissions instantly.
                </CardDescription>
              </div>
              <span className="w-fit rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                Live calculator
              </span>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {activities.map((activity, index) => (
                  <div
                    key={activity.type}
                    className="flex h-full flex-col justify-between rounded-2xl border border-border/70 bg-background/80 p-5 shadow-inner transition-transform duration-150 hover:-translate-y-1"
                  >
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {activity.type === "flight" ||
                        activity.type === "bus" ||
                        activity.type === "train"
                          ? "Mobility"
                          : activity.type === "electricity" ||
                            activity.type === "naturalGas"
                          ? "Energy"
                          : "Fuel"}
                      </p>
                      <h3 className="text-lg font-semibold text-foreground">
                        {activity.type.charAt(0).toUpperCase() +
                          activity.type.slice(1)}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Enter usage to include this source in the footprint.
                      </p>
                    </div>
                    <div className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor={`amount-${index}`}
                          className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                        >
                          Amount
                        </Label>
                        <Input
                          id={`amount-${index}`}
                          type="number"
                          className="border border-border bg-background/[0.85] text-foreground placeholder:text-muted-foreground focus:border-brandMainColor focus:ring-brandMainColor"
                          value={activity.amount}
                          onChange={(e) =>
                            handleActivityChange(
                              index,
                              "amount",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          placeholder={`Enter ${activity.type} usage`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Unit
                        </Label>
                        <Select
                          value={activity.unit}
                          onValueChange={(value) =>
                            handleActivityChange(index, "unit", value)
                          }
                        >
                          <SelectTrigger className="border border-border bg-background/[0.85] text-foreground focus:border-brandMainColor focus:ring-brandMainColor">
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                          <SelectContent>
                            {unitOptions[activity.type].map((unit) => (
                              <SelectItem key={unit} value={unit}>
                                {unit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-6 lg:sticky lg:top-24">
            <Card className="border border-border/70 bg-card/90 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-foreground">
                  Credits and pricing
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Adjust credit cost to mirror your latest procurement
                  benchmarks.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="credit-cost"
                    className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    Cost per carbon credit (USD)
                  </Label>
                  <Input
                    id="credit-cost"
                    type="number"
                    className="border border-border bg-background/[0.85] text-foreground placeholder:text-muted-foreground focus:border-brandMainColor focus:ring-brandMainColor"
                    value={creditCost}
                    onChange={(e) =>
                      setCreditCost(parseFloat(e.target.value) || 0)
                    }
                    placeholder="Enter cost per credit"
                  />
                </div>
                <Button
                  onClick={calculateEmissions}
                  className="w-full bg-brandMainColor text-sm font-semibold text-white hover:bg-brandMainColor/90"
                >
                  Calculate emissions
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-border/70 bg-card/95 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-foreground">
                  Results snapshot
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Shareable metrics for finance, sustainability, and leadership
                  teams.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {showResults ? (
                  <div className="grid gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Total emissions
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-foreground">
                        {totalEmissions.toFixed(2)} tCO₂e
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Credits required
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-foreground">
                        {requiredCredits}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Estimated offset cost
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-foreground">
                        ${(requiredCredits * creditCost).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-border/60 bg-background/80 p-5 text-sm text-muted-foreground">
                    Run the calculator to surface total emissions, credits to
                    retire, and procurement-ready cost estimates.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border border-brandMainColor/40 bg-gradient-to-br from-brandMainColor/15 via-background to-background p-6 text-center shadow-xl dark:border-brandSubColor/40 dark:from-brandSubColor/20">
              <CardContent className="space-y-4">
                <CardTitle className="text-lg font-semibold text-foreground">
                  Need verified offsets?
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                  Export scenarios directly into the CarbonEase marketplace and
                  fast-track credit sourcing aligned to your reduction plan.
                </CardDescription>
                <Link
                  to="/market"
                  className="inline-flex items-center justify-center rounded-full bg-brandMainColor px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brandMainColor/90 dark:bg-brandSubColor dark:text-slate-950 dark:hover:bg-brandSubColor/90"
                >
                  Browse verified credits
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CarbonEmissionCalculator;
