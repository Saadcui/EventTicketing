import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"

// FAQ categories and questions
const faqCategories = [
  {
    id: "general",
    name: "General",
    questions: [
      {
        question: "What is BlockTix?",
        answer:
          "BlockTix is a decentralized event ticketing platform that uses blockchain technology to secure tickets as NFTs (Non-Fungible Tokens). This provides enhanced security, prevents counterfeiting, and enables transparent ticket transfers and resales.",
      },
      {
        question: "How does blockchain ticketing work?",
        answer:
          "When you purchase a ticket on BlockTix, a unique NFT is minted on the blockchain. This NFT represents your ticket and contains all the necessary information about the event and your access rights. The blockchain provides a tamper-proof record of ownership, and the ticket can be verified using blockchain technology.",
      },
      {
        question: "Do I need cryptocurrency to use BlockTix?",
        answer:
          "No, you don't need to own cryptocurrency to use BlockTix. While we use blockchain technology to secure tickets, you can purchase tickets using traditional payment methods like credit cards. However, having a blockchain wallet is required to store your ticket NFTs.",
      },
      {
        question: "Is BlockTix available worldwide?",
        answer:
          "Yes, BlockTix is available globally. However, certain features and payment methods may vary by region due to regulatory requirements. We're continuously expanding our services to provide the best experience worldwide.",
      },
    ],
  },
  {
    id: "tickets",
    name: "Tickets",
    questions: [
      {
        question: "How do I purchase tickets?",
        answer:
          "To purchase tickets, browse events on our Discover page, select the event you're interested in, choose your ticket type, and proceed to checkout. You'll need to connect a blockchain wallet to receive your ticket NFT after purchase.",
      },
      {
        question: "Can I transfer my ticket to someone else?",
        answer:
          "Yes, you can transfer your ticket to another person. Go to your Ticket Wallet, select the ticket you want to transfer, click on the 'Transfer' button, and enter the recipient's wallet address or email. The transfer will be recorded on the blockchain, ensuring transparency and security.",
      },
      {
        question: "What happens if an event is canceled?",
        answer:
          "If an event is canceled, refunds are automatically processed through smart contracts. The funds will be returned to the original payment method or wallet within 5-7 business days. You'll receive an email notification about the cancellation and refund process.",
      },
      {
        question: "How do I access my tickets on the day of the event?",
        answer:
          "Your tickets are stored in your Ticket Wallet. On the day of the event, open the BlockTix app or website, go to your Ticket Wallet, and show the QR code to the event staff for scanning. You can also download your tickets for offline access.",
      },
    ],
  },
  {
    id: "wallet",
    name: "Wallet",
    questions: [
      {
        question: "What is a blockchain wallet?",
        answer:
          "A blockchain wallet is a digital tool that allows you to store, send, and receive cryptocurrencies and NFTs (like your event tickets). It's similar to a digital bank account for your blockchain assets, secured by cryptographic keys.",
      },
      {
        question: "Which wallets are compatible with BlockTix?",
        answer:
          "BlockTix supports popular wallets like MetaMask, Coinbase Wallet, and any wallet compatible with WalletConnect. You can find detailed setup instructions in our Wallet Setup Guide.",
      },
      {
        question: "What if I lose access to my wallet?",
        answer:
          "If you lose access to your wallet but have your recovery phrase (seed phrase), you can restore your wallet and access your tickets. If you lose your recovery phrase, BlockTix support may be able to help in some cases, but this is not guaranteed. Always keep your recovery phrase secure.",
      },
      {
        question: "Is it safe to connect my wallet to BlockTix?",
        answer:
          "Yes, connecting your wallet to BlockTix is safe. We use industry-standard security practices and never store your private keys or recovery phrases. We only request permission to interact with your wallet for specific transactions like minting or transferring ticket NFTs.",
      },
    ],
  },
  {
    id: "organizers",
    name: "For Organizers",
    questions: [
      {
        question: "How do I create an event on BlockTix?",
        answer:
          "To create an event, sign up for an organizer account, go to your Dashboard, and click on 'Create New Event'. Follow the step-by-step process to set up your event details, ticket types, pricing, and other settings. Once published, your event will be visible on the Discover page.",
      },
      {
        question: "What fees does BlockTix charge?",
        answer:
          "BlockTix charges a 2.5% platform fee plus a small blockchain gas fee for minting ticket NFTs. Compared to traditional ticketing platforms, our fees are significantly lower while providing enhanced security and features.",
      },
      {
        question: "How do I receive payments for ticket sales?",
        answer:
          "Payments are processed through our secure payment system. You can choose to receive funds in your bank account or cryptocurrency wallet. Payouts are typically processed within 3-5 business days after ticket sales.",
      },
      {
        question: "Can I customize my event page?",
        answer:
          "Yes, you can customize your event page with images, descriptions, custom branding, and more. We also offer premium features for advanced customization, including custom domains and branded ticket designs.",
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground max-w-2xl">
            Find answers to common questions about BlockTix, blockchain ticketing, and more.
          </p>
        </div>

        <Tabs defaultValue="general" className="mb-8">
          <TabsList className="w-full justify-start overflow-auto">
            {faqCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {faqCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{category.name} Questions</CardTitle>
                  <CardDescription>
                    Frequently asked questions about {category.name.toLowerCase()} topics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">
                          <div className="flex items-start gap-2">
                            <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>{faq.question}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pl-7">
                          <p className="text-muted-foreground">{faq.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Still Have Questions?</CardTitle>
            <CardDescription>We're here to help you with any other questions you might have</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Contact Support</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Our support team is available to assist you with any questions or issues you may have.
              </p>
              <a href="/contact" className="text-primary hover:underline">
                Contact Us →
              </a>
            </div>
            <div className="flex-1 p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Help Center</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Browse our comprehensive help center for guides, tutorials, and troubleshooting tips.
              </p>
              <a href="/help" className="text-primary hover:underline">
                Visit Help Center →
              </a>
            </div>
            <div className="flex-1 p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Community Forum</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Join our community forum to connect with other users and share experiences.
              </p>
              <a href="#" className="text-primary hover:underline">
                Join Forum →
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
