import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export default function GeminiChatbot() {
  const apiKey = useMemo(() => import.meta.env.VITE_GEMINI_API_KEY?.trim(), []);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi there! I'm the CarbonEase assistant. Ask me anything about carbon credits, our platform, or available listings.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [platformContext, setPlatformContext] = useState(null);
  const [contextLoading, setContextLoading] = useState(false);

  // Fetch platform context when chatbot opens
  useEffect(() => {
    if (isOpen && !platformContext && !contextLoading) {
      setContextLoading(true);
      fetch("http://localhost:3000/api/chatbot/context")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setPlatformContext(data.context);
          }
        })
        .catch((err) => console.error("Failed to fetch context:", err))
        .finally(() => setContextLoading(false));
    }
  }, [isOpen, platformContext, contextLoading]);

  const handleToggle = () => {
    setIsOpen((previous) => !previous);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) {
      return;
    }

    if (!apiKey) {
      setError(
        "Gemini API key is missing. Add VITE_GEMINI_API_KEY to your environment."
      );
      return;
    }

    const newMessages = [...messages, { role: "user", text: trimmed }];

    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      // Create system prompt with context restriction
      const contextData = platformContext ? `
PLATFORM DATA (Use this real-time data in your responses):
- Total Listings: ${platformContext.statistics.totalListings}
- Available Listings: ${platformContext.statistics.availableListings}
- Total Users: ${platformContext.statistics.totalUsers}
- Total Transactions: ${platformContext.statistics.totalTransactions}
- Total Credits Available: ${platformContext.statistics.totalCreditsAvailable} tons
- Price Range: ₹${platformContext.statistics.priceRange.minPrice} - ₹${platformContext.statistics.priceRange.maxPrice} (Avg: ₹${Math.round(platformContext.statistics.priceRange.avgPrice)})

PROJECT TYPES AVAILABLE:
${platformContext.projectTypes.map(pt => `- ${pt.type}: ${pt.count} projects`).join('\n')}

CERTIFICATION STANDARDS:
${platformContext.certifications.map(c => `- ${c.standard}: ${c.count} credits`).join('\n')}

SAMPLE AVAILABLE LISTINGS:
${platformContext.sampleListings.map((l, i) => `${i + 1}. ${l.title}
   - Type: ${l.type}
   - Quantity: ${l.quantity} tons
   - Price: ₹${l.price}/credit
   - Location: ${l.location}
   - Certification: ${l.certification}`).join('\n\n')}
` : "Platform data is loading...";

      const systemPrompt = `You are CarbonEase Assistant, a specialized AI helper for the CarbonEase carbon credit trading platform.

STRICT RULES:
1. ONLY answer questions about:
   - Carbon credits and carbon markets
   - Climate change and emissions
   - The CarbonEase platform and its features
   - Available listings and transactions on our platform
   - How to buy/sell carbon credits
   - Renewable energy and sustainability
   
2. If asked about ANYTHING else (sports, entertainment, general knowledge, math problems, cooking, coding, etc.), respond EXACTLY with:
   "I can only help with questions about carbon credits, climate action, and the CarbonEase platform. Please ask me something related to carbon trading or sustainability."

3. Use the following real-time platform data when relevant:
${contextData}

4. Be helpful, concise, and professional.
5. When discussing listings, use ACTUAL DATA from the platform context above.
6. Format prices in Indian Rupees (₹).
7. Mention specific project names, types, and certifications from the available listings.

User question: ${trimmed}`;

      const response = await fetch(GEMINI_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: systemPrompt,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini request failed with ${response.status}`);
      }

      const data = await response.json();
      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        "I didn't understand that, but I'm here to help!";

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text: reply,
        },
      ]);
    } catch (fetchError) {
      console.error("Gemini request error", fetchError);
      setError(
        "Something went wrong while contacting Gemini. Please try again."
      );
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text: "I ran into an issue reaching Gemini. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="mb-3 w-[450px] rounded-xl border border-border/70 bg-card/95 shadow-lg backdrop-blur">
          <div className="flex items-center justify-between rounded-t-xl border-b border-border/60 bg-primary/10 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-foreground">
                CarbonEase Assistant
              </p>
              <p className="text-xs text-muted-foreground">
                Powered by Google Gemini
              </p>
            </div>
            <Button size="icon" variant="ghost" onClick={handleToggle}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close chat</span>
            </Button>
          </div>

          <div className="h-96 space-y-3 overflow-y-auto px-4 py-3">
            {contextLoading && (
              <div className="flex justify-center py-2">
                <p className="text-xs text-muted-foreground">Loading platform data...</p>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm shadow-sm ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {error && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </p>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-border/60 px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <Input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask something..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
            <p className="mt-2 text-[10px] leading-4 text-muted-foreground">
              Responses are generated by Gemini and may be inaccurate. Please
              verify key details.
            </p>
          </form>
        </div>
      ) : null}

      <Button
        size="lg"
        className="h-12 w-12 rounded-full shadow-lg"
        onClick={handleToggle}
      >
        <MessageCircle className="h-5 w-5" />
        <span className="sr-only">Open Gemini chat</span>
      </Button>
    </div>
  );
}
