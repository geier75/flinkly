import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { APP_TITLE } from "@/const";

export default function Widerruf() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Widerrufsbelehrung</CardTitle>
            <p className="text-sm text-slate-600">Stand: 13. November 2025</p>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none">
            
            <h2>Widerrufsrecht</h2>
            <p>
              Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag 
              zu widerrufen.
            </p>

            <p>
              Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsschlusses.
            </p>

            <p>
              Um Ihr Widerrufsrecht auszuüben, müssen Sie uns
            </p>

            <div className="bg-slate-100 p-4 rounded-lg my-4">
              <strong>{APP_TITLE}</strong><br />
              [Vollständige Firmenanschrift einfügen]<br />
              E-Mail: support@flinkly.com<br />
              Telefon: [Telefonnummer einfügen]
            </div>

            <p>
              mittels einer eindeutigen Erklärung (z.B. ein mit der Post versandter Brief oder 
              E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können 
              dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.
            </p>

            <Separator className="my-6" />

            <h3>Widerrufsfolgen</h3>
            <p>
              Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen 
              erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, 
              die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns 
              angebotene, günstigste Standardlieferung gewählt haben), unverzüglich und spätestens 
              binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren 
              Widerruf dieses Vertrags bei uns eingegangen ist.
            </p>

            <p>
              Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der 
              ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich 
              etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte 
              berechnet.
            </p>

            <Separator className="my-6" />

            <h3>Besonderheit bei Dienstleistungen</h3>
            <p>
              Haben Sie verlangt, dass die Dienstleistungen während der Widerrufsfrist beginnen soll, 
              so haben Sie uns einen angemessenen Betrag zu zahlen, der dem Anteil der bis zu dem 
              Zeitpunkt, zu dem Sie uns von der Ausübung des Widerrufsrechts hinsichtlich dieses 
              Vertrags unterrichten, bereits erbrachten Dienstleistungen im Vergleich zum Gesamtumfang 
              der im Vertrag vorgesehenen Dienstleistungen entspricht.
            </p>

            <Separator className="my-6" />

            <h2>Erlöschen des Widerrufsrechts</h2>
            <p>
              Das Widerrufsrecht erlischt bei einem Vertrag über die Erbringung von Dienstleistungen, 
              wenn der Unternehmer die Dienstleistung vollständig erbracht hat und mit der Ausführung 
              der Dienstleistung erst begonnen hat, nachdem der Verbraucher dazu seine ausdrückliche 
              Zustimmung gegeben hat und gleichzeitig seine Kenntnis davon bestätigt hat, dass er sein 
              Widerrufsrecht bei vollständiger Vertragserfüllung durch den Unternehmer verliert.
            </p>

            <Separator className="my-6" />

            <h2>Muster-Widerrufsformular</h2>
            <div className="bg-slate-100 p-6 rounded-lg my-4">
              <p className="text-sm text-slate-600 mb-4">
                (Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus 
                und senden Sie es zurück.)
              </p>

              <div className="space-y-4">
                <p>
                  An<br />
                  <strong>{APP_TITLE}</strong><br />
                  [Vollständige Firmenanschrift einfügen]<br />
                  E-Mail: support@flinkly.com
                </p>

                <p>
                  Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über 
                  die Erbringung der folgenden Dienstleistung:
                </p>

                <p>
                  _____________________________________________
                </p>

                <p>
                  Bestellt am (*) / erhalten am (*):
                </p>

                <p>
                  _____________________________________________
                </p>

                <p>
                  Name des/der Verbraucher(s):
                </p>

                <p>
                  _____________________________________________
                </p>

                <p>
                  Anschrift des/der Verbraucher(s):
                </p>

                <p>
                  _____________________________________________
                </p>

                <p>
                  Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):
                </p>

                <p>
                  _____________________________________________
                </p>

                <p>
                  Datum:
                </p>

                <p>
                  _____________________________________________
                </p>

                <p className="text-xs text-slate-500 mt-4">
                  (*) Unzutreffendes streichen.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <Button 
                onClick={() => window.print()} 
                variant="outline"
                className="mr-4"
              >
                Formular drucken
              </Button>
              <Button 
                onClick={() => window.location.href = "mailto:support@flinkly.com?subject=Widerruf&body=Hiermit widerrufe ich den von mir abgeschlossenen Vertrag..."}
                variant="default"
              >
                Per E-Mail widerrufen
              </Button>
            </div>

            <Separator className="my-6" />

            <div className="bg-blue-50 p-4 rounded-lg mt-8">
              <p className="text-sm text-slate-600">
                <strong>Hinweis:</strong> Diese Widerrufsbelehrung entspricht den gesetzlichen 
                Anforderungen nach § 312g BGB i.V.m. Art. 246a § 1 Abs. 2 EGBGB. Sie sollte dennoch 
                von einem Fachanwalt geprüft werden.
              </p>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
