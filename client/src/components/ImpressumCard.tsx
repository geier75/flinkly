import { Card, CardContent } from "@/components/ui/card";
import { Building2, Mail, Phone, MapPin, FileText } from "lucide-react";

interface ImpressumCardProps {
  companyName: string;
  companyAddress: string;
  email?: string;
  phone?: string;
  taxId?: string;
  tradeRegister?: string;
  ownerName?: string;
}

/**
 * Impressum-Card für gewerbliche Seller
 * Design inspiriert von mimitechai.com (Cyan-Akzent, dunkler Hintergrund)
 * § 5 TMG Impressumspflicht
 */
export function ImpressumCard({
  companyName,
  companyAddress,
  email,
  phone,
  taxId,
  tradeRegister,
  ownerName,
}: ImpressumCardProps) {
  return (
    <Card className="bg-slate-900/40 border-2 border-slate-700/50 backdrop-blur-xl">
      <CardContent className="p-6">
        {/* Header mit Cyan-Akzent (MiMi Tech AI Style) */}
        <div className="flex items-center gap-3 mb-6">
          <Building2 className="h-6 w-6 text-cyan-400" />
          <h3 className="text-xl font-bold text-white">Impressum</h3>
        </div>

        {/* Firmendaten */}
        <div className="space-y-4">
          {/* Firmenname */}
          <div>
            <div className="text-sm text-slate-400 mb-1">Firma</div>
            <div className="text-white font-semibold">{companyName}</div>
          </div>

          {/* Geschäftsführer/Inhaber */}
          {ownerName && (
            <div>
              <div className="text-sm text-slate-400 mb-1">Geschäftsführer</div>
              <div className="text-white font-semibold">{ownerName}</div>
            </div>
          )}

          {/* Adresse */}
          <div>
            <div className="text-sm text-slate-400 mb-1 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Anschrift
            </div>
            <div className="text-slate-300 whitespace-pre-line">{companyAddress}</div>
          </div>

          {/* Kontakt */}
          {(email || phone) && (
            <div className="border-t border-slate-700/50 pt-4 space-y-3">
              {email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-cyan-400" />
                  <a
                    href={`mailto:${email}`}
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    {email}
                  </a>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-cyan-400" />
                  <a
                    href={`tel:${phone}`}
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    {phone}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Rechtliche Angaben */}
          {(taxId || tradeRegister) && (
            <div className="border-t border-slate-700/50 pt-4 space-y-3">
              {taxId && (
                <div>
                  <div className="text-sm text-slate-400 mb-1">Umsatzsteuer-ID</div>
                  <div className="text-slate-300 font-mono text-sm">{taxId}</div>
                </div>
              )}
              {tradeRegister && (
                <div>
                  <div className="text-sm text-slate-400 mb-1 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Handelsregister
                  </div>
                  <div className="text-slate-300 text-sm">{tradeRegister}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Rechtlicher Hinweis */}
        <div className="mt-6 pt-4 border-t border-slate-700/50">
          <p className="text-xs text-slate-400">
            Angaben gemäß § 5 TMG (Telemediengesetz)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
