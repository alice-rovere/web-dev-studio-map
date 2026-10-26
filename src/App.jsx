import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import RequireEditor from "./components/RequireEditor";
import SkillMap from "./pages/SkillMap";
import Guidelines from "./pages/Guidelines";
import Security from "./pages/Security";
import GuidedPath from "./pages/GuidedPath";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import { AuthProvider } from "./context/AuthContext";
import { GlossaryProvider } from "./context/GlossaryProvider";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GlossaryProvider>
          <div className="w-screen h-screen flex flex-col overflow-hidden bg-[#0b1120] text-[#e8edf5]">
            <Navbar />
            <div className="grow relative w-full h-full">
              <Routes>
                <Route path="/" element={<SkillMap />} />
                <Route path="/linee-guida" element={<Guidelines />} />
                <Route path="/sicurezza" element={<Security />} />
                <Route path="/percorso-guidato" element={<GuidedPath />} />
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
    </BrowserRouter>
  );
}
