import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
} from "lucide-react";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  quickReplies?: string[];
}

interface FAQ {
  question: string;
  answer: string;
  category: "freelancer" | "client" | "general" | "payments";
  quickReplies?: string[];
}

const faqs: FAQ[] = [
  // Freelancer FAQs
  {
    question: "How do I create my first gig?",
    answer:
      "To create your first gig: 1) Go to 'Create Gig' from your dashboard, 2) Add a compelling title and description, 3) Set your pricing packages, 4) Upload portfolio images, 5) Publish your gig. Make sure to include relevant keywords to help clients find you!",
    category: "freelancer",
    quickReplies: [
      "Gig pricing tips",
      "How to get more orders",
      "Portfolio guidelines",
    ],
  },
  {
    question: "How do I get more orders on FreelanceHub?",
    answer:
      "To increase your orders: 1) Complete your profile 100%, 2) Add a professional photo, 3) Create multiple gigs in your expertise area, 4) Use relevant keywords, 5) Respond quickly to messages, 6) Deliver high-quality work on time, 7) Ask satisfied clients for reviews.",
    category: "freelancer",
    quickReplies: [
      "Profile optimization",
      "Pricing strategy",
      "Client communication",
    ],
  },
  {
    question: "What are the best pricing strategies?",
    answer:
      "Effective pricing strategies: 1) Research competitor prices, 2) Start with competitive rates as a new seller, 3) Create 3 packages (Basic, Standard, Premium), 4) Price Basic competitively, Premium with higher margins, 5) Include clear deliverables for each package, 6) Increase prices as you gain reviews and experience.",
    category: "freelancer",
    quickReplies: [
      "How to create packages",
      "When to increase prices",
      "Competitor analysis",
    ],
  },

  // Client FAQs
  {
    question: "How do I find the right freelancer?",
    answer:
      "To find the perfect freelancer: 1) Use specific keywords in search, 2) Check their portfolio and reviews, 3) Look at their response time and completion rate, 4) Message them before ordering to discuss your project, 5) Start with a small test project if it's a large job.",
    category: "client",
    quickReplies: [
      "Vetting freelancers",
      "Project communication",
      "Budget planning",
    ],
  },
  {
    question: "How does payment protection work?",
    answer:
      "FreelanceHub's payment protection: 1) Your payment is held securely until work is completed, 2) Release payment only when satisfied, 3) Request revisions if needed, 4) If unsatisfied, our resolution center helps mediate, 5) Money-back guarantee for eligible cases. Payments are processed in INR via UPI, Net Banking, or Cards.",
    category: "client",
    quickReplies: ["Refund policy", "Payment methods", "Dispute resolution"],
  },
  {
    question: "What if I'm not satisfied with the work?",
    answer:
      "If unsatisfied with delivered work: 1) Request revisions from the freelancer first, 2) Most freelancers offer unlimited revisions, 3) Communicate specific feedback clearly, 4) If still unsatisfied, contact our support team, 5) We'll help mediate and find a solution, 6) Eligible for refund in extreme cases.",
    category: "client",
    quickReplies: [
      "How to request revisions",
      "Quality standards",
      "Support contact",
    ],
  },

  // General FAQs
  {
    question: "How do I contact customer support?",
    answer:
      "Contact our 24/7 support team: 1) Live chat (click the chat icon), 2) Email: support@freelancehub.in, 3) Phone: +91-80-4567-8900, 4) Help Center with detailed guides, 5) WhatsApp support: +91-90-0000-1234. We provide support in Hindi and English.",
    category: "general",
    quickReplies: ["Live chat", "Email support", "Help center"],
  },
  {
    question: "Is FreelanceHub safe and secure?",
    answer:
      "Yes, FreelanceHub is completely safe: 1) All freelancers are verified, 2) Secure payment escrow system, 3) SSL encryption for all transactions, 4) Profile verification process, 5) 24/7 fraud monitoring, 6) Money-back guarantee, 7) Trusted by 5+ lakh users across India.",
    category: "general",
    quickReplies: [
      "Verification process",
      "Security features",
      "Trust & safety",
    ],
  },

  // Payment FAQs
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept all major Indian payment methods: 1) UPI (PhonePe, Paytm, GPay), 2) Net Banking (all major banks), 3) Credit/Debit Cards (Visa, Mastercard, RuPay), 4) Digital wallets, 5) Bank transfers. All payments are in Indian Rupees (₹) with no hidden fees.",
    category: "payments",
    quickReplies: ["UPI payments", "Transaction fees", "Payment security"],
  },
  {
    question: "How long does it take to receive payments?",
    answer:
      "Payment timeline for freelancers: 1) Instant release when client approves work, 2) Auto-release after 3 days if no response, 3) UPI transfers are instant, 4) Bank transfers take 1-2 business days, 5) Payments processed 24/7, 6) Track all payments in your dashboard.",
    category: "payments",
    quickReplies: ["Payment tracking", "Withdrawal methods", "Payment history"],
  },
];

