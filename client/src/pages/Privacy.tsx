import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">← Zurück</Button>
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Datenschutzerklärung</h1>
          <p className="text-lg text-slate-600">
            Stand: Januar 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="prose prose-slate max-w-none">
          
          {/* 1. Einleitung & Verantwortlicher */}
          <section className="mb-12" id="verantwortlicher">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Verantwortlicher</h2>
            <p className="text-slate-700 mb-4">
              Verantwortlich für die Datenverarbeitung auf dieser Website im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
            </p>
            <div className="bg-slate-50 p-6 rounded-lg text-slate-700 mb-4">
              <strong className="text-slate-900">MiMi Tech Ai UG (haftungsbeschränkt)</strong><br />
              Lindenplatz 23<br />
              75378 Bad Liebenzell<br />
              Deutschland<br />
              <br />
              E-Mail: <a href="mailto:info@mimitechai.com" className="text-blue-600 hover:underline">info@mimitechai.com</a><br />
              Telefon: <a href="tel:+4915758805737" className="text-blue-600 hover:underline">+49 1575 8805737</a><br />
              Website: <a href="https://www.mimitechai.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" aria-label="MiMi Tech Ai Website (öffnet in neuem Tab)">www.mimitechai.com</a>
            </div>
            <p className="text-slate-700">
              Diese Datenschutzerklärung informiert Sie über Art, Umfang und Zweck der Verarbeitung personenbezogener Daten auf unserer Plattform Flinkly sowie über Ihre Rechte als betroffene Person.
            </p>
          </section>

          {/* 2. Begriffsbestimmungen */}
          <section className="mb-12" id="begriffsbestimmungen">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Begriffsbestimmungen</h2>
            <p className="text-slate-700 mb-4">
              Zum besseren Verständnis verwenden wir folgende Begriffe im Sinne der DSGVO:
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Personenbezogene Daten</h3>
                <p className="text-slate-700">
                  Alle Informationen, die sich auf eine identifizierte oder identifizierbare natürliche Person beziehen (z.B. Name, E-Mail-Adresse, IP-Adresse).
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Verarbeitung</h3>
                <p className="text-slate-700">
                  Jeden Vorgang im Zusammenhang mit personenbezogenen Daten, wie das Erheben, Speichern, Verwenden, Übermitteln oder Löschen.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Einwilligung</h3>
                <p className="text-slate-700">
                  Jede freiwillig, für den bestimmten Fall, in informierter Weise und unmissverständlich abgegebene Willensbekundung in Form einer Erklärung oder sonstigen eindeutigen bestätigenden Handlung.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Auftragsverarbeiter</h3>
                <p className="text-slate-700">
                  Eine natürliche oder juristische Person, die personenbezogene Daten im Auftrag des Verantwortlichen verarbeitet (z.B. Stripe für Zahlungsabwicklung).
                </p>
              </div>
            </div>
          </section>

          {/* 3. Hosting & Server-Logs */}
          <section className="mb-12" id="hosting">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Hosting & Server-Logs</h2>
            
            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">3.1 Hosting</h3>
            <p className="text-slate-700 mb-4">
              Unsere Website wird auf Servern der Manus Cloud gehostet. Die Server befinden sich in der Europäischen Union. Alle Datenübertragungen erfolgen verschlüsselt über SSL/TLS. Regelmäßige automatische Backups gewährleisten die Verfügbarkeit Ihrer Daten.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">3.2 Server-Logs</h3>
            <p className="text-slate-700 mb-4">
              Bei jedem Zugriff auf unsere Website werden automatisch folgende Daten in Server-Logdateien gespeichert:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>IP-Adresse des zugreifenden Geräts</li>
              <li>Datum und Uhrzeit des Zugriffs</li>
              <li>Browser-Typ und -Version</li>
              <li>Betriebssystem</li>
              <li>Aufgerufene Seite (URL)</li>
              <li>HTTP-Status-Code</li>
            </ul>
            <p className="text-slate-700 mb-2">
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der IT-Sicherheit, Fehleranalyse und Optimierung unserer Website)
            </p>
            <p className="text-slate-700">
              <strong>Speicherdauer:</strong> 90 Tage, danach automatische Löschung
            </p>
          </section>

          {/* 4. Registrierung & Nutzerkonten */}
          <section className="mb-12" id="registrierung">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Registrierung & Nutzerkonten</h2>
            
            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">4.1 Erhobene Daten bei der Registrierung</h3>
            <p className="text-slate-700 mb-4">
              Für die Nutzung unserer Plattform ist eine Registrierung erforderlich. Dabei erheben wir folgende Daten:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li><strong>Pflichtangaben:</strong> Name, E-Mail-Adresse, Passwort</li>
              <li><strong>Optionale Angaben:</strong> Profilbild, Bio, Land (DE, AT, CH), Telefon-Nummer (für Verifizierung)</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">4.2 OAuth-Integration</h3>
            <p className="text-slate-700 mb-4">
              Wir nutzen Manus OAuth für die Authentifizierung. Dabei wird ein eindeutiger Identifier (OpenID) von Manus OAuth übermittelt und in unserer Datenbank gespeichert. Ihre Zugangsdaten (Passwort) werden niemals im Klartext gespeichert, sondern ausschließlich gehasht (bcrypt/argon2).
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">4.3 Rechtsgrundlage & Speicherdauer</h3>
            <p className="text-slate-700 mb-2">
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung - die Registrierung ist für die Nutzung der Plattform erforderlich)
            </p>
            <p className="text-slate-700">
              <strong>Speicherdauer:</strong> Bis zur Löschung Ihres Kontos durch Sie selbst oder durch uns (siehe Abschnitt 13: DSGVO++ Features)
            </p>
          </section>

          {/* 5. Marktplatz-Funktion */}
          <section className="mb-12" id="marktplatz">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Marktplatz-Funktion (Gigs & Orders)</h2>
            
            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">5.1 Gig-Erstellung (Seller)</h3>
            <p className="text-slate-700 mb-4">
              Wenn Sie als Seller ein Gig erstellen, erheben wir folgende Daten:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>Titel, Beschreibung, Kategorie, Tags</li>
              <li>Preis, Lieferzeit</li>
              <li>Hochgeladene Bilder (Portfolio)</li>
              <li>Seller-ID (Verknüpfung zu Ihrem Nutzerkonto)</li>
            </ul>
            <p className="text-slate-700 mb-2">
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
            </p>
            <p className="text-slate-700">
              <strong>Speicherdauer:</strong> Bis zur Löschung des Gigs durch Sie
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">5.2 Bestellungen (Käufer & Seller)</h3>
            <p className="text-slate-700 mb-4">
              Bei einer Bestellung werden folgende Daten verarbeitet:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>Käufer-ID, Seller-ID, Gig-ID</li>
              <li>Bestellstatus, Gesamtpreis</li>
              <li>Käufer-Nachricht (Anforderungen)</li>
              <li>Seller-Lieferung (hochgeladene Dateien)</li>
              <li>Lieferdatum, Abschlussdatum</li>
            </ul>
            <p className="text-slate-700 mb-2">
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
            </p>
            <p className="text-slate-700">
              <strong>Speicherdauer:</strong> 10 Jahre (steuerrechtliche Aufbewahrungspflicht gemäß § 147 AO)
            </p>
          </section>

          {/* 6. Zahlungsabwicklung (Stripe) */}
          <section className="mb-12" id="zahlungsabwicklung">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Zahlungsabwicklung (Stripe)</h2>
            
            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">6.1 Stripe als Auftragsverarbeiter</h3>
            <p className="text-slate-700 mb-4">
              Für die Zahlungsabwicklung nutzen wir Stripe, einen Zahlungsdienstleister der Stripe Inc., 510 Townsend Street, San Francisco, CA 94103, USA. Stripe verarbeitet Zahlungsdaten in unserem Auftrag als Auftragsverarbeiter.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">6.2 An Stripe übermittelte Daten</h3>
            <p className="text-slate-700 mb-4">
              Folgende Daten werden an Stripe übermittelt:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>Name, E-Mail-Adresse</li>
              <li>Zahlungsinformationen (Kreditkarte, SEPA, Klarna, TWINT)</li>
              <li>Transaktionsbetrag</li>
              <li>Order-ID (Metadaten zur Zuordnung)</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">6.3 Stripe-Services</h3>
            <p className="text-slate-700 mb-4">
              Wir nutzen folgende Stripe-Services:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li><strong>Stripe Checkout:</strong> Sichere Zahlungsabwicklung für Käufer</li>
              <li><strong>Stripe Connect:</strong> Auszahlungen an Seller (85% des Transaktionsbetrags)</li>
              <li><strong>Webhooks:</strong> Automatische Status-Updates (Zahlung erfolgreich, fehlgeschlagen, etc.)</li>
              <li><strong>Refund-API:</strong> Rückerstattungen bei Stornierungen</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">6.4 Drittlandübermittlung</h3>
            <p className="text-slate-700 mb-4">
              Stripe ist ein US-amerikanisches Unternehmen. Die Datenübermittlung in die USA erfolgt auf Grundlage von <strong>Standard-Vertragsklauseln (SCC)</strong> gemäß Art. 46 Abs. 2 lit. c DSGVO. Weitere Informationen finden Sie in der <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" aria-label="Stripe Datenschutzerklärung (öffnet in neuem Tab)">Stripe Datenschutzerklärung</a>.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">6.5 Rechtsgrundlage</h3>
            <p className="text-slate-700">
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung - die Zahlungsabwicklung ist für die Durchführung der Bestellung erforderlich)
            </p>
          </section>

          {/* 7. Messaging-System */}
          <section className="mb-12" id="messaging">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Messaging-System (Real-time Chat)</h2>
            
            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">7.1 Funktionsweise</h3>
            <p className="text-slate-700 mb-4">
              Unsere Plattform bietet ein Real-time Chat-System (Socket.io) für die Kommunikation zwischen Käufern und Sellern. Nachrichten sind order-bezogen und ermöglichen den Austausch von Anforderungen, Fragen und Lieferungen.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">7.2 Erhobene Daten</h3>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>Käufer-ID, Seller-ID, Order-ID</li>
              <li>Nachrichteninhalt (Text)</li>
              <li>Datei-Anhänge (File-Sharing)</li>
              <li>Gelesen-Status (Read-Receipts)</li>
              <li>Zeitstempel</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">7.3 Rechtsgrundlage & Speicherdauer</h3>
            <p className="text-slate-700 mb-2">
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung - die Kommunikation ist für die Abwicklung der Bestellung erforderlich)
            </p>
            <p className="text-slate-700">
              <strong>Speicherdauer:</strong> Bis zur Löschung durch den Nutzer (Sie können Nachrichten jederzeit löschen)
            </p>
          </section>

          {/* 8. Seller-Verifizierung */}
          <section className="mb-12" id="seller-verifizierung">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Seller-Verifizierung</h2>
            
            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">8.1 Verifizierungs-Prozesse</h3>
            <p className="text-slate-700 mb-4">
              Um die Vertrauenswürdigkeit unserer Plattform zu erhöhen, bieten wir Sellern folgende Verifizierungs-Optionen:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li><strong>E-Mail-Verifizierung:</strong> Bestätigung der E-Mail-Adresse per Verifizierungs-Code</li>
              <li><strong>Telefon-Verifizierung:</strong> Bestätigung der Telefon-Nummer per SMS-Code (optional)</li>
              <li><strong>Admin-Approval:</strong> Manuelle Prüfung durch unser Team (für höhere Verifizierungs-Level)</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">8.2 Erhobene Daten</h3>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>E-Mail-Adresse (bereits bei Registrierung erhoben)</li>
              <li>Telefon-Nummer (optional, nur bei Telefon-Verifizierung)</li>
              <li>Verifizierungs-Status (E-Mail, Telefon, Admin-Approval)</li>
              <li>Verifizierungs-Level (1-4)</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">8.3 Rechtsgrundlage</h3>
            <p className="text-slate-700">
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) und Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Betrugsprävention und Vertrauensbildung)
            </p>
          </section>

          {/* 9. Cookies & ähnliche Technologien */}
          <section className="mb-12" id="cookies">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Cookies & ähnliche Technologien</h2>
            
            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">9.1 Was sind Cookies?</h3>
            <p className="text-slate-700 mb-4">
              Cookies sind kleine Textdateien, die auf Ihrem Gerät gespeichert werden, wenn Sie unsere Website besuchen. Sie ermöglichen es uns, Ihre Einstellungen zu speichern und die Nutzung der Website zu analysieren.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">9.2 Cookie-Kategorien</h3>
            <p className="text-slate-700 mb-4">
              Wir verwenden folgende Cookie-Kategorien:
            </p>
            <div className="space-y-4 mb-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-2">Notwendige Cookies</h4>
                <p className="text-slate-700 text-sm mb-2">
                  Diese Cookies sind für den Betrieb der Website erforderlich (z.B. Session-Cookies, CSRF-Token).
                </p>
                <p className="text-slate-700 text-sm">
                  <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-2">Funktionale Cookies</h4>
                <p className="text-slate-700 text-sm mb-2">
                  Diese Cookies ermöglichen erweiterte Funktionen (z.B. Spracheinstellungen, Theme).
                </p>
                <p className="text-slate-700 text-sm">
                  <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-2">Analytische Cookies</h4>
                <p className="text-slate-700 text-sm mb-2">
                  Diese Cookies helfen uns, die Nutzung der Website zu analysieren und zu verbessern (z.B. PostHog).
                </p>
                <p className="text-slate-700 text-sm">
                  <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-2">Marketing-Cookies</h4>
                <p className="text-slate-700 text-sm mb-2">
                  Diese Cookies ermöglichen personalisierte Werbung (z.B. Exit-Intent-Modal, Retargeting).
                </p>
                <p className="text-slate-700 text-sm">
                  <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)
                </p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">9.3 Cookie-Consent-Banner</h3>
            <p className="text-slate-700 mb-4">
              Beim ersten Besuch unserer Website erscheint ein Cookie-Consent-Banner, in dem Sie Ihre Einwilligung für die verschiedenen Cookie-Kategorien erteilen oder ablehnen können. Ihre Entscheidung wird in einem Consent-Log gespeichert (siehe Abschnitt 9.4).
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">9.4 Consent-Logs (Proof-of-Consent)</h3>
            <p className="text-slate-700 mb-4">
              Um unserer Nachweispflicht gemäß Art. 7 Abs. 1 DSGVO nachzukommen, speichern wir Ihre Einwilligungsentscheidungen in einem Consent-Log:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>User-ID (falls eingeloggt)</li>
              <li>Consent-Type (analytics, marketing, functional)</li>
              <li>Consent-Given (true/false)</li>
              <li>IP-Adresse</li>
              <li>User-Agent (Browser-Information)</li>
              <li>Zeitstempel</li>
            </ul>
            <p className="text-slate-700 mb-2">
              <strong>Rechtsgrundlage:</strong> Art. 7 Abs. 1 DSGVO (Nachweispflicht der Einwilligung)
            </p>
            <p className="text-slate-700">
              <strong>Speicherdauer:</strong> 12 Monate
            </p>
          </section>

          {/* 10. Web-Analytics & Tracking */}
          <section className="mb-12" id="analytics">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Web-Analytics & Tracking</h2>
            
            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">10.1 PostHog (geplant)</h3>
            <p className="text-slate-700 mb-4">
              Wir planen die Integration von PostHog, einem Analytics-Tool der PostHog Inc., San Francisco, USA. PostHog ermöglicht uns die Analyse der Nutzung unserer Website (Event-Tracking, Conversion-Funnel, Heatmaps, Session-Recording). Die Integration erfolgt nur mit Ihrer Einwilligung (Consent-Aware-Tracking).
            </p>
            <p className="text-slate-700 mb-4">
              <strong>Drittlandübermittlung:</strong> USA (Standard-Vertragsklauseln gemäß Art. 46 Abs. 2 lit. c DSGVO)<br />
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)<br />
              <strong>Weitere Informationen:</strong> <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" aria-label="PostHog Datenschutzerklärung (öffnet in neuem Tab)">PostHog Datenschutzerklärung</a>
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">10.2 Sentry (Error-Tracking, geplant)</h3>
            <p className="text-slate-700 mb-4">
              Wir planen die Integration von Sentry, einem Error-Tracking-Tool der Sentry Inc., San Francisco, USA. Sentry hilft uns, Fehler auf unserer Website zu erkennen und zu beheben.
            </p>
            <p className="text-slate-700 mb-4">
              <strong>Drittlandübermittlung:</strong> USA (Standard-Vertragsklauseln gemäß Art. 46 Abs. 2 lit. c DSGVO)<br />
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Fehleranalyse)<br />
              <strong>Weitere Informationen:</strong> <a href="https://sentry.io/privacy/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" aria-label="Sentry Datenschutzerklärung (öffnet in neuem Tab)">Sentry Datenschutzerklärung</a>
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">10.3 Consent-Aware-Tracking</h3>
            <p className="text-slate-700">
              Alle Analytics-Tools werden nur aktiviert, wenn Sie Ihre Einwilligung im Cookie-Consent-Banner erteilt haben. Sie können Ihre Einwilligung jederzeit widerrufen.
            </p>
          </section>

          {/* 11. Exit-Intent-Modal & Discount-Offers */}
          <section className="mb-12" id="exit-intent">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Exit-Intent-Modal & Discount-Offers</h2>
            
            <p className="text-slate-700 mb-4">
              Wir nutzen ein Exit-Intent-Modal, das erscheint, wenn Sie unsere Website verlassen möchten (Mouse-Exit-Detection) oder länger als 30 Sekunden inaktiv sind. Das Modal bietet Ihnen einen Rabatt-Code (5€) an, um Sie zum Abschluss Ihrer Bestellung zu motivieren.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">11.1 Datenverarbeitung</h3>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li><strong>Session-Storage:</strong> Wir speichern lokal in Ihrem Browser (Session-Storage), ob das Modal bereits angezeigt wurde (<code>exit_intent_done</code>). Diese Daten sind nicht personenbezogen und werden nicht an unsere Server übermittelt.</li>
              <li><strong>Telemetrie-Events:</strong> Wenn Sie Ihre Einwilligung für Analytics erteilt haben, tracken wir folgende Events: exitIntentTriggered, exitIntentShown, exitIntentAccepted, exitIntentDismissed.</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">11.2 Rechtsgrundlage</h3>
            <p className="text-slate-700">
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung für Telemetrie-Events)
            </p>
          </section>

          {/* 12. Similar-Gigs-Algorithm (Empfehlungen) */}
          <section className="mb-12" id="empfehlungen">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Similar-Gigs-Algorithm (Empfehlungen)</h2>
            
            <p className="text-slate-700 mb-4">
              Wir nutzen einen Content-Based-Filtering-Algorithmus, um Ihnen ähnliche Gigs zu empfehlen. Der Algorithmus analysiert Gig-Metadaten (Kategorie, Tags, Preis, Lieferzeit, Rating) und berechnet einen Ähnlichkeits-Score (Jaccard-Similarity).
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">12.1 Datenverarbeitung</h3>
            <p className="text-slate-700 mb-4">
              Es werden <strong>keine personenbezogenen Daten</strong> verarbeitet. Der Algorithmus nutzt ausschließlich Gig-Metadaten (Titel, Beschreibung, Kategorie, Tags, Preis, Lieferzeit, Rating, Anzahl abgeschlossener Bestellungen).
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">12.2 Rechtsgrundlage</h3>
            <p className="text-slate-700">
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Verbesserung der Nutzererfahrung)
            </p>
          </section>

          {/* 13. DSGVO++ Features */}
          <section className="mb-12" id="dsgvo-plus">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">13. DSGVO++ Features</h2>
            
            <p className="text-slate-700 mb-4">
              Wir gehen über die gesetzlichen Anforderungen der DSGVO hinaus und bieten Ihnen erweiterte Datenschutz-Features:
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">13.1 Live Privacy Dashboard</h3>
            <p className="text-slate-700 mb-4">
              In unserem <Link href="/privacy-dashboard" className="text-blue-600 hover:underline">Live Privacy Dashboard</Link> können Sie in Echtzeit sehen, welche Daten wir über Sie gespeichert haben. Sie können Ihre Daten selektiv exportieren (JSON, CSV) oder Ihr Konto löschen.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">13.2 Datenexport (Art. 20 DSGVO)</h3>
            <p className="text-slate-700 mb-4">
              Sie können Ihre Daten jederzeit in einem maschinenlesbaren Format (JSON, CSV) exportieren. Der Export umfasst alle personenbezogenen Daten, die wir über Sie gespeichert haben (Nutzerkonto, Gigs, Bestellungen, Nachrichten, Bewertungen, Consent-Logs).
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">13.3 Account-Deletion mit 30-Tage-Grace-Period (Art. 17 DSGVO)</h3>
            <p className="text-slate-700 mb-4">
              Wenn Sie Ihr Konto löschen möchten, können Sie dies jederzeit im Privacy Dashboard tun. Wir gewähren Ihnen eine 30-tägige Wartezeit (Grace-Period), in der Sie die Löschung noch abbrechen können. Nach Ablauf der Frist werden Ihre Daten automatisch pseudonymisiert:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>Name → "DELETED_USER"</li>
              <li>E-Mail → null</li>
              <li>OpenID → <code>deleted_&#123;userId&#125;_&#123;timestamp&#125;</code></li>
            </ul>
            <p className="text-slate-700 mb-4">
              <strong>Hinweis:</strong> Transaktionsdaten (Bestellungen, Rechnungen) werden aus steuerrechtlichen Gründen 10 Jahre aufbewahrt, aber pseudonymisiert.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">13.4 Consent-Logs (Proof-of-Consent)</h3>
            <p className="text-slate-700">
              Alle Ihre Einwilligungsentscheidungen (Cookie-Consent, Analytics, Marketing) werden in Consent-Logs gespeichert, um unserer Nachweispflicht gemäß Art. 7 Abs. 1 DSGVO nachzukommen. Sie können Ihre Consent-Logs jederzeit im Privacy Dashboard einsehen.
            </p>
          </section>

          {/* 14. Speicherdauer & Löschung */}
          <section className="mb-12" id="speicherdauer">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">14. Speicherdauer & Löschung</h2>
            
            <p className="text-slate-700 mb-4">
              Wir speichern Ihre Daten nur so lange, wie es für die jeweiligen Zwecke erforderlich ist:
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-slate-200 rounded-lg">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 border-b">Datenart</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 border-b">Speicherdauer</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 border-b">Rechtsgrundlage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="px-4 py-3 text-sm text-slate-700">Kontodaten (users)</td>
                    <td className="px-4 py-3 text-sm text-slate-700">Bis zur Löschung des Kontos</td>
                    <td className="px-4 py-3 text-sm text-slate-700">Art. 6 Abs. 1 lit. b DSGVO</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-slate-700">Transaktionsdaten (transactions, orders)</td>
                    <td className="px-4 py-3 text-sm text-slate-700">10 Jahre</td>
                    <td className="px-4 py-3 text-sm text-slate-700">§ 147 AO (steuerrechtlich)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-slate-700">Nachrichten (messages)</td>
                    <td className="px-4 py-3 text-sm text-slate-700">Bis zur Löschung durch Nutzer</td>
                    <td className="px-4 py-3 text-sm text-slate-700">Art. 6 Abs. 1 lit. b DSGVO</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-slate-700">Consent-Logs (consent_logs)</td>
                    <td className="px-4 py-3 text-sm text-slate-700">12 Monate</td>
                    <td className="px-4 py-3 text-sm text-slate-700">Art. 7 Abs. 1 DSGVO</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-slate-700">Server-Logs</td>
                    <td className="px-4 py-3 text-sm text-slate-700">90 Tage</td>
                    <td className="px-4 py-3 text-sm text-slate-700">Art. 6 Abs. 1 lit. f DSGVO</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-slate-700">Account-Deletion-Requests</td>
                    <td className="px-4 py-3 text-sm text-slate-700">30 Tage Grace-Period</td>
                    <td className="px-4 py-3 text-sm text-slate-700">Art. 17 DSGVO</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 15. Betroffenenrechte */}
          <section className="mb-12" id="betroffenenrechte">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">15. Ihre Rechte als betroffene Person</h2>
            
            <p className="text-slate-700 mb-4">
              Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Auskunftsrecht (Art. 15 DSGVO)</h3>
                <p className="text-slate-700">
                  Sie können Auskunft über die von uns gespeicherten personenbezogenen Daten verlangen.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Berichtigungsrecht (Art. 16 DSGVO)</h3>
                <p className="text-slate-700">
                  Sie können die Berichtigung unrichtiger oder unvollständiger Daten verlangen.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Löschungsrecht (Art. 17 DSGVO)</h3>
                <p className="text-slate-700">
                  Sie können die Löschung Ihrer personenbezogenen Daten verlangen, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Einschränkungsrecht (Art. 18 DSGVO)</h3>
                <p className="text-slate-700">
                  Sie können die Einschränkung der Verarbeitung Ihrer Daten verlangen.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Widerspruchsrecht (Art. 21 DSGVO)</h3>
                <p className="text-slate-700">
                  Sie können der Verarbeitung Ihrer Daten widersprechen, wenn diese auf Grundlage eines berechtigten Interesses (Art. 6 Abs. 1 lit. f DSGVO) erfolgt.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Datenübertragbarkeit (Art. 20 DSGVO)</h3>
                <p className="text-slate-700">
                  Sie können Ihre Daten in einem strukturierten, gängigen und maschinenlesbaren Format erhalten.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Beschwerderecht (Art. 77 DSGVO)</h3>
                <p className="text-slate-700">
                  Sie können sich bei einer Datenschutz-Aufsichtsbehörde beschweren, wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer Daten gegen die DSGVO verstößt.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Self-Service-Tools</h3>
              <p className="text-slate-700 mb-4">
                Sie können Ihre Rechte direkt über unsere Self-Service-Tools ausüben:
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/privacy-dashboard">
                  <Button variant="outline" className="w-full sm:w-auto">
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Live Privacy Dashboard
                  </Button>
                </Link>
              </div>
              <p className="text-slate-700 mt-4 text-sm">
                Alternativ können Sie uns unter <a href="mailto:info@mimitechai.com" className="text-blue-600 hover:underline">info@mimitechai.com</a> oder telefonisch unter <a href="tel:+4915758805737" className="text-blue-600 hover:underline">+49 1575 8805737</a> kontaktieren.
              </p>
            </div>
          </section>

          {/* 16. Rechtsgrundlagen */}
          <section className="mb-12" id="rechtsgrundlagen">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">16. Rechtsgrundlagen der Verarbeitung</h2>
            
            <p className="text-slate-700 mb-4">
              Wir verarbeiten Ihre personenbezogenen Daten auf Grundlage folgender Rechtsgrundlagen:
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-slate-200 rounded-lg">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 border-b">Verarbeitungszweck</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 border-b">Rechtsgrundlage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="px-4 py-3 text-sm text-slate-700">Registrierung, Gig-Erstellung, Bestellungen</td>
                    <td className="px-4 py-3 text-sm text-slate-700">Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-slate-700">Zahlungsabwicklung (Stripe)</td>
                    <td className="px-4 py-3 text-sm text-slate-700">Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-slate-700">Messaging-System</td>
                    <td className="px-4 py-3 text-sm text-slate-700">Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-slate-700">Seller-Verifizierung</td>
                    <td className="px-4 py-3 text-sm text-slate-700">Art. 6 Abs. 1 lit. b + f DSGVO (Vertragserfüllung + berechtigtes Interesse)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-slate-700">Cookies (Notwendig)</td>
                    <td className="px-4 py-3 text-sm text-slate-700">Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-slate-700">Cookies (Funktional, Analytisch, Marketing)</td>
                    <td className="px-4 py-3 text-sm text-slate-700">Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-slate-700">Analytics (PostHog)</td>
                    <td className="px-4 py-3 text-sm text-slate-700">Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-slate-700">Error-Tracking (Sentry)</td>
                    <td className="px-4 py-3 text-sm text-slate-700">Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-slate-700">Exit-Intent-Modal (Telemetrie)</td>
                    <td className="px-4 py-3 text-sm text-slate-700">Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-slate-700">Similar-Gigs-Algorithm</td>
                    <td className="px-4 py-3 text-sm text-slate-700">Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-slate-700">Server-Logs</td>
                    <td className="px-4 py-3 text-sm text-slate-700">Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-slate-700">Consent-Logs</td>
                    <td className="px-4 py-3 text-sm text-slate-700">Art. 7 Abs. 1 DSGVO (Nachweispflicht)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 17. Drittlandübermittlung */}
          <section className="mb-12" id="drittland">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">17. Drittlandübermittlung</h2>
            
            <p className="text-slate-700 mb-4">
              Wir übermitteln personenbezogene Daten an folgende Drittland-Dienstleister:
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-slate-200 rounded-lg">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 border-b">Service</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 border-b">Land</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 border-b">Rechtsgrundlage</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 border-b">Schutzmaßnahmen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="px-4 py-3 text-sm text-slate-700">Stripe</td>
                    <td className="px-4 py-3 text-sm text-slate-700">USA</td>
                    <td className="px-4 py-3 text-sm text-slate-700">Art. 46 Abs. 2 lit. c DSGVO</td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Standard-Vertragsklauseln (SCC)</a>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-slate-700">PostHog (geplant)</td>
                    <td className="px-4 py-3 text-sm text-slate-700">USA</td>
                    <td className="px-4 py-3 text-sm text-slate-700">Art. 46 Abs. 2 lit. c DSGVO</td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Standard-Vertragsklauseln (SCC)</a>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-slate-700">Sentry (geplant)</td>
                    <td className="px-4 py-3 text-sm text-slate-700">USA</td>
                    <td className="px-4 py-3 text-sm text-slate-700">Art. 46 Abs. 2 lit. c DSGVO</td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      <a href="https://sentry.io/privacy/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Standard-Vertragsklauseln (SCC)</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 18. Sicherheitsmaßnahmen */}
          <section className="mb-12" id="sicherheit">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">18. Sicherheitsmaßnahmen</h2>
            
            <p className="text-slate-700 mb-4">
              Wir setzen technische und organisatorische Sicherheitsmaßnahmen ein, um Ihre Daten vor unbefugtem Zugriff, Verlust oder Zerstörung zu schützen:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li><strong>SSL/TLS-Verschlüsselung:</strong> Alle Datenübertragungen erfolgen verschlüsselt</li>
              <li><strong>Passwort-Hashing:</strong> Passwörter werden niemals im Klartext gespeichert, sondern ausschließlich gehasht (bcrypt/argon2)</li>
              <li><strong>CSRF-Protection:</strong> Schutz vor Cross-Site-Request-Forgery-Angriffen</li>
              <li><strong>Rate-Limiting:</strong> Schutz vor Brute-Force-Angriffen</li>
              <li><strong>Content-Security-Policy:</strong> Schutz vor Cross-Site-Scripting (XSS)</li>
              <li><strong>File-Upload-Validation:</strong> Überprüfung hochgeladener Dateien auf Schadcode</li>
              <li><strong>Regelmäßige Sicherheitsupdates:</strong> Alle Systeme werden regelmäßig aktualisiert</li>
              <li><strong>Zugriffsbeschränkungen:</strong> Nur autorisierte Mitarbeiter haben Zugriff auf personenbezogene Daten</li>
              <li><strong>Regelmäßige Backups:</strong> Automatische Backups gewährleisten die Verfügbarkeit Ihrer Daten</li>
            </ul>
          </section>

          {/* 19. Änderungen der Datenschutzerklärung */}
          <section className="mb-12" id="aenderungen">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">19. Änderungen der Datenschutzerklärung</h2>
            
            <p className="text-slate-700 mb-4">
              Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an geänderte Rechtslagen oder Änderungen unserer Dienstleistungen anzupassen. Die aktuelle Datenschutzerklärung ist stets auf unserer Website verfügbar.
            </p>
            <p className="text-slate-700">
              Bei wesentlichen Änderungen werden wir Sie per E-Mail oder über einen Hinweis auf unserer Website informieren.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
