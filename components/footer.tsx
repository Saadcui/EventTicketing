import Link from "next/link"
import { Ticket } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Ticket className="h-6 w-6" />
              <span className="font-bold text-xl">BlockTix</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Decentralized event ticketing platform with blockchain security
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:col-span-3 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold">For Attendees</h3>
              <nav className="flex flex-col gap-2">
                <Link href="/discover" className="text-sm hover:underline">
                  Discover Events
                </Link>
                <Link href="/tickets" className="text-sm hover:underline">
                  My Tickets
                </Link>
                <Link href="/wallet/setup" className="text-sm hover:underline">
                  Wallet Setup
                </Link>
              </nav>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold">For Organizers</h3>
              <nav className="flex flex-col gap-2">
                <Link href="/create" className="text-sm hover:underline">
                  Create Event
                </Link>
                <Link href="/dashboard" className="text-sm hover:underline">
                  Dashboard
                </Link>
                <Link href="/analytics" className="text-sm hover:underline">
                  Analytics
                </Link>
              </nav>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold">Support</h3>
              <nav className="flex flex-col gap-2">
                <Link href="/help" className="text-sm hover:underline">
                  Help Center
                </Link>
                <Link href="/faq" className="text-sm hover:underline">
                  FAQ
                </Link>
                <Link href="/contact" className="text-sm hover:underline">
                  Contact Us
                </Link>
              </nav>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} BlockTix. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-xs text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-xs text-muted-foreground hover:underline">
              Privacy
            </Link>
            <Link href="/cookies" className="text-xs text-muted-foreground hover:underline">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
