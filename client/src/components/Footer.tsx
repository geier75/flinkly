import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Über Flinkly */}
          <div>
            <h3 className="text-white font-semibold mb-4">Über Flinkly</h3>
            <p className="text-sm text-slate-400">
              Dein Marktplatz für schnelle, kreative & digitale Mikrodienstleistungen in der DACH-Region.
            </p>
          </div>

          {/* Rechtliches */}
          <div>
            <h3 className="text-white font-semibold mb-4">Rechtliches</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Datenschutzerklärung
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  AGB
                </Link>
              </li>
              <li>
                <Link href="/impressum" className="hover:text-white transition-colors">
                  Impressum
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:info@mimitechai.com" className="hover:text-white transition-colors">
                  info@mimitechai.com
                </a>
              </li>
              <li>
                <a href="tel:+4915758805737" className="hover:text-white transition-colors">
                  +49 1575 8805737
                </a>
              </li>
            </ul>
          </div>

          {/* Datenschutz-Tools */}
          <div>
            <h3 className="text-white font-semibold mb-4">Datenschutz-Tools</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy-dashboard" className="hover:text-white transition-colors">
                  Live Privacy Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 pt-6 text-center text-sm text-slate-400">
          <p>© {currentYear} MiMi Tech Ai UG (haftungsbeschränkt). Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
}
