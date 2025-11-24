/**
 * Platform Analytics Dashboard (Admin Only)
 * 
 * Shows:
 * - Platform fees collected
 * - Seller payouts
 * - Revenue breakdown
 * - Top sellers by revenue
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, TrendingUp, Users, Wallet } from "lucide-react";
import { useLocation } from "wouter";

export default function PlatformAnalytics() {
  const { user, loading: authLoading } = useAuth();
  
  // Fetch platform analytics
  const { data: analytics, isLoading } = trpc.analytics.getPlatformSummary.useQuery();

  // Only admins can access this page
  if (authLoading) {
    return <AnalyticsSkeleton />;
  }

  const [, setLocation] = useLocation();

  if (!user || user.role !== 'admin') {
    setLocation('/');
    return null;
  }

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  if (!analytics) {
    return (
      <div className="container max-w-7xl py-8">
        <Alert>
          <AlertDescription>Keine Analytics-Daten verfügbar.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const { allTime, last30Days, last7Days, payouts } = analytics;

  return (
    <div className="container max-w-7xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Platform Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Übersicht über Plattform-Gebühren, Seller-Payouts und Umsatzentwicklung
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamtumsatz</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{(allTime.totalRevenue / 100).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {allTime.transactionCount} Transaktionen
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plattform-Gebühren</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              €{(allTime.platformFees / 100).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              15% von Gesamtumsatz
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seller-Auszahlungen</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{(allTime.sellerPayouts / 100).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              85% an Seller
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Durchschnittlicher Auftrag</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{(allTime.averageOrderValue / 100).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Pro Transaktion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Time Period Breakdown */}
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Letzte 30 Tage</CardTitle>
            <CardDescription>Umsatz und Gebühren der letzten 30 Tage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Gesamtumsatz</span>
                <span className="font-semibold">€{(last30Days.totalRevenue / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Plattform-Gebühren</span>
                <span className="font-semibold text-green-600">€{(last30Days.platformFees / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Seller-Auszahlungen</span>
                <span className="font-semibold">€{(last30Days.sellerPayouts / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Transaktionen</span>
                <span className="font-semibold">{last30Days.transactionCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Letzte 7 Tage</CardTitle>
            <CardDescription>Umsatz und Gebühren der letzten 7 Tage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Gesamtumsatz</span>
                <span className="font-semibold">€{(last7Days.totalRevenue / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Plattform-Gebühren</span>
                <span className="font-semibold text-green-600">€{(last7Days.platformFees / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Seller-Auszahlungen</span>
                <span className="font-semibold">€{(last7Days.sellerPayouts / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Transaktionen</span>
                <span className="font-semibold">{last7Days.transactionCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payout Statistics */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Seller & Auszahlungen
          </CardTitle>
          <CardDescription>Übersicht über Seller-Stripe-Konten und Auszahlungen</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Seller gesamt</p>
              <p className="text-3xl font-bold">{payouts.totalSellers}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Mit Stripe Connect</p>
              <p className="text-3xl font-bold text-green-600">{payouts.sellersWithStripe}</p>
              <p className="text-xs text-muted-foreground">
                {payouts.totalSellers > 0 
                  ? `${Math.round((payouts.sellersWithStripe / payouts.totalSellers) * 100)}%`
                  : '0%'}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Ohne Stripe Connect</p>
              <p className="text-3xl font-bold text-orange-600">{payouts.sellersWithoutStripe}</p>
              <p className="text-xs text-muted-foreground">
                Manuelle Auszahlung erforderlich
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Auszahlungen gesamt</p>
              <p className="text-2xl font-bold">€{(payouts.totalPayouts / 100).toFixed(2)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Automatisch (Stripe)</p>
              <p className="text-2xl font-bold text-green-600">€{(payouts.completedPayouts / 100).toFixed(2)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Ausstehend (Manuell)</p>
              <p className="text-2xl font-bold text-orange-600">€{(payouts.pendingPayouts / 100).toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Sellers */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Seller nach Umsatz</CardTitle>
          <CardDescription>Seller mit den höchsten Gesamtumsätzen (All-Time)</CardDescription>
        </CardHeader>
        <CardContent>
          {allTime.topSellersByRevenue.length === 0 ? (
            <p className="text-sm text-muted-foreground">Noch keine Seller-Daten verfügbar.</p>
          ) : (
            <div className="space-y-4">
              {allTime.topSellersByRevenue.map((seller: any, index: number) => (
                <div key={seller.sellerId} className="flex items-center justify-between pb-3 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{seller.sellerName || `Seller #${seller.sellerId}`}</p>
                      <p className="text-xs text-muted-foreground">{seller.orderCount} Aufträge</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">€{(seller.totalRevenue / 100).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">
                      Plattform: €{(seller.platformFees / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="container max-w-7xl py-8">
      <div className="mb-8">
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
