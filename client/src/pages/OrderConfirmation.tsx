import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Clock,
  MessageCircle,
  Download,
  ArrowRight,
  Shield,
  Calendar,
  User,
  Package,
  Loader2,
} from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function OrderConfirmation() {
  const [, params] = useRoute("/order/confirmation/:orderId");
  const orderId = params?.orderId ? parseInt(params.orderId) : null;

  const { data: order, isLoading, error } = trpc.orders.getById.useQuery(
    { orderId: orderId! },
    { enabled: !!orderId }
  );

  const { data: similarGigs } = trpc.similarGigs.byGigId.useQuery(
    { gigId: order?.gigId || 0, k: 3 },
    { enabled: !!order?.gigId }
  );

  useEffect(() => {
    if (order) {
      // Track conversion
      if ((window as any).gtag) {
        (window as any).gtag("event", "purchase", {
          transaction_id: order.id,
          value: order.totalPrice / 100,
          currency: "EUR",
          items: [
            {
              item_id: order.gigId,
              item_name: order.gig?.title,
              price: order.totalPrice / 100,
            },
          ],
        });
      }
    }
  }, [order]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Card className="p-8 max-w-md">
          <p className="text-red-600">Bestellung nicht gefunden.</p>
          <Link href="/marketplace">
            <Button className="mt-4">Zurück zum Marketplace</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const deliveryDate = new Date(order.createdAt);
  deliveryDate.setDate(deliveryDate.getDate() + (order.gig?.deliveryDays || 3));

  const timeline = [
    {
      icon: CheckCircle,
      title: "Bestellung bestätigt",
      description: "Deine Zahlung wurde erfolgreich verarbeitet",
      status: "completed",
      time: "Jetzt",
    },
    {
      icon: User,
      title: "Seller benachrichtigt",
      description: `${order.seller?.name} wurde über deine Bestellung informiert`,
      status: "completed",
      time: "Innerhalb 5 Min",
    },
    {
      icon: MessageCircle,
      title: "Kommunikation starten",
      description: "Besprich Details direkt mit dem Seller",
      status: "current",
      time: "Jederzeit",
    },
    {
      icon: Package,
      title: "Lieferung erhalten",
      description: "Der Seller liefert deine Dateien",
      status: "pending",
      time: `Bis ${deliveryDate.toLocaleDateString("de-DE")}`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              FLINKLY
            </span>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline">Zum Dashboard</Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Success Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 mb-6">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Bestellung erfolgreich!
          </h1>
          <p className="text-xl text-slate-300 mb-2">
            Deine Bestellung #{order.id} wurde bestätigt
          </p>
          <p className="text-slate-400">
            Eine Bestätigungs-Email wurde an deine Email-Adresse gesendet
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Order Details + Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Details Card */}
            <Card className="p-6 bg-slate-800/50 border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-emerald-400" />
                Bestelldetails
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <img
                    src={order.gig?.imageUrl || "/placeholder.svg"}
                    alt={order.gig?.title}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">
                      {order.gig?.title}
                    </h3>
                    <p className="text-sm text-slate-400 mb-2">
                      von {order.seller?.name}
                    </p>
                    <Badge variant="secondary">Standard</Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">
                      {(order.totalPrice / 100).toFixed(2)}€
                    </p>
                    <p className="text-sm text-slate-400">inkl. MwSt.</p>
                  </div>
                </div>

                <Separator className="bg-slate-700" />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400 mb-1">Bestellnummer</p>
                    <p className="text-white font-medium">#{order.id}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-1">Bestelldatum</p>
                    <p className="text-white font-medium">
                      {new Date(order.createdAt).toLocaleDateString("de-DE")}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-1">Lieferzeit</p>
                    <p className="text-white font-medium">
                      {order.gig?.deliveryDays} Tage
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-1">Voraussichtlich bis</p>
                    <p className="text-white font-medium">
                      {deliveryDate.toLocaleDateString("de-DE")}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Timeline Card */}
            <Card className="p-6 bg-slate-800/50 border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Clock className="h-5 w-5 text-emerald-400" />
                Was passiert als nächstes?
              </h2>
              <div className="space-y-6">
                {timeline.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="flex gap-4">
                      <div className="relative">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            step.status === "completed"
                              ? "bg-emerald-500"
                              : step.status === "current"
                              ? "bg-blue-500"
                              : "bg-slate-700"
                          }`}
                        >
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        {index < timeline.length - 1 && (
                          <div className="absolute top-10 left-5 w-0.5 h-12 bg-slate-700" />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-white">
                            {step.title}
                          </h3>
                          <span className="text-sm text-slate-400">
                            {step.time}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Upsell: Similar Gigs */}
            {similarGigs && similarGigs.length > 0 && (
              <Card className="p-6 bg-slate-800/50 border-slate-700">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Das könnte dich auch interessieren
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {similarGigs.map((gig: any) => (
                    <Link key={gig.id} href={`/gig/${gig.id}`}>
                      <Card className="group cursor-pointer hover:border-emerald-400 transition-all">
                        <img
                          src={gig.images?.[0] || "/placeholder.svg"}
                          alt={gig.title}
                          className="w-full h-32 object-cover rounded-t-lg"
                        />
                        <div className="p-3">
                          <h3 className="font-medium text-white text-sm mb-2 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                            {gig.title}
                          </h3>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-400">
                              ab {gig.priceBasic}€
                            </span>
                            <ArrowRight className="h-4 w-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column: Quick Actions */}
          <div className="space-y-6">
            {/* Contact Seller Card */}
            <Card className="p-6 bg-slate-800/50 border-slate-700">
              <h3 className="font-semibold text-white mb-4">
                Kontakt zum Seller
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-white font-semibold">
                    {order.seller?.name?.charAt(0) || "S"}
                </div>
                <div>
                  <p className="font-medium text-white">
                    {order.seller?.name}
                  </p>
                  <p className="text-sm text-slate-400">
                    Antwortet in &lt; 1 Std.
                  </p>
                </div>
              </div>
              <Link href={`/messages/${order.sellerId}`}>
                <Button className="w-full" variant="default">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Nachricht senden
                </Button>
              </Link>
            </Card>

            {/* Security Card */}
            <Card className="p-6 bg-slate-800/50 border-slate-700">
              <div className="flex items-start gap-3 mb-4">
                <Shield className="h-6 w-6 text-emerald-400 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-white mb-2">
                    Käuferschutz aktiv
                  </h3>
                  <p className="text-sm text-slate-400">
                    Dein Geld ist sicher verwahrt, bis du die Lieferung
                    abgenommen hast. Bei Problemen kannst du eine Rückerstattung
                    beantragen.
                  </p>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 bg-slate-800/50 border-slate-700">
              <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link href="/dashboard/orders">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="h-4 w-4 mr-2" />
                    Meine Bestellungen
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    window.print();
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Rechnung herunterladen
                </Button>
                <Link href="/marketplace">
                  <Button variant="outline" className="w-full justify-start">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Weiter einkaufen
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
