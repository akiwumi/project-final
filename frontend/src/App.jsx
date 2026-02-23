import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { Investor } from "./pages/Investor";
import { ChooseRole } from "./pages/ChooseRole";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/investor" element={<Investor />} />
        <Route path="/choose-role" element={<ChooseRole />} />
      </Routes>
    </BrowserRouter>
  );
}
