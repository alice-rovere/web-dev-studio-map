import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import Navbar from "./components/Navbar";
import RequireEditor from "./components/RequireEditor";
import SkillMap from "./pages/SkillMap";
import Guidelines from "./pages/Guidelines";
import Security from "./pages/Security";
import AiWebDev from "./pages/AiWebDev";
import GuidedPath from "./pages/GuidedPath";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Glossary from "./pages/Glossary";
import { AuthProvider } from "./context/AuthContext";
import { GlossaryProvider } from "./context/GlossaryProvider";

export default function App() {
  return (
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <AuthProvider>
          <GlossaryProvider>
            <div className="flex h-dvh w-full flex-col overflow-hidden bg-[#0b1220] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pt-[env(safe-area-inset-top)] text-[#e8edf5]">
              <Navbar />
              <div className="relative min-h-0 w-full grow overflow-hidden">
                <Routes>
                  <Route path="/" element={<SkillMap />} />
                  <Route path="/linee-guida" element={<Guidelines />} />
                  <Route path="/sicurezza" element={<Security />} />
                  <Route path="/ai-web-dev" element={<AiWebDev />} />
                  <Route path="/percorso-guidato" element={<GuidedPath />} />
                  <Route path="/glossario" element={<Glossary />} />
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/admin"
                    element={
                      <RequireEditor>
                        <Admin />
                      </RequireEditor>
                    }
                  />
                </Routes>
              </div>
            </div>
          </GlossaryProvider>
        </AuthProvider>
      </MotionConfig>
    </BrowserRouter>
  );
}
