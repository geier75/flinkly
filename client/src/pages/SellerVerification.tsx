/**
 * Seller Verification Page
 * 
 * Features:
 * - Email verification
 * - Phone verification (optional)
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
import { CheckCircle2, XCircle, Mail, Phone, Shield, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SellerVerification() {
  const { data: user } = trpc.auth.me.useQuery();
  const { data: verificationStatus, refetch } = trpc.verification.getVerificationStatus.useQuery();
  
  const [emailToken, setEmailToken] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [showPhoneInput, setShowPhoneInput] = useState(false);

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
        <h1 className="text-3xl font-bold mb-2">Seller-Verifizierung</h1>
        <p className="text-muted-foreground">
          Verifizieren Sie Ihren Account, um das Vertrauen von Käufern zu erhöhen
        </p>
      </div>

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
      </div>
    </div>
  );
}
