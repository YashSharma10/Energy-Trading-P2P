import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const highlights = [
  {
    title: "Verified marketplaces",
    description:
      "Access rigorously screened credits sourced from renewable energy, reforestation, and carbon removal projects across emerging markets.",
  },
  {
    title: "Transparent pricing",
    description:
      "Pricing intelligence, live benchmarks, and trade histories keep procurement teams confident and audit-ready.",
  },
  {
    title: "Unified tooling",
    description:
      "Model offsets, forecast carbon budgets, and export compliance-ready reports from a single dashboard.",
  },
];

const marketTypes = [
  {
    name: "Compliance markets",
    details:
      "Government-regulated cap-and-trade systems where organizations must hold allowances or buy credits to remain within emission limits.",
  },
  {
    name: "Voluntary markets",
    details:
      "Enterprises and individuals purchase credits voluntarily to reach net-zero goals, accelerate ESG commitments, or balance hard-to-abate emissions.",
  },
];

const keyPlayers = [
  "Governments and regulators overseeing caps and verification standards",
  "Enterprises buying and selling credits to align with climate strategies",
  "Exchanges and brokers facilitating transparent, liquid transactions",
  "Project developers funding measurable, permanent carbon reductions",
];

const AboutUs = () => {
  return (
    <div className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent dark:from-emerald-500/20" />
      <div className="absolute left-[10%] top-24 h-56 w-56 rounded-full bg-emerald-500/15 blur-3xl dark:bg-emerald-400/10" />
      <div className="absolute right-[5%] top-64 h-72 w-72 rounded-full bg-lime-400/10 blur-3xl dark:bg-lime-300/10" />

      <main className="relative mx-auto flex max-w-6xl flex-col gap-14 px-6 py-16 lg:px-0">
        <section className="overflow-hidden rounded-3xl border border-border/60 bg-card/85 p-10 shadow-2xl backdrop-blur-sm">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-sm font-medium text-primary dark:text-primary-foreground">
                About CarbonEase Marketplace
              </span>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Building the most trusted climate asset exchange
              </h1>
              <p className="mt-5 text-lg text-muted-foreground">
                CarbonEase simplifies how teams discover, verify, and trade
                carbon credits. We connect responsible buyers with high-impact
                projects so every tonne retired moves the planet closer to net
                zero.
              </p>
            </div>
            <Card className="border-none bg-gradient-to-br from-brandMainColor/20 via-background to-background shadow-2xl dark:from-brandSubColor/25">
              <CardContent className="space-y-4 p-8">
                <CardTitle className="text-xl font-semibold text-foreground">
                  Our north star
                </CardTitle>
                <CardDescription className="text-base leading-relaxed text-muted-foreground">
                  Deliver the most transparent, data-rich marketplace for carbon
                  assets—so sustainability leaders can act decisively and
                  investors can fund tangible climate impact.
                </CardDescription>
                <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4 text-sm text-primary dark:text-primary-foreground/80">
                  1 tonne of verified carbon removal, matched with the right
                  buyer, unlocks lasting environmental and economic value.
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {highlights.map(({ title, description }) => (
            <Card
              key={title}
              className="border border-border/70 bg-card/90 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
            >
              <CardContent className="space-y-3 p-6">
                <CardTitle className="text-lg font-semibold text-foreground">
                  {title}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-10 lg:grid-cols-[1.3fr,0.9fr]">
          <Card className="border border-border/70 bg-card/90 shadow-xl">
            <CardHeader className="pb-6">
              <CardTitle className="text-3xl font-semibold text-foreground">
                How we operate
              </CardTitle>
              <CardDescription className="text-base leading-relaxed text-muted-foreground">
                We streamline end-to-end carbon credit lifecycle management—from
                project onboarding to purchase, retirement, and reporting.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-muted-foreground">
                Our marketplace enables verified projects to showcase impact
                with evidence-backed data, while buyers access due diligence
                reports, registry attestations, and live production metrics
                before committing funds.
              </p>
              <p className="text-muted-foreground">
                Smart routing and automated documentation turn multi-week
                procurement cycles into same-day decisions. Post-purchase,
                CarbonEase issues audit-ready retirement certificates that feed
                directly into ESG disclosures.
              </p>
              <div className="rounded-2xl border border-primary/30 bg-primary/10 p-5 text-sm text-primary dark:text-primary-foreground/80">
                Trusted by sustainability, finance, and procurement teams
                collaborating on credible decarbonization roadmaps.
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/70 bg-background/80 shadow-xl">
            <CardContent className="space-y-5 p-8">
              <CardTitle className="text-2xl font-semibold text-foreground">
                Marketplace coverage
              </CardTitle>
              <div className="space-y-4">
                {marketTypes.map(({ name, details }) => (
                  <div
                    key={name}
                    className="rounded-2xl border border-border/60 bg-card/80 p-4"
                  >
                    <p className="text-sm font-semibold text-foreground">
                      {name}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {details}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                CarbonEase equips both segments with tailored analytics, risk
                scoring, and flexible settlement options.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="rounded-3xl border border-border/70 bg-card/85 p-10 shadow-xl">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-semibold text-foreground">
                Carbon credit trading—from first principles
              </h2>
              <p className="mt-4 text-muted-foreground">
                Carbon credits represent one metric tonne of CO₂ (or equivalent
                greenhouse gas) avoided or removed. Trading ensures capital
                flows to the projects delivering measurable climate outcomes.
              </p>
              <div className="mt-6 rounded-2xl border border-primary/25 bg-primary/10 p-5 text-sm text-primary dark:text-primary-foreground/80">
                Every credit listed on CarbonEase is backed by registry
                documentation, third-party validation, and continuous
                monitoring.
              </div>
            </div>
            <div className="space-y-6 rounded-2xl border border-border/60 bg-background/80 p-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  How trading works
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Caps on emissions or voluntary climate goals create demand.
                  Projects that avoid or sequester emissions generate credits,
                  which buyers purchase and retire to claim the environmental
                  benefit.
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Cap-and-trade flow
                </p>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  <li>• Regulators establish the emissions ceiling.</li>
                  <li>
                    • Organizations staying below limits sell surplus credits.
                  </li>
                  <li>
                    • Emitters exceeding limits buy credits to stay compliant.
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Voluntary market flow
                </p>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  <li>
                    • Companies pursue net-zero or ESG pledges beyond
                    regulation.
                  </li>
                  <li>
                    • Credits fund renewable energy, reforestation, and carbon
                    removal projects.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Card className="border border-border/60 bg-background/70 shadow-inner">
              <CardContent className="space-y-4 p-6">
                <CardTitle className="text-xl font-semibold text-foreground">
                  The ecosystem we serve
                </CardTitle>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {keyPlayers.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-primary/30 bg-primary/10 shadow-lg dark:border-brandSubColor/30 dark:bg-brandSubColor/10">
              <CardContent className="space-y-4 p-6 text-primary dark:text-primary-foreground">
                <CardTitle className="text-xl font-semibold">
                  What makes us different
                </CardTitle>
                <p className="text-sm">
                  CarbonEase combines marketplace liquidity with deep due
                  diligence tooling. Real-time registry sync, automated MRV
                  workflows, and offset forecasting help teams move from pledges
                  to proof.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Card className="rounded-3xl border border-border/70 bg-card/90 shadow-xl">
          <CardContent className="flex flex-col gap-6 p-10 text-center md:items-center">
            <div className="mx-auto max-w-2xl space-y-4">
              <CardTitle className="text-3xl font-semibold text-foreground">
                Ready to accelerate your climate roadmap?
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Join sustainability teams across finance, manufacturing, and
                technology who rely on CarbonEase for credible offsets, detailed
                reporting, and collaborative execution.
              </CardDescription>
            </div>
            <CardFooter className="flex flex-col items-center gap-4 md:flex-row">
              <Button className="h-12 rounded-full bg-brandMainColor px-8 text-base font-semibold text-white transition-colors hover:bg-brandMainColor/90 dark:bg-brandSubColor dark:text-slate-950 dark:hover:bg-brandSubColor/90">
                Explore the marketplace
              </Button>
              <Button
                variant="outline"
                className="h-12 rounded-full border-brandMainColor/40 px-8 text-base font-semibold text-brandMainColor hover:bg-brandMainColor/10 dark:border-brandSubColor/40 dark:text-brandSubColor dark:hover:bg-brandSubColor/10"
              >
                Talk to our team
              </Button>
            </CardFooter>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AboutUs;
