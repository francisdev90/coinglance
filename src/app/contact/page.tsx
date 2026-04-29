import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Mail, MessageSquare, Briefcase, Globe, Send, Hash } from "lucide-react";
import Header from "@/components/layout/Header";
import MarketTicker from "@/components/layout/MarketTicker";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Contact CoinGlance — Get in Touch",
  description: "Contact the CoinGlance team for general enquiries, partnership and business proposals, press requests, or to report an issue.",
};

const CONTACT_REASONS = [
  {
    Icon: Mail,
    title: "General enquiries",
    body: "Questions about CoinGlance, our data, or how something works?",
    link: "mailto:hello@coinglance.app",
    linkLabel: "hello@coinglance.app",
  },
  {
    Icon: Briefcase,
    title: "Business & partnerships",
    body: "Exchange partnerships, data licensing, white-label enquiries, or sponsored content proposals.",
    link: "mailto:partners@coinglance.app",
    linkLabel: "partners@coinglance.app",
  },
  {
    Icon: MessageSquare,
    title: "Press & media",
    body: "Journalists, podcasters, and content creators — we're happy to provide comment, data, or interviews.",
    link: "mailto:press@coinglance.app",
    linkLabel: "press@coinglance.app",
  },
];

const SOCIAL_LINKS = [
  { Icon: Globe, label: "Website", href: "#", note: "coinglance.app" },
  { Icon: Send, label: "Telegram", href: "#", note: "Coming soon" },
  { Icon: Hash, label: "Discord", href: "#", note: "Coming soon" },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
      <Header />
      <div className="sticky top-16 z-40">
        <MarketTicker />
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <nav className="flex items-center gap-1.5 text-sm text-text-secondary-light dark:text-text-secondary-dark mb-8">
          <Link href="/" className="hover:text-accent-gold transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <span className="text-text-primary-light dark:text-text-primary-dark font-medium">Contact</span>
        </nav>

        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary-light dark:text-text-primary-dark tracking-tight mb-4">
            Get in touch
          </h1>
          <p className="text-base text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
            We&apos;re a small team and we read every message. We aim to respond within 2 business days.
          </p>
        </div>

        {/* Contact cards */}
        <div className="space-y-4 mb-12">
          {CONTACT_REASONS.map(({ Icon, title, body, link, linkLabel }) => (
            <div
              key={title}
              className="flex items-start gap-4 p-5 rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark"
            >
              <div className="w-10 h-10 rounded-xl bg-accent-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="w-5 h-5 text-accent-gold" />
              </div>
              <div>
                <p className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark mb-1">{title}</p>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-2">{body}</p>
                <a
                  href={link}
                  className="text-sm font-semibold text-accent-gold hover:text-accent-gold/80 transition-colors"
                >
                  {linkLabel}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Contact form */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
            Send us a message
          </h2>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-6">
            Fill out the form below and we&apos;ll get back to you as soon as possible.
          </p>

          <div className="p-6 rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark">
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark mb-2">
                    Your name
                  </label>
                  <input
                    type="text"
                    placeholder="Jane Smith"
                    className="w-full px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm text-text-primary-light dark:text-text-primary-dark placeholder-text-secondary-light dark:placeholder-text-secondary-dark outline-none focus:border-accent-gold/60 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    placeholder="jane@example.com"
                    className="w-full px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm text-text-primary-light dark:text-text-primary-dark placeholder-text-secondary-light dark:placeholder-text-secondary-dark outline-none focus:border-accent-gold/60 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark mb-2">
                  Subject
                </label>
                <select className="w-full px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm text-text-primary-light dark:text-text-primary-dark outline-none focus:border-accent-gold/60 transition-colors">
                  <option value="">Select a topic...</option>
                  <option value="general">General enquiry</option>
                  <option value="data">Data question or error</option>
                  <option value="partnership">Business / partnership</option>
                  <option value="press">Press / media</option>
                  <option value="feedback">Feedback or suggestion</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark mb-2">
                  Message
                </label>
                <textarea
                  rows={5}
                  placeholder="Tell us what's on your mind..."
                  className="w-full px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm text-text-primary-light dark:text-text-primary-dark placeholder-text-secondary-light dark:placeholder-text-secondary-dark outline-none focus:border-accent-gold/60 transition-colors resize-none"
                />
              </div>

              <div className="flex items-center justify-between gap-4 flex-wrap">
                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                  By submitting, you agree to our{" "}
                  <Link href="/privacy" className="text-accent-gold hover:underline">Privacy Policy</Link>.
                  Or email us directly:{" "}
                  <a href="mailto:hello@coinglance.app" className="text-accent-gold hover:underline">hello@coinglance.app</a>
                </p>
                <a
                  href="mailto:hello@coinglance.app?subject=Contact from CoinGlance"
                  className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-gold text-bg-dark font-bold text-sm hover:bg-accent-gold/90 transition-colors shadow-sm shadow-accent-gold/20"
                >
                  Send message
                  <Send className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Social */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-4">
            Follow us
          </h2>
          <div className="flex gap-3">
            {SOCIAL_LINKS.map(({ Icon, label, href, note }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex flex-col items-center gap-1.5 p-4 rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-gold hover:border-accent-gold/40 transition-all duration-200 min-w-[64px] sm:min-w-[80px]"
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-semibold">{label}</span>
                <span className="text-[10px] opacity-60">{note}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Response time */}
        <div className="p-5 rounded-xl border border-border-light dark:border-border-dark bg-bg-card-light dark:bg-bg-card-dark">
          <p className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark mb-1">
            Response time
          </p>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
            We aim to respond to all messages within 2 business days. For urgent matters (such as data errors affecting investment decisions), please include &quot;URGENT&quot; in your subject line and email us directly at{" "}
            <a href="mailto:hello@coinglance.app" className="text-accent-gold hover:underline">hello@coinglance.app</a>.
          </p>
        </div>

      </main>

      <Footer />
    </div>
  );
}
