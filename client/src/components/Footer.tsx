import { Link } from "wouter";
import { useState } from "react";
import { SEO_CONFIG } from "@/config/seo";
import { ChevronDown } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Über Flinkly */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Über <span translate="no" className="notranslate">Flinkly</span></h3>
            <p className="text-sm text-slate-400 mb-4">
              Dein Marktplatz für digitale Mikrodienstleistungen in der DACH-Region. Faire Gebühren, transparente Prozesse, DSGVO-konform.
            </p>
            {/* Social Media */}
            <div className="flex gap-3 mt-4">
              <a 
                href="https://x.com/MimiT3chAi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="X (Twitter)"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a 
                href="https://www.linkedin.com/company/mimitechai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/mimi_tech_ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
                </svg>
              </a>
            </div>
            <div className="mt-6 text-sm text-slate-400">
              <p className="mb-1">
                <a href="mailto:info@mimitechai.com" className="hover:text-white transition-colors">
                  info@mimitechai.com
                </a>
              </p>
              <p>
                <a href="tel:+4915758805737" className="hover:text-white transition-colors">
                  +49 1575 8805737
                </a>
              </p>
            </div>
          </div>

          {/* Plattform */}
          <div>
            <button
              onClick={() => toggleSection('plattform')}
              className="flex items-center justify-between w-full text-white font-semibold mb-4 hover:text-emerald-400 transition-colors"
              aria-expanded={openSections['plattform']}
              aria-label="Plattform-Menü öffnen/schließen"
            >
              <span>Plattform</span>
              <ChevronDown 
                className={`w-5 h-5 transition-transform pointer-events-none ${openSections['plattform'] ? 'rotate-180' : ''}`}
              />
            </button>
            {openSections['plattform'] && (
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/marketplace" className="hover:text-white transition-colors">
                    Marketplace
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    Über uns
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-white transition-colors">
                    So funktioniert's
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Kontakt
                  </Link>
                </li>
                <li>
                  <Link href="/accessibility" className="hover:text-white transition-colors">
                    Barrierefreiheit
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Rechtliches */}
          <div>
            <button
              onClick={() => toggleSection('rechtliches')}
              className="flex items-center justify-between w-full text-white font-semibold mb-4 hover:text-emerald-400 transition-colors"
              aria-expanded={openSections['rechtliches']}
              aria-label="Rechtliches-Menü öffnen/schließen"
            >
              <span>Rechtliches</span>
              <ChevronDown 
                className={`w-5 h-5 transition-transform pointer-events-none ${openSections['rechtliches'] ? 'rotate-180' : ''}`}
              />
            </button>
            {openSections['rechtliches'] && (
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/impressum" className="hover:text-white transition-colors">
                    Impressum
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Datenschutz
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    AGB
                  </Link>
                </li>
                <li>
                  <Link href="/widerruf" className="hover:text-white transition-colors">
                    Widerruf
                  </Link>
                </li>
                <li>
                  <Link href="/cookie-policy" className="hover:text-white transition-colors">
                    Cookie-Richtlinie
                  </Link>
                </li>
                <li>
                  <Link href="/report" className="hover:text-white transition-colors">
                    Inhalt melden (DSA)
                  </Link>
                </li>
                <li>
                  <Link href="/transparency-report" className="hover:text-white transition-colors">
                    Transparenzbericht
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:text-white transition-colors">
                    Sicherheit
                  </Link>
                </li>
                <li>
                  <Link href="/sanctions-policy" className="hover:text-white transition-colors">
                    Sanctions Policy
                  </Link>
                </li>
                <li>
                  <Link href="/prohibited-use" className="hover:text-white transition-colors">
                    Prohibited Use
                  </Link>
                </li>
                <li>
                  <Link href="/dmca-policy" className="hover:text-white transition-colors">
                    DMCA Policy
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Für Verkäufer */}
          <div>
            <button
              onClick={() => toggleSection('verkaufer')}
              className="flex items-center justify-between w-full text-white font-semibold mb-4 hover:text-emerald-400 transition-colors"
              aria-expanded={openSections['verkaufer']}
              aria-label="Verkäufer-Menü öffnen/schließen"
            >
              <span>Für Verkäufer</span>
              <ChevronDown 
                className={`w-5 h-5 transition-transform pointer-events-none ${openSections['verkaufer'] ? 'rotate-180' : ''}`}
              />
            </button>
            {openSections['verkaufer'] && (
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/seller-terms" className="hover:text-white transition-colors">
                    Verkäufer-Bedingungen (P2B)
                  </Link>
                </li>
                <li>
                  <Link href="/p2b-transparency" className="hover:text-white transition-colors">
                    P2B-Transparenz
                  </Link>
                </li>
                <li>
                  <Link href="/seller-dpa" className="hover:text-white transition-colors">
                    AVV für Verkäufer
                  </Link>
                </li>
                <li>
                  <Link href="/seller-complaint" className="hover:text-white transition-colors">
                    Beschwerde einreichen
                  </Link>
                </li>
                <li>
                  <Link href="/dispute-resolution" className="hover:text-white transition-colors">
                    Streitbeilegung
                  </Link>
                </li>
                <li>
                  <Link href="/sla" className="hover:text-white transition-colors">
                    Service Level Agreement
                  </Link>
                </li>
                <li>
                  <Link href="/payment-compliance" className="hover:text-white transition-colors">
                    Zahlungsabwicklung (ZAG)
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 pt-6 text-center text-sm text-slate-400">
          <p>{SEO_CONFIG.copyrightText()}</p>
        </div>
      </div>
    </footer>
  );
}
