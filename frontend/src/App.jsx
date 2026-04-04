import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ADMIN_BASE_PATH, ADMIN_LOGIN_PATH, ADMIN_REGISTER_PATH } from "./lib/adminApi";

const LandingPage = lazy(() =>
  import("./pages/LandingPage").then((module) => ({ default: module.LandingPage }))
);
const Investor = lazy(() =>
  import("./pages/Investor").then((module) => ({ default: module.Investor }))
);
const ChooseRole = lazy(() =>
  import("./pages/ChooseRole").then((module) => ({ default: module.ChooseRole }))
);
const EntrepreneurRegister = lazy(() =>
  import("./pages/entrepreneur/Register").then((module) => ({
    default: module.EntrepreneurRegister,
  }))
);
const Login = lazy(() =>
  import("./pages/entrepreneur/Login").then((module) => ({ default: module.Login }))
);
const Welcome = lazy(() =>
  import("./pages/entrepreneur/Welcome").then((module) => ({
    default: module.Welcome,
  }))
);
const EntrepreneurProfile = lazy(() =>
  import("./pages/entrepreneur/Profile").then((module) => ({
    default: module.EntrepreneurProfile,
  }))
);
const SubmitProject = lazy(() =>
  import("./pages/entrepreneur/SubmitProject").then((module) => ({
    default: module.SubmitProject,
  }))
);
const Payment = lazy(() =>
  import("./pages/entrepreneur/Payment").then((module) => ({ default: module.Payment }))
);
const EntrepreneurDashboard = lazy(() =>
  import("./pages/entrepreneur/Dashboard").then((module) => ({
    default: module.EntrepreneurDashboard,
  }))
);
const ProjectFeed = lazy(() =>
  import("./pages/ProjectFeed").then((module) => ({ default: module.ProjectFeed }))
);
const HowItWorksPage = lazy(() =>
  import("./pages/HowItWorks").then((module) => ({
    default: module.HowItWorksPage,
  }))
);
const WhyUsPage = lazy(() =>
  import("./pages/WhyUs").then((module) => ({ default: module.WhyUsPage }))
);
const TestimonialsPage = lazy(() =>
  import("./pages/TestimonialsPage").then((module) => ({
    default: module.TestimonialsPage,
  }))
);
const AdvicePage = lazy(() =>
  import("./pages/Advice").then((module) => ({ default: module.AdvicePage }))
);
const TermsPage = lazy(() =>
  import("./pages/Terms").then((module) => ({ default: module.TermsPage }))
);
const PrivacyPage = lazy(() =>
  import("./pages/Privacy").then((module) => ({ default: module.PrivacyPage }))
);
const ComparePage = lazy(() =>
  import("./pages/Compare").then((module) => ({ default: module.ComparePage }))
);
const QRCodeMonkeyAlternativePage = lazy(() =>
  import("./pages/ComparisonAlternatives").then((module) => ({
    default: module.QRCodeMonkeyAlternativePage,
  }))
);
const QRTigerAlternativePage = lazy(() =>
  import("./pages/ComparisonAlternatives").then((module) => ({
    default: module.QRTigerAlternativePage,
  }))
);
const MEQRAlternativePage = lazy(() =>
  import("./pages/ComparisonAlternatives").then((module) => ({
    default: module.MEQRAlternativePage,
  }))
);
const AdminLogin = lazy(() =>
  import("./pages/admin/Login").then((module) => ({ default: module.AdminLogin }))
);
const AdminRegister = lazy(() =>
  import("./pages/admin/Register").then((module) => ({ default: module.AdminRegister }))
);
const AdminPanel = lazy(() =>
  import("./pages/admin/Panel").then((module) => ({ default: module.AdminPanel }))
);

function RouteFallback() {
  return (
    <div className="min-h-screen bg-[#f9f7f3] text-[#0f1a1c] flex items-center justify-center">
      Loading...
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/choose-role" element={<ChooseRole />} />
          <Route path="/investor" element={<Investor />} />
          <Route path="/feed" element={<ProjectFeed />} />

          {/* Nav pages */}
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/why-us" element={<WhyUsPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/advice" element={<AdvicePage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route
            path="/compare/qr-code-monkey-alternative"
            element={<QRCodeMonkeyAlternativePage />}
          />
          <Route path="/compare/qr-tiger-alternative" element={<QRTigerAlternativePage />} />
          <Route path="/compare/me-qr-alternative" element={<MEQRAlternativePage />} />

          {/* Entrepreneur registration flow */}
          <Route path="/register" element={<EntrepreneurRegister />} />
          <Route path="/login" element={<Login />} />
          <Route path="/welcome" element={<Welcome />} />

          {/* Entrepreneur authenticated pages */}
          <Route path="/entrepreneur/profile" element={<EntrepreneurProfile />} />
          <Route path="/entrepreneur/submit" element={<SubmitProject />} />
          <Route path="/entrepreneur/payment" element={<Payment />} />
          <Route path="/entrepreneur/dashboard" element={<EntrepreneurDashboard />} />

          {/* Hidden admin routes (not linked in public navigation) */}
          <Route path={ADMIN_LOGIN_PATH} element={<AdminLogin />} />
          <Route path={ADMIN_REGISTER_PATH} element={<AdminRegister />} />
          <Route path={ADMIN_BASE_PATH} element={<AdminPanel />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
