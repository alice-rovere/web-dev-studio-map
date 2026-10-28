import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import Navbar from "./components/Navbar";
import RequireEditor from "./components/RequireEditor";
import { AuthProvider } from "./context/AuthContext";
import { GlossaryProvider } from "./context/GlossaryProvider";

const SkillMap = lazy(() => import("./pages/SkillMap"));
const Guidelines = lazy(() => import("./pages/Guidelines"));
const Security = lazy(() => import("./pages/Security"));
const AiWebDev = lazy(() => import("./pages/AiWebDev"));
const GuidedPath = lazy(() => import("./pages/GuidedPath"));
const Login = lazy(() => import("./pages/Login"));
const Admin = lazy(() => import("./pages/Admin"));
const Glossary = lazy(() => import("./pages/Glossary"));

function PageLoader() {
  return (
    <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
      Caricamento…
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <AuthProvider>
          <GlossaryProvider>
            <div className="flex h-dvh w-full flex-col overflow-hidden bg-[#0b1220] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pt-[env(safe-area-inset-top)] text-[#e8edf5]">
              <Navbar />
              <div className="relative min-h-0 w-full grow overflow-hidden">
                <Suspense fallback={<PageLoader />}>
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
                </Suspense>
              </div>
            </div>
          </GlossaryProvider>
        </AuthProvider>
      </MotionConfig>
    </BrowserRouter>
  );
}
