import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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

          {/* Entrepreneur registration flow */}
          <Route path="/register" element={<EntrepreneurRegister />} />
          <Route path="/login" element={<Login />} />
          <Route path="/welcome" element={<Welcome />} />

          {/* Entrepreneur authenticated pages */}
          <Route path="/entrepreneur/profile" element={<EntrepreneurProfile />} />
          <Route path="/entrepreneur/submit" element={<SubmitProject />} />
          <Route path="/entrepreneur/payment" element={<Payment />} />
          <Route path="/entrepreneur/dashboard" element={<EntrepreneurDashboard />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
