import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, FileText } from "lucide-react";
import Header from "@/components/layout/Header";
import MarketTicker from "@/components/layout/MarketTicker";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Terms of Service — CoinGlance",
  description: "CoinGlance's terms of service. Read our terms before using the site, including our no-financial-advice disclaimer.",
};

const LAST_UPDATED = "April 28, 2026";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-10">
      <h2 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark mb-4 pb-2 border-b border-border-light dark:border-border-dark">
        {title}
      </h2>
      <div className="space-y-4 text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export default function TermsPage() {
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
          <span className="text-text-primary-light dark:text-text-primary-dark font-medium">Terms of Service</span>
        </nav>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-gold/10 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-accent-gold" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary-light dark:text-text-primary-dark tracking-tight">
              Terms of Service
            </h1>
          </div>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Last updated: {LAST_UPDATED}
          </p>
          <p className="mt-4 text-base text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
            Please read these terms carefully before using CoinGlance. By accessing or using this site, you agree to be bound by these terms.
          </p>
        </div>

        {/* Important disclaimer box */}
        <div className="mb-10 p-5 rounded-xl border border-warning/30 bg-warning/5">
          <p className="text-sm font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
            Important: CoinGlance does not provide financial advice.
          </p>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
            Nothing on this website constitutes investment, financial, legal, or tax advice. Cryptocurrency markets are highly volatile. Past performance is not indicative of future results. Always conduct your own research and consult a qualified financial advisor before making any investment decisions.
          </p>
        </div>

        <Section id="acceptance" title="1. Acceptance of terms">
          <p>
            By accessing or using CoinGlance (&quot;the site,&quot; &quot;the service&quot;), you agree to these Terms of Service and our{" "}
            <Link href="/privacy" className="text-accent-gold hover:underline">Privacy Policy</Link>. If you do not agree with any part of these terms, you must not use the site.
          </p>
          <p>
            These terms apply to all visitors, users, and others who access or use the service. We reserve the right to update these terms at any time. Continued use of the site after changes are posted constitutes acceptance of the revised terms.
          </p>
        </Section>

        <Section id="use-of-site" title="2. Use of the site">
          <p>You may use CoinGlance for lawful purposes only. You agree not to:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Use the site in any way that violates applicable laws or regulations</li>
            <li>Attempt to gain unauthorised access to any part of the site or its infrastructure</li>
            <li>Scrape, crawl, or systematically extract data from the site in excessive volumes without our permission</li>
            <li>Use automated systems to access the site in a manner that sends more requests than a human could reasonably send in the same period</li>
            <li>Use the site to transmit spam, malware, or any harmful or disruptive content</li>
            <li>Reproduce, republish, or redistribute CoinGlance content commercially without written permission</li>
          </ul>
          <p>
            Personal, non-commercial use of CoinGlance data (including screenshots and references for educational purposes) is permitted, provided you attribute CoinGlance as the source.
          </p>
        </Section>

        <Section id="no-financial-advice" title="3. No financial or investment advice">
          <p>
            CoinGlance is an informational platform only. All content on this site — including price data, market statistics, exchange reviews, rankings, sentiment indicators, and any other information — is provided for general informational purposes only. It does not constitute and should not be relied upon as investment, financial, legal, or tax advice.
          </p>
          <p>
            We make no representations or warranties about the accuracy, completeness, or suitability of any information on the site for any particular purpose. Market data is sourced from third parties (including CoinGecko and Binance) and may be subject to delays, errors, or interruptions beyond our control.
          </p>
          <p>
            <strong className="text-text-primary-light dark:text-text-primary-dark">Cryptocurrencies carry significant risk.</strong> Their value can fall to zero. You can lose your entire investment. Never invest money you cannot afford to lose. CoinGlance is not responsible for any financial losses arising from your use of the site or any decisions made based on information presented on it.
          </p>
        </Section>

        <Section id="affiliate-links" title="4. Affiliate links and third-party services">
          <p>
            CoinGlance contains affiliate links to third-party cryptocurrency exchanges. We may earn a commission when you sign up to these services through our links, at no cost to you. The presence of an affiliate link does not constitute our endorsement of the exchange beyond what is explicitly stated in our reviews, and it does not influence the information, rankings, or data we present.
          </p>
          <p>
            When you follow a link to a third-party website, that site&apos;s own terms and privacy policy apply. We are not responsible for the content, practices, or reliability of any third-party service. Always conduct your own due diligence before depositing funds on any exchange.
          </p>
          <p>
            For full details, see our{" "}
            <Link href="/affiliate-disclosure" className="text-accent-gold hover:underline">Affiliate Disclosure</Link>.
          </p>
        </Section>

        <Section id="intellectual-property" title="5. Intellectual property">
          <p>
            The CoinGlance name, logo, design, and original content are the intellectual property of CoinGlance and may not be used, copied, or reproduced without written permission. Market data displayed on the site is sourced from third-party providers and subject to their respective terms.
          </p>
          <p>
            Nothing in these terms transfers any intellectual property rights to you. All rights not expressly granted are reserved.
          </p>
        </Section>

        <Section id="limitation-of-liability" title="6. Limitation of liability">
          <p>
            To the fullest extent permitted by applicable law, CoinGlance and its operators shall not be liable for any direct, indirect, incidental, consequential, special, or exemplary damages arising from your use of — or inability to use — the site or any content on it, including but not limited to:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Financial losses resulting from investment decisions informed by CoinGlance data</li>
            <li>Losses arising from inaccurate, delayed, or unavailable market data</li>
            <li>Losses arising from your use of any linked third-party exchange or service</li>
            <li>Any interruption, suspension, or termination of the service</li>
          </ul>
          <p>
            In jurisdictions that do not allow the exclusion of certain warranties or limitation of liability, our liability is limited to the maximum extent permitted by law.
          </p>
        </Section>

        <Section id="disclaimers" title="7. Disclaimers">
          <p>
            CoinGlance is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not warrant that the site will be uninterrupted, error-free, or free from viruses or other harmful components.
          </p>
          <p>
            Market data, prices, and statistics are sourced from third-party APIs and may not always reflect real-time market conditions. We are not responsible for errors, omissions, or delays in such data.
          </p>
        </Section>

        <Section id="governing-law" title="8. Governing law">
          <p>
            These terms shall be governed by and construed in accordance with applicable law. Any disputes arising from your use of CoinGlance shall be subject to the exclusive jurisdiction of the courts of the relevant jurisdiction. If any provision of these terms is found to be unenforceable, the remaining provisions will continue in full force and effect.
          </p>
        </Section>

        <Section id="changes" title="9. Changes to these terms">
          <p>
            We reserve the right to update or modify these terms at any time without prior notice. Changes will be effective immediately upon posting to the site, with the &quot;Last updated&quot; date revised accordingly. Your continued use of CoinGlance after any such changes constitutes acceptance of the new terms.
          </p>
        </Section>

        <Section id="contact" title="10. Contact">
          <p>
            For questions about these terms, please contact us at:{" "}
            <a href="mailto:hello@coinglance.app" className="text-accent-gold hover:underline">hello@coinglance.app</a>
          </p>
        </Section>

        <div className="mt-10 flex gap-4 flex-wrap">
          <Link href="/privacy" className="text-sm font-semibold text-accent-gold hover:text-accent-gold/80 transition-colors">
            Privacy Policy →
          </Link>
          <Link href="/cookies" className="text-sm font-semibold text-accent-gold hover:text-accent-gold/80 transition-colors">
            Cookie Policy →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
