import { Globe } from "@/components/animations/globe";
import { GridPattern } from "@/components/animations/grid-pattern";
import { PulsatingButton } from "@/components/animations/pulsating-button";
import { cn } from "@/lib/utils";
import { ArrowRight, DollarSign, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

function GlobeSection() {
  return (
    <section className="relative flex min-h-[90vh] justify-center items-center overflow-hidden bg-background px-6 md:px-40 md:pb-40">
      {/* Animated background grid - behind everything */}
      <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#5CB33830_1px,transparent_1px),linear-gradient(to_bottom,#5CB33830_1px,transparent_1px)] bg-[size:50px_50px] dark:bg-[linear-gradient(to_right,#9BEA6C30_1px,transparent_1px),linear-gradient(to_bottom,#9BEA6C30_1px,transparent_1px)]"></div>
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-emerald-50/30 via-transparent to-lime-50/30 dark:from-emerald-900/10 dark:via-transparent dark:to-lime-900/10"></div>
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse dark:bg-emerald-500/10"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-lime-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000 dark:bg-lime-500/10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-300/15 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000 dark:bg-teal-500/10"></div>
      </div>
      
      {/* Title and description */}
      <div className="text-center max-w-3xl z-20 px-4 absolute top-8">
        <h1 className="mt-8 bg-gradient-to-b from-[#1f4d24] to-[#5CB338] bg-clip-text text-3xl font-semibold text-transparent leading-tight sm:text-5xl sm:leading-tight dark:from-[#9BEA6C] dark:to-[#5CB338]">
          Trade Carbon Credits & Renewable Energy Transparently with
          <span className="text-brandMainColor"> CarbonEase!</span>
        </h1>
      </div>

      {/* Globe animation */}
      <Globe className="z-10 w-full h-full object-cover mt-20 opacity-90" />
      {/* Buttons */}
      <div className="absolute bottom-12 flex gap-8 justify-center w-full px-6 sm:px-0 z-20">
        <Link to="/marketplace">
          {/* Link to Marketplace */}
          <PulsatingButton className="bg-card text-brandMainColor shadow-2xl transition-colors duration-200 hover:bg-brandMainColor/10">
            <span className="flex items-center gap-2 whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight lg:text-lg">
              <ShoppingCart className="w-5 h-5 text-brandMainColor" /> Buy
              Carbon Credits
              <ArrowRight className="w-5 h-5 text-brandMainColor" />{" "}
            </span>
          </PulsatingButton>
        </Link>
        <Link to="/dashboard">
          {/* Link to Seller Dashboard */}
          <PulsatingButton className="bg-card text-brandMainColor shadow-2xl border-2 border-brandMainColor transition-colors duration-200 hover:bg-brandMainColor/10">
            <span className="flex items-center gap-2 whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight lg:text-lg">
              <DollarSign className="w-5 h-5 text-brandMainColor" /> Sell your
              Credits
              <ArrowRight className="w-5 h-5 text-brandMainColor" />{" "}
            </span>
          </PulsatingButton>
        </Link>
      </div>
      <GridPattern
        squares={[
          [4, 4],
          [5, 1],
          [8, 2],
          [5, 3],
          [5, 5],
          [10, 10],
          [12, 15],
          [15, 10],
          [10, 15],
          [18, 12],
          [13, 8],
          [16, 14],
        ]}
        className={cn(
          "[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12 -z-10"
        )}
      />
    </section>
  );
}

export default GlobeSection;
