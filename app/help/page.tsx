import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, HelpCircle, Ticket, Wallet, Calendar, Users, MessageSquare } from "lucide-react"
import ChatbotSupport from "@/components/help/chatbot-support"

export default function HelpPage() {
  const helpCategories = [
    {
      title: "Ticket Issues",
      icon: Ticket,
      description: "Help with purchasing, transferring, or accessing tickets",
      href: "/help/tickets",
    },
    {
      title: "Wallet Setup",
      icon: Wallet,
      description: "Learn how to set up and use your blockchain wallet",
      href: "/help/wallet-setup",
    },
    {
      title: "Event Hosting",
      icon: Calendar,
      description: "Guidance for creating and managing events",
      href: "/help/event-hosting",
    },
    {
      title: "Account Management",
      icon: Users,
      description: "Help with your account settings and profile",
      href: "/help/account",
    },
  ]

  const faqItems = [
    {
      question: "How do blockchain-secured tickets work?",
      answer:
        "Our tickets are minted as NFTs (Non-Fungible Tokens) on the blockchain, which provides a tamper-proof record of ownership. Each ticket has a unique identifier that can be verified using blockchain technology, preventing counterfeiting and unauthorized resales.",
    },
    {
      question: "Do I need a crypto wallet to use BlockTix?",
      answer:
        "Yes, you'll need a blockchain wallet like MetaMask to purchase and store your tickets. However, we also offer a custodial wallet option for users who are new to blockchain technology.",
    },
    {
      question: "How do I transfer my ticket to someone else?",
      answer:
        "You can transfer your ticket by using the 'Transfer' option in your ticket wallet. Enter the recipient's wallet address or email, and the ticket NFT will be transferred securely on the blockchain.",
    },
    {
      question: "What happens if an event is canceled?",
      answer:
        "If an event is canceled, refunds are automatically processed through smart contracts. The funds will be returned to the original payment method or wallet within 5-7 business days.",
    },
  ]

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Help Center</h1>
          <p className="text-muted-foreground">Find answers to common questions and get support</p>
        </div>
        <div className="w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search for help..." className="pl-8 w-full md:w-[300px]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {helpCategories.map((category) => (
          <Link key={category.title} href={category.href}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-primary/10">
                    <category.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{category.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <div key={index} className="border rounded-lg p-6">
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  {item.question}
                </h3>
                <p className="text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Button asChild variant="outline">
              <Link href="/help/faq">View All FAQs</Link>
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" /> Chat Support
              </CardTitle>
              <CardDescription>Get immediate assistance from our AI support agent</CardDescription>
            </CardHeader>
            <CardContent>
              <ChatbotSupport />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
