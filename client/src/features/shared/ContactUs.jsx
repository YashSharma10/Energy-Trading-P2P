import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import { motion } from "framer-motion";

const teamMembers = [
  { name: "Yash Sharma", role: "Full-Stack Developer", linkedin: "#" },
  { name: "Mukul Yadav", role: "Frontend Developer", linkedin: "#" },
  { name: "Nilesh Sharma", role: "Backend Developer", linkedin: "#" },
  { name: "Mohit Ghanghas", role: "UI/UX Designer", linkedin: "#" },
];

const contactMethods = [
  {
    title: "Email",
    subtitle: "We reply within 1 business day",
    value: "hello@carbonease.com",
    icon: FaEnvelope,
    href: "mailto:hello@carbonease.com",
  },
  {
    title: "Call",
    subtitle: "Mon - Fri, 9 AM to 6 PM IST",
    value: "+91 12345 67890",
    icon: FaPhone,
    href: "tel:+911234567890",
  },
  {
    title: "LinkedIn",
    subtitle: "Follow our climate journey",
    value: "@CarbonEase",
    icon: FaLinkedin,
    href: "https://www.linkedin.com/",
  },
];

const ContactUs = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent dark:from-emerald-500/20 dark:via-transparent" />
      <div className="absolute left-1/2 top-24 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl dark:bg-emerald-400/10" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 lg:px-0">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-border/60 bg-card/80 p-10 shadow-xl backdrop-blur-sm"
        >
          <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-sm font-medium text-primary dark:text-primary-foreground/80">
                We would love to hear from you
              </span>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Let&apos;s craft the next climate-positive milestone, together
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Reach out to collaborate, explore partnership opportunities, or
                simply learn how CarbonEase can accelerate your carbon reduction
                initiatives.
              </p>
            </div>
            <div className="grid w-full gap-4 sm:grid-cols-2 lg:max-w-sm">
              <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-primary/10 via-background to-secondary/40 p-5 text-sm text-muted-foreground shadow-lg">
                <div className="flex items-center gap-3 text-foreground">
                  <FaMapMarkerAlt className="text-primary" size={20} />
                  <span className="font-semibold">Gurugram, India</span>
                </div>
                <p className="mt-3 leading-relaxed">
                  Operating globally with a focus on emerging markets and
                  climate-tech innovation hubs.
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-secondary/40 via-background to-primary/10 p-5 text-sm text-muted-foreground shadow-lg">
                <div className="flex items-center gap-3 text-foreground">
                  <FaClock className="text-primary" size={20} />
                  <span className="font-semibold">Response time</span>
                </div>
                <p className="mt-3 leading-relaxed">
                  We aim to respond to all messages within 24 hours on weekdays
                  and 48 hours over the weekend.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {contactMethods.map(
              ({ title, subtitle, value, icon: Icon, href }) => (
                <a
                  key={title}
                  href={href}
                  className="group rounded-2xl border border-border/70 bg-background/70 p-6 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon size={22} />
                    </div>
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {subtitle}
                    </span>
                  </div>
                  <div className="mt-5">
                    <p className="text-sm font-medium text-muted-foreground">
                      {title}
                    </p>
                    <p className="mt-1 text-lg font-semibold text-foreground">
                      {value}
                    </p>
                  </div>
                </a>
              )
            )}
          </div>
        </motion.section>

        <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-3xl border border-border/70 bg-card/80 shadow-xl backdrop-blur-sm"
          >
            <Card className="h-full border-none bg-transparent shadow-none">
              <CardContent className="space-y-8 p-10">
                <div>
                  <h2 className="text-3xl font-semibold text-foreground">
                    Send us a message
                  </h2>
                  <p className="mt-3 text-muted-foreground">
                    Share your goals, questions, or project details and
                    we&apos;ll tailor our response to help you move faster.
                  </p>
                </div>
                <form className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Input
                      type="text"
                      placeholder="Full name"
                      className="h-12 rounded-xl border-border/70 bg-background/80 text-base focus-visible:ring-2 focus-visible:ring-primary"
                    />
                    <Input
                      type="email"
                      placeholder="Work email"
                      className="h-12 rounded-xl border-border/70 bg-background/80 text-base focus-visible:ring-2 focus-visible:ring-primary"
                    />
                  </div>
                  <Input
                    type="text"
                    placeholder="Organization"
                    className="h-12 rounded-xl border-border/70 bg-background/80 text-base focus-visible:ring-2 focus-visible:ring-primary"
                  />
                  <Textarea
                    placeholder="Tell us about your project, targets, or questions"
                    rows={5}
                    className="rounded-2xl border-border/70 bg-background/80 text-base focus-visible:ring-2 focus-visible:ring-primary"
                  />
                  <Button className="h-12 w-full rounded-xl bg-gradient-to-r from-emerald-500 via-lime-500 to-emerald-600 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl">
                    Send message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-6"
          >
            <div className="rounded-3xl border border-border/70 bg-secondary/60 p-10 text-muted-foreground shadow-xl backdrop-blur-sm">
              <h2 className="text-3xl font-semibold text-foreground">
                Meet the team
              </h2>
              <p className="mt-3 leading-relaxed">
                CarbonEase brings together engineers, analysts, and designers
                focused on building transparent carbon markets. Connect directly
                with the people powering your climate initiatives.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {teamMembers.map(({ name, role, linkedin }) => (
                <Card
                  key={name}
                  className="group h-full rounded-2xl border border-border/70 bg-card/80 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
                >
                  <CardContent className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <span className="text-lg font-semibold">
                        {name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-foreground">
                        {name}
                      </p>
                      <p className="text-sm text-muted-foreground">{role}</p>
                    </div>
                    <a
                      href={linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors group-hover:text-primary/80"
                    >
                      <FaLinkedin size={18} /> Connect
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
