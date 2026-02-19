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
    <div className="bg-background">
      <div className="border-b border-border bg-muted/40 dark:bg-muted/20">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center gap-2">
          <FaEnvelope className="h-5 w-5 text-primary shrink-0" size={18} />
          <div>
            <h1 className="text-lg font-semibold text-foreground leading-tight">
              Contact Us
            </h1>
            <p className="text-xs text-muted-foreground">
              Reach out to collaborate or learn how CarbonEase can accelerate
              your climate goals
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-8">
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
