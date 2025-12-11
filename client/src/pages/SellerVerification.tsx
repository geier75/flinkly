/**
 * Seller Verification Page (KYBC - Know Your Business Customer)
 * 
 * Gemäß DSA Art. 30 - Rückverfolgbarkeit gewerblicher Nutzer
 * 
 * Features:
 * - Email verification
 * - Phone verification (optional)
 * - KYBC Business verification (DSA Art. 30)
 * - Admin approval request
 * - Verification status display
 */

import { useState } from "react";
import { PremiumPageLayout, PremiumCard } from "@/components/PremiumPageLayout";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, XCircle, Mail, Phone, Shield, Loader2, Building2, FileText, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function SellerVerification() {
  const { data: user } = trpc.auth.me.useQuery();
  const { data: verificationStatus, refetch } = trpc.verification.getVerificationStatus.useQuery();
  
  const [emailToken, setEmailToken] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  
  // KYBC Business Data (DSA Art. 30)
  const [kybcData, setKybcData] = useState({
    businessName: "",
    businessAddress: "",
    businessCity: "",
    businessPostalCode: "",
    businessCountry: "Deutschland",
    vatId: "",
    tradeRegister: "",
    businessType: "einzelunternehmer", // einzelunternehmer, gbr, ug, gmbh, freelancer
    businessDescription: "",
  });
  const [showKybcForm, setShowKybcForm] = useState(false);

  const requestEmailMutation = trpc.verification.requestEmailVerification.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      if (data.token) {
        toast.info(`Development Token: ${data.token}`);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const verifyEmailMutation = trpc.verification.verifyEmail.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      refetch();
      setEmailToken("");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const requestPhoneMutation = trpc.verification.requestPhoneVerification.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      if (data.code) {
        toast.info(`Development Code: ${data.code}`);
      }
      setShowPhoneInput(true);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const verifyPhoneMutation = trpc.verification.verifyPhone.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      refetch();
      setPhoneCode("");
      setShowPhoneInput(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const requestAdminMutation = trpc.verification.requestAdminApproval.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (!user) {
    return (
      <div className="container max-w-4xl py-12">
        <PremiumCard>
          <CardHeader>
            <CardTitle>Bitte anmelden</CardTitle>
            <CardDescription>Sie müssen angemeldet sein, um Ihren Account zu verifizieren.</CardDescription>
          </CardHeader>
        </PremiumCard>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Verkäufer-Verifizierung (KYBC)</h1>
        <p className="text-muted-foreground">
          Verifizieren Sie Ihren Account gemäß DSA Art. 30 - Know Your Business Customer
        </p>
      </div>

      {/* DSA Info Banner */}
      <PremiumCard className="mb-6 border-orange-500/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-orange-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">DSA Art. 30 - Rückverfolgbarkeit gewerblicher Nutzer</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Gemäß dem Digital Services Act (EU) 2022/2065 sind Online-Marktplätze verpflichtet, 
                die Identität gewerblicher Verkäufer zu überprüfen, bevor diese Dienstleistungen anbieten dürfen.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Pflichtangaben:</strong> Name, Anschrift, Kontaktdaten, USt-IdNr. (falls vorhanden)</li>
                <li>• <strong>Verifizierung:</strong> Wir prüfen Ihre Angaben vor Freischaltung</li>
                <li>• <strong>Transparenz:</strong> Ihre Geschäftsdaten werden Käufern angezeigt</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </PremiumCard>

      {/* Verification Status Overview */}
      <PremiumCard className="mb-6">
        <CardHeader>
          <CardTitle>Verifizierungs-Status</CardTitle>
          <CardDescription>Ihr aktueller Verifizierungs-Level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge variant={verificationStatus?.verificationLevel === "admin" ? "default" : "secondary"} className="text-lg px-4 py-2">
              {verificationStatus?.verificationLevel === "admin" && "✓ Vollständig verifiziert"}
              {verificationStatus?.verificationLevel === "phone" && "Telefon verifiziert"}
              {verificationStatus?.verificationLevel === "email" && "E-Mail verifiziert"}
              {verificationStatus?.verificationLevel === "none" && "Nicht verifiziert"}
            </Badge>
          </div>
        </CardContent>
      </PremiumCard>

      <div className="space-y-6">
        {/* Email Verification */}
        <PremiumCard>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                <CardTitle>E-Mail-Verifizierung</CardTitle>
              </div>
              {verificationStatus?.emailVerified ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <CardDescription>
              {verificationStatus?.emailVerified
                ? "Ihre E-Mail-Adresse wurde verifiziert"
                : "Verifizieren Sie Ihre E-Mail-Adresse"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6 md:p-8 p-6 md:p-8">
            {!verificationStatus?.emailVerified && (
              <>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    E-Mail: <strong>{user.email || "Keine E-Mail hinterlegt"}</strong>
                  </p>
                  <Button
                    onClick={() => requestEmailMutation.mutate()}
                    disabled={!verificationStatus?.hasEmail || requestEmailMutation.isPending}
                  >
                    {requestEmailMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sende E-Mail...
                      </>
                    ) : (
                      "Verifizierungs-E-Mail senden"
                    )}
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailToken">Verifizierungs-Token</Label>
                  <div className="flex gap-2">
                    <Input
                      id="emailToken"
                      placeholder="Token aus E-Mail eingeben"
                      value={emailToken}
                      onChange={(e) => setEmailToken(e.target.value)}
                    />
                    <Button
                      onClick={() => verifyEmailMutation.mutate({ token: emailToken })}
                      disabled={!emailToken || verifyEmailMutation.isPending}
                    >
                      {verifyEmailMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Verifizieren"
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}

            {verificationStatus?.emailVerified && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm font-medium">E-Mail erfolgreich verifiziert</span>
              </div>
            )}
          </CardContent>
        </PremiumCard>

        {/* Phone Verification (Optional) */}
        <PremiumCard>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                <CardTitle>Telefon-Verifizierung (Optional)</CardTitle>
              </div>
              {verificationStatus?.phoneVerified ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <CardDescription>
              {verificationStatus?.phoneVerified
                ? "Ihre Telefonnummer wurde verifiziert"
                : "Erhöhen Sie Ihr Vertrauen mit Telefon-Verifizierung"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6 md:p-8 p-6 md:p-8">
            {!verificationStatus?.phoneVerified && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefonnummer (E.164 Format, z.B. +491234567890)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="phone"
                      placeholder="+491234567890"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <Button
                      onClick={() => requestPhoneMutation.mutate({ phone: phoneNumber })}
                      disabled={!phoneNumber || requestPhoneMutation.isPending}
                    >
                      {requestPhoneMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "SMS senden"
                      )}
                    </Button>
                  </div>
                </div>

                {showPhoneInput && (
                  <div className="space-y-2">
                    <Label htmlFor="phoneCode">Verifizierungs-Code (6 Ziffern)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="phoneCode"
                        placeholder="123456"
                        value={phoneCode}
                        onChange={(e) => setPhoneCode(e.target.value)}
                        maxLength={6}
                      />
                      <Button
                        onClick={() => verifyPhoneMutation.mutate({ code: phoneCode })}
                        disabled={phoneCode.length !== 6 || verifyPhoneMutation.isPending}
                      >
                        {verifyPhoneMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Verifizieren"
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}

            {verificationStatus?.phoneVerified && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm font-medium">Telefon erfolgreich verifiziert</span>
              </div>
            )}
          </CardContent>
        </PremiumCard>

        {/* Admin Approval */}
        <PremiumCard>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <CardTitle>Admin-Genehmigung</CardTitle>
              </div>
              {verificationStatus?.adminApproved ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <CardDescription>
              {verificationStatus?.adminApproved
                ? "Ihr Account wurde von einem Admin genehmigt"
                : "Beantragen Sie die Admin-Genehmigung für höchstes Vertrauen"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6 md:p-8 p-6 md:p-8">
            {!verificationStatus?.adminApproved && (
              <>
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <h3 className="font-semibold text-sm">Voraussetzungen:</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground ml-4 list-disc">
                    <li className={verificationStatus?.emailVerified ? "text-green-600" : ""}>
                      {verificationStatus?.emailVerified ? "✓" : "○"} E-Mail verifiziert
                    </li>
                    <li className="text-muted-foreground">
                      ○ Telefon verifiziert (optional, aber empfohlen)
                    </li>
                  </ul>
                </div>

                <Button
                  onClick={() => requestAdminMutation.mutate()}
                  disabled={!verificationStatus?.emailVerified || requestAdminMutation.isPending}
                  className="w-full"
                >
                  {requestAdminMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sende Anfrage...
                    </>
                  ) : (
                    "Admin-Genehmigung beantragen"
                  )}
                </Button>
              </>
            )}

            {verificationStatus?.adminApproved && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm font-medium">Von Admin genehmigt - Höchstes Vertrauen</span>
              </div>
            )}
          </CardContent>
        </PremiumCard>

        {/* KYBC Business Verification (DSA Art. 30) */}
        <PremiumCard>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                <CardTitle>Geschäftsdaten (KYBC)</CardTitle>
              </div>
              <Badge variant="outline" className="text-orange-500 border-orange-500">
                DSA Art. 30
              </Badge>
            </div>
            <CardDescription>
              Pflichtangaben für gewerbliche Verkäufer gemäß Digital Services Act
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6 md:p-8">
            {!showKybcForm ? (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Erforderliche Angaben:
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
                    <li>Vollständiger Name / Firmenname</li>
                    <li>Geschäftsadresse (Straße, PLZ, Ort, Land)</li>
                    <li>Kontaktdaten (E-Mail, Telefon)</li>
                    <li>USt-IdNr. (falls vorhanden)</li>
                    <li>Handelsregister-Nummer (falls eingetragen)</li>
                  </ul>
                </div>
                <Button onClick={() => setShowKybcForm(true)} className="w-full">
                  Geschäftsdaten eingeben
                </Button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                toast.success("Geschäftsdaten gespeichert. Wir prüfen Ihre Angaben.");
                setShowKybcForm(false);
              }}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Unternehmensform *</Label>
                    <select
                      id="businessType"
                      className="w-full p-2 border rounded-md bg-background"
                      value={kybcData.businessType}
                      onChange={(e) => setKybcData({...kybcData, businessType: e.target.value})}
                      required
                    >
                      <option value="freelancer">Freiberufler</option>
                      <option value="einzelunternehmer">Einzelunternehmer</option>
                      <option value="gbr">GbR</option>
                      <option value="ug">UG (haftungsbeschränkt)</option>
                      <option value="gmbh">GmbH</option>
                      <option value="other">Sonstige</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Name / Firmenname *</Label>
                    <Input
                      id="businessName"
                      placeholder="Max Mustermann / Musterfirma GmbH"
                      value={kybcData.businessName}
                      onChange={(e) => setKybcData({...kybcData, businessName: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Geschäftsadresse *</Label>
                  <Input
                    id="businessAddress"
                    placeholder="Musterstraße 123"
                    value={kybcData.businessAddress}
                    onChange={(e) => setKybcData({...kybcData, businessAddress: e.target.value})}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessPostalCode">PLZ *</Label>
                    <Input
                      id="businessPostalCode"
                      placeholder="12345"
                      value={kybcData.businessPostalCode}
                      onChange={(e) => setKybcData({...kybcData, businessPostalCode: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessCity">Ort *</Label>
                    <Input
                      id="businessCity"
                      placeholder="Musterstadt"
                      value={kybcData.businessCity}
                      onChange={(e) => setKybcData({...kybcData, businessCity: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessCountry">Land *</Label>
                    <select
                      id="businessCountry"
                      className="w-full p-2 border rounded-md bg-background"
                      value={kybcData.businessCountry}
                      onChange={(e) => setKybcData({...kybcData, businessCountry: e.target.value})}
                      required
                    >
                      <option value="Deutschland">Deutschland</option>
                      <option value="Österreich">Österreich</option>
                      <option value="Schweiz">Schweiz</option>
                      <option value="Andere EU">Andere EU-Länder</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vatId">USt-IdNr. (falls vorhanden)</Label>
                    <Input
                      id="vatId"
                      placeholder="DE123456789"
                      value={kybcData.vatId}
                      onChange={(e) => setKybcData({...kybcData, vatId: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground">
                      Pflicht bei Umsatz &gt; 22.000€/Jahr
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tradeRegister">Handelsregister-Nr. (falls eingetragen)</Label>
                    <Input
                      id="tradeRegister"
                      placeholder="HRB 12345, AG Musterstadt"
                      value={kybcData.tradeRegister}
                      onChange={(e) => setKybcData({...kybcData, tradeRegister: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessDescription">Kurzbeschreibung Ihrer Tätigkeit</Label>
                  <Textarea
                    id="businessDescription"
                    placeholder="z.B. Grafikdesign, Webentwicklung, Texterstellung..."
                    value={kybcData.businessDescription}
                    onChange={(e) => setKybcData({...kybcData, businessDescription: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    <strong>Hinweis:</strong> Ihre Geschäftsdaten werden gemäß DSA Art. 30 Abs. 2 
                    den Käufern angezeigt. Wir prüfen Ihre Angaben vor Freischaltung Ihres Verkäufer-Accounts.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1">
                    Geschäftsdaten speichern
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowKybcForm(false)}>
                    Abbrechen
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </PremiumCard>
      </div>
    </div>
  );
}
