import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  Leaf,
  ShieldCheck,
  Users,
  BarChart3,
  Globe2,
  ArrowRight,
  Building2,
  SunMedium,
} from "lucide-react";

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Integrity first",
    body: "Every credit on CarbonEase is verified by a third-party registry before it's listed. We don't allow unverified or expired credits — ever.",
  },
  {
    icon: Users,
    title: "Direct access",
    body: "We cut out brokers entirely. Producers set their own prices. Buyers see the full picture. No hidden margins, no opaque intermediaries.",
  },
  {
    icon: Globe2,
    title: "India-rooted, globally aligned",
    body: "Built around India's CCTS framework and aligned with the UN Paris Agreement, Verra, Gold Standard, and ACR standards.",
  },
  {
    icon: BarChart3,
    title: "Transparent by design",
    body: "Live pricing, audit-ready retirement certificates, and ESG reports that meet SASB and TCFD requirements — all in one place.",
  },
];

const AboutUs = () => {
  return (
    <div className="bg-background pt-20 text-foreground">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border px-6 py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-x-0 -top-32 -z-10 overflow-hidden blur-3xl">
          <div className="relative left-1/2 aspect-[1155/678] w-[60rem] -translate-x-1/2 rotate-[20deg] bg-gradient-to-tr from-brandMainColor to-emerald-400 opacity-10" />
        </div>
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brandMainColor/30 bg-brandMainColor/8 px-4 py-1.5">
              <Leaf className="h-3.5 w-3.5 text-brandMainColor" />
              <span className="text-xs font-semibold uppercase tracking-widest text-brandMainColor">
                About CarbonEase
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl leading-tight">
              We built the carbon market <br />
              <span className="text-brandMainColor">India actually needed.</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground max-w-2xl">
              CarbonEase is a direct marketplace for verified carbon credits — connecting renewable energy producers with buyers across India and beyond, with no brokers, no markups, and no greenwashing.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="border-b border-border px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-brandMainColor mb-4">Our Mission</p>
            <h2 className="text-2xl font-bold sm:text-3xl mb-5">
              Make carbon offsetting honest, accessible, and effective.
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                India has pledged net-zero by 2070. The Paris Agreement demands action now. But for years, the carbon credit market was dominated by brokers, opaque pricing, and credits that couldn't be traced back to real climate outcomes.
              </p>
              <p>
                We built CarbonEase to change that. Our platform gives renewable energy producers — solar farms, wind projects, biomass plants — a direct channel to sell their verified credits at fair prices. And it gives buyers a marketplace they can actually trust, with every credit backed by a recognised registry and every transaction producing an audit-ready certificate.
              </p>
              <p>
                No middlemen. No inflated margins. Just verified climate action.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="border-b border-border bg-muted/20 px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-brandMainColor mb-4">How it works</p>
            <h2 className="text-2xl font-bold sm:text-3xl mb-3">Two sides, one shared goal</h2>
            <p className="text-muted-foreground leading-relaxed mb-10">
              Carbon credits are a simple but powerful idea. When someone reduces carbon emissions — say, by running a solar plant instead of burning coal — that reduction can be measured, verified, and sold as a credit. Someone else who can't yet eliminate their own emissions buys that credit to offset them. The net result: less carbon in the atmosphere, and financial support flowing to the people doing the hard work of building clean energy.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Buyer card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Building2 className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">The Buyer</p>
                  <p className="font-semibold text-foreground">e.g. A large corporation or MNC</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A company that emits carbon as part of its operations — manufacturing, logistics, data centres — can't always eliminate those emissions overnight. By purchasing verified carbon credits on CarbonEase, they offset what they emit and move toward a net-zero carbon footprint. Every credit retired is a tonne of CO₂ neutralised, backed by a certificate they can show auditors, investors, and regulators.
              </p>
              <div className="mt-auto rounded-xl bg-blue-500/5 border border-blue-500/15 px-4 py-3">
                <p className="text-xs text-blue-500 font-medium">What they get</p>
                <p className="text-xs text-muted-foreground mt-1">A verified path to net-zero, audit-ready retirement certificates, and ESG reporting — without waiting years to decarbonise every part of their business.</p>
              </div>
            </motion.div>

            {/* Seller card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-brandMainColor/10 flex items-center justify-center shrink-0">
                  <SunMedium className="h-5 w-5 text-brandMainColor" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">The Seller</p>
                  <p className="font-semibold text-foreground">e.g. A solar plant owner</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                An individual or business running a renewable energy project — a rooftop solar installation, a wind farm, a biomass plant — generates clean energy that displaces fossil fuels. That displacement is measured, certified by a recognised registry, and listed as carbon credits on CarbonEase. When a buyer purchases them, the seller receives direct payment — no broker taking a cut — giving them the financial support to maintain and grow their clean energy work.
              </p>
              <div className="mt-auto rounded-xl bg-brandMainColor/5 border border-brandMainColor/15 px-4 py-3">
                <p className="text-xs text-brandMainColor font-medium">What they get</p>
                <p className="text-xs text-muted-foreground mt-1">Fair, direct payment for the clean energy they produce — and the financial stability to keep their project running and expanding.</p>
              </div>
            </motion.div>
          </div>

          {/* Flow diagram */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-8 rounded-2xl border border-brandMainColor/20 bg-brandMainColor/5 px-6 py-5"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-brandMainColor mb-4">The exchange</p>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-center">
              <div className="flex flex-col items-center gap-1">
                <Building2 className="h-6 w-6 text-blue-500" />
                <span className="font-medium text-foreground">Buyer (MNC)</span>
                <span className="text-xs text-muted-foreground">Has carbon emissions</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-muted-foreground text-xs">
                <span className="text-brandMainColor font-medium">Pays for credits →</span>
                <span className="text-muted-foreground/50">via CarbonEase</span>
                <span className="text-brandMainColor font-medium">← Receives certificate</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <SunMedium className="h-6 w-6 text-brandMainColor" />
                <span className="font-medium text-foreground">Seller (Solar owner)</span>
                <span className="text-xs text-muted-foreground">Reduces carbon emissions</span>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              The buyer's emissions are neutralised. The seller gets funded. The planet benefits.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="border-b border-border px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-brandMainColor mb-4">What we stand for</p>
            <h2 className="text-2xl font-bold sm:text-3xl mb-10">Our values</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {VALUES.map(({ icon: Icon, title, body }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="flex gap-4"
              >
                <div className="mt-0.5 h-9 w-9 shrink-0 rounded-xl bg-brandMainColor/10 flex items-center justify-center">
                  <Icon className="h-[18px] w-[18px] text-brandMainColor" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Compliance & Standards ── */}
      <section className="border-b border-border bg-muted/20 px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-brandMainColor mb-4">Standards & Compliance</p>
            <h2 className="text-2xl font-bold sm:text-3xl mb-5">Aligned with the frameworks that matter</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              CarbonEase is built around the regulatory and voluntary frameworks that govern credible carbon markets — both in India and globally.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {[
              { name: "India CCTS 2023", desc: "India's Carbon Credit Trading Scheme — the regulatory backbone of our domestic market." },
              { name: "UN Paris Agreement", desc: "Article 6 mechanisms for internationally transferred mitigation outcomes." },
              { name: "Verra (VCS)", desc: "Verified Carbon Standard — the world's most widely used voluntary carbon standard." },
              { name: "Gold Standard", desc: "Rigorous certification for projects with strong sustainable development co-benefits." },
              { name: "ACR", desc: "American Carbon Registry — recognised for high-quality offset project verification." },
              { name: "SASB & TCFD", desc: "ESG reporting formats accepted by major audit bodies and institutional investors." },
            ].map((item) => (
              <div key={item.name} className="rounded-xl border border-border bg-card p-4">
                <p className="text-sm font-semibold text-foreground">{item.name}</p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-brandMainColor mb-4">Get in touch</p>
            <h2 className="text-2xl font-bold sm:text-3xl mb-3">Want to know more?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl">
              Whether you're a renewable energy producer looking to list your credits, a company working toward net-zero, or a researcher interested in India's carbon market — we'd love to hear from you.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-full bg-brandMainColor px-6 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_-10px_rgba(92,179,56,0.6)] hover:-translate-y-0.5 hover:bg-brandMainColor/90 transition-all"
              >
                Create an account <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-2.5 text-sm font-semibold hover:border-brandMainColor/50 hover:text-brandMainColor transition-all"
              >
                Browse the marketplace
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;
