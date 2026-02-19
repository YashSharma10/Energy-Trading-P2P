import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What types of credits can I trade on this platform?",
    answer:
      "We accept Verra (VCS), Gold Standard, and ACR certified credits from renewable energy projects (solar, wind, hydro), methane avoidance, and energy efficiency. All credits are independently verified before listing.",
  },
  {
    question: "How does pricing work? Is there a fixed rate?",
    answer:
      "Pricing is peer-to-peer. Sellers set their own prices based on market demand. You can see live price history for each project type and make competitive offers as a buyer. No hidden commissions.",
  },
  {
    question: "How long does a trade take from listing to payment?",
    answer:
      "Most trades settle within 24-48 hours. You list credits, buyers make offers or take your asking price, and payment is processed through your chosen method (bank transfer, UPI, card, or crypto). Blockchain certificates are issued immediately.",
  },
  {
    question: "What if there's a dispute over a trade?",
    answer:
      "Every transaction is recorded on the blockchain with full documentation. Since both parties agree to terms before purchase, disputes are rare. We have an arbitration process for edge cases, and all transactions are reversible within 14 days if there's an issue.",
  },
  {
    question: "Can I sell credits from my own renewable energy project?",
    answer:
      "Yes. If you have a certified renewable project generating credits, you can register it and list credits directly. You'll need current certification from Verra, Gold Standard, or ACR. Most projects are up and running within 2 weeks.",
  },
  {
    question: "What payment methods are supported?",
    answer:
      "Bank transfer (NEFT/RTGS), UPI, credit/debit cards, and cryptocurrency (Bitcoin, Ethereum). Payouts happen same-day for UPI and crypto, 1-2 days for bank transfers. No minimum withdrawal amount.",
  },
  {
    question: "Is my data secure? How do you handle compliance?",
    answer:
      "All transactions are recorded on blockchain for transparency. KYC verification is required for trading. We comply with local regulations and your transaction history is available for audit. Certificates are issued for each purchase for your compliance records.",
  },
];

export default function AccordionSection() {
  return (
    <div className="width mx-auto mb-8 rounded-lg border border-border bg-card/95 p-6 shadow-lg backdrop-blur-sm">
      <h2 className="mb-6 text-center text-3xl font-semibold text-foreground dark:text-white">
        Questions? We've got answers
      </h2>
      <Accordion type="single" collapsible>
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="border-b border-border/70"
          >
            <AccordionTrigger className="text-left text-lg font-medium text-foreground transition-colors hover:text-brandMainColor">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground dark:text-white/80">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
