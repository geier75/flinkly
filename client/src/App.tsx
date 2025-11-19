import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Onboarding from "./components/Onboarding";
import GlobalHeader from "./components/GlobalHeader";
import MobileActionBar from "./components/MobileActionBar";
import CookieConsent from "./components/CookieConsent";
import Footer from "./components/Footer";
import SkipLink from "./components/SkipLink";
import { lazy, Suspense } from "react";
import Home from "./pages/Home";

// Code-Splitting: Lazy-load non-critical pages
const Marketplace = lazy(() => import("./pages/Marketplace"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const GigDetail = lazy(() => import("./pages/GigDetail"));
const CreateGig = lazy(() => import("./pages/CreateGig"));
const EditGig = lazy(() => import("./pages/EditGig"));
const Profile = lazy(() => import("./pages/Profile"));
const About = lazy(() => import("./pages/About"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Contact = lazy(() => import("./pages/Contact"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Impressum = lazy(() => import("./pages/Impressum"));
const Widerruf = lazy(() => import("./pages/Widerruf"));
const OrderDetail = lazy(() => import("./pages/OrderDetail"));
const Settings = lazy(() => import("./pages/Settings"));
const Checkout = lazy(() => import("./pages/Checkout"));
const SellerDashboard = lazy(() => import("./pages/SellerDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Messages = lazy(() => import("./pages/Messages"));
const DataExportDashboard = lazy(() => import("./pages/DataExportDashboard"));
const PrivacyDashboard = lazy(() => import("./pages/PrivacyDashboard"));
const SellerVerification = lazy(() => import("./pages/SellerVerification"));
const Favorites = lazy(() => import("./pages/Favorites"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    }>
      <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/marketplace"} component={Marketplace} />
      <Route path={"/gig/:id"} component={GigDetail} />
      <Route path={"/checkout/:id"} component={Checkout} />
      <Route path="/create-gig" component={CreateGig} />
      <Route path="/edit-gig/:id" component={EditGig} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/seller-dashboard"} component={SellerDashboard} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/profile"} component={Profile} />
      <Route path={"/favorites"} component={Favorites} />
      <Route path={"/order/:id"} component={OrderDetail} />
      <Route path={"/order/confirmation/:orderId"} component={OrderConfirmation} />
      <Route path={"/settings"} component={Settings} />
      <Route path={"/messages"} component={Messages} />
      <Route path={"data-export-dashboard"} component={DataExportDashboard} />
      <Route path={"/privacy-dashboard"} component={PrivacyDashboard} />
      <Route path={"/seller-verification"} component={SellerVerification} />
      <Route path={"/about"} component={About} />
      <Route path={"/how-it-works"} component={HowItWorks} />
      <Route path={"/faq"} component={FAQ} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/terms"} component={Terms} />
      <Route path={"/privacy"} component={Privacy} />
      <Route path={"/impressum"} component={Impressum} />
      <Route path={"/widerruf"} component={Widerruf} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <SkipLink />
          <GlobalHeader />
          <Onboarding />
          <Router />
          <CookieConsent />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

