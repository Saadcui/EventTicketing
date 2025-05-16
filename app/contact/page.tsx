import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="container py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Contact Us</h1>
          <p className="text-muted-foreground max-w-2xl">
            Have questions about BlockTix? Our team is here to help. Reach out to us using any of the methods below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-primary/10 mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Email Us</h3>
                <p className="text-muted-foreground mb-4">
                  Send us an email and we'll get back to you within 24 hours.
                </p>
                <a href="mailto:support@blocktix.com" className="text-primary hover:underline">
                  support@blocktix.com
                </a>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-primary/10 mb-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Call Us</h3>
                <p className="text-muted-foreground mb-4">Available Monday to Friday, 9am to 5pm EST.</p>
                <a href="tel:+18005551234" className="text-primary hover:underline">
                  +1 (800) 555-1234
                </a>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-primary/10 mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Live Chat</h3>
                <p className="text-muted-foreground mb-4">Chat with our support team in real-time.</p>
                <Button variant="outline">Start Chat</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Your email" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select>
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="support">Technical Support</SelectItem>
                      <SelectItem value="billing">Billing Question</SelectItem>
                      <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Your message" rows={5} />
                </div>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visit Our Office</CardTitle>
              <CardDescription>Stop by our headquarters during business hours.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-6 relative">
                {/* This would be a map in a real implementation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPin className="h-12 w-12 text-muted-foreground opacity-50" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Address</h3>
                  <p className="text-muted-foreground">
                    123 Blockchain Avenue
                    <br />
                    Suite 456
                    <br />
                    San Francisco, CA 94103
                    <br />
                    United States
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Business Hours</h3>
                  <p className="text-muted-foreground">
                    Monday - Friday: 9:00 AM - 5:00 PM
                    <br />
                    Saturday - Sunday: Closed
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Getting Here</h3>
                  <p className="text-muted-foreground">
                    We're conveniently located near public transportation. The nearest BART station is Powell Street,
                    just a 5-minute walk away.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Quick answers to common questions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-medium">How do I get a refund?</h3>
                <p className="text-sm text-muted-foreground">
                  Refunds are processed automatically through smart contracts if an event is canceled. For other refund
                  requests, please contact the event organizer directly.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Can I transfer my ticket to someone else?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes, you can transfer your ticket by using the 'Transfer' option in your ticket wallet. You'll need
                  the recipient's wallet address or email.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">How do I connect my wallet?</h3>
                <p className="text-sm text-muted-foreground">
                  Visit our{" "}
                  <a href="/wallet/setup" className="text-primary hover:underline">
                    Wallet Setup Guide
                  </a>{" "}
                  for step-by-step instructions on connecting your blockchain wallet.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">How do I create an event?</h3>
                <p className="text-sm text-muted-foreground">
                  Log in to your account, navigate to the Dashboard, and click on "Create New Event" to get started with
                  creating your blockchain-secured event.
                </p>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Button asChild variant="outline">
                <a href="/faq">View All FAQs</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
