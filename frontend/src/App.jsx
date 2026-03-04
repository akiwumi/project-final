import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { Investor } from "./pages/Investor";
import { ChooseRole } from "./pages/ChooseRole";
import { EntrepreneurRegister } from "./pages/entrepreneur/Register";
import { Welcome } from "./pages/entrepreneur/Welcome";
import { EntrepreneurProfile } from "./pages/entrepreneur/Profile";
import { SubmitProject } from "./pages/entrepreneur/SubmitProject";
import { Payment } from "./pages/entrepreneur/Payment";
import { EntrepreneurDashboard } from "./pages/entrepreneur/Dashboard";
import { ProjectFeed } from "./pages/ProjectFeed";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/choose-role" element={<ChooseRole />} />
        <Route path="/investor" element={<Investor />} />
        <Route path="/feed" element={<ProjectFeed />} />

        {/* Entrepreneur registration flow */}
        <Route path="/register" element={<EntrepreneurRegister />} />
        <Route path="/welcome" element={<Welcome />} />

        {/* Entrepreneur authenticated pages */}
        <Route path="/entrepreneur/profile" element={<EntrepreneurProfile />} />
        <Route path="/entrepreneur/submit" element={<SubmitProject />} />
        <Route path="/entrepreneur/payment" element={<Payment />} />
        <Route path="/entrepreneur/dashboard" element={<EntrepreneurDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