const quickStartQuestions = [
  "How do I get started?",
  "How to create a gig?",
  "How to find freelancers?",
  "Payment methods",
  "Customer support",
  "Safety & security",
];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      content:
        "👋 Hi! I'm your FreelanceHub assistant. I'm here to help you with any questions about our platform. What would you like to know?",
      timestamp: new Date(),
      quickReplies: quickStartQuestions,
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const findBestAnswer = (userInput: string): FAQ | null => {
    const input = userInput.toLowerCase();

    // Direct keyword matching
    const keywordMatches = faqs.filter((faq) => {
      const question = faq.question.toLowerCase();
      const answer = faq.answer.toLowerCase();

      // Check for key phrases
      const keywords = input.split(" ").filter((word) => word.length > 2);
      const matches = keywords.some(
        (keyword) => question.includes(keyword) || answer.includes(keyword),
      );

      return matches;
    });

    if (keywordMatches.length > 0) {
      return keywordMatches[0];
    }

    // Fallback for common patterns
    if (
      input.includes("gig") ||
      input.includes("create") ||
      input.includes("service")
    ) {
      return faqs.find((faq) => faq.question.includes("create my first gig"));
    }

    if (
      input.includes("order") ||
      input.includes("client") ||
      input.includes("customer")
    ) {
      return faqs.find((faq) => faq.question.includes("get more orders"));
    }

    if (
      input.includes("payment") ||
      input.includes("money") ||
      input.includes("pay")
    ) {
      return faqs.find((faq) => faq.question.includes("payment methods"));
    }

    if (
      input.includes("support") ||
      input.includes("help") ||
      input.includes("contact")
    ) {
      return faqs.find((faq) => faq.question.includes("customer support"));
    }

    return null;
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(
      () => {
        const answer = findBestAnswer(content);

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: answer
            ? answer.answer
            : "I'm sorry, I couldn't find a specific answer to your question. Please contact our support team at support@freelancehub.in or use the live chat for personalized help. Is there anything else I can help you with?",
          timestamp: new Date(),
          quickReplies: answer?.quickReplies || [
            "Contact support",
            "Browse FAQ",
            "Start over",
          ],
        };

        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
      },
      1000 + Math.random() * 1000,
    );
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputMessage);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
        <div className="absolute -top-2 -right-1">
          <Badge className="bg-green-500 text-white">
            <Zap className="w-3 h-3" />
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card
        className={`w-96 shadow-2xl border-0 bg-card/95 backdrop-blur-sm transition-all duration-300 ${isMinimized ? "h-16" : "h-[600px]"}`}
      >
        <CardHeader className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">
                  SkillBot
                </CardTitle>
                <p className="text-xs opacity-90">Always here to help</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="w-8 h-8 p-0 text-white hover:bg-white/20"
              >
                {isMinimized ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 p-0 text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[calc(600px-80px)]">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex items-start space-x-2 max-w-[80%] ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.type === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                        }`}
                      >
                        {message.type === "user" ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                      </div>
                      <div
                        className={`rounded-2xl p-3 ${
                          message.type === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">
                          {message.content}
                        </p>
                        {message.quickReplies && message.type === "bot" && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {message.quickReplies.map((reply, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuickReply(reply)}
                                className="text-xs h-7 rounded-full"
                              >
                                {reply}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-center">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-muted rounded-2xl p-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex space-x-2">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your question..."
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button
                  onClick={() => handleSendMessage(inputMessage)}
                  disabled={!inputMessage.trim() || isTyping}
                  className="px-3"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Ask me anything about FreelanceHub!
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
