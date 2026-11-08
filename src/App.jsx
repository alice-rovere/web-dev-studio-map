import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, Outlet, RouterProvider, useLocation } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import Navbar from "./components/navigation/Navbar";
import LocalChat from "./components/navigation/LocalChat";
import RequireEditor from "./components/auth/RequireEditor";
import { AuthProvider } from "./context/AuthContext";
import { GlossaryProvider } from "./context/GlossaryProvider";
import { useAuth } from "./hooks/useAuth";

const SkillMap = lazy(() => import("./pages/SkillMap"));
const Guidelines = lazy(() => import("./pages/Guidelines"));
const Security = lazy(() => import("./pages/Security"));
const AiWebDev = lazy(() => import("./pages/AiWebDev"));
const GuidedPath = lazy(() => import("./pages/GuidedPath"));
const Login = lazy(() => import("./pages/Login"));
const Admin = lazy(() => import("./pages/Admin"));
const Glossary = lazy(() => import("./pages/Glossary"));
const QuickAdd = lazy(() => import("./pages/QuickAdd"));
const VisualNotebook = lazy(() => import("./pages/VisualNotebook"));
const NotebookEditor = lazy(() => import("./pages/NotebookEditor"));
const VisualGrid = lazy(() => import("./pages/VisualGrid"));
const VisualGridEditor = lazy(() => import("./pages/VisualGridEditor"));

function LegacyComputerRedirect() {
  const location = useLocation();
  return <Navigate to="/griglia/dentro-il-pc" replace state={{ ...location.state, redirectedFromNotebook: true }} />;
}

function PageLoader() {
  return (
    <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
      Caricamento…
    </div>
  );
}

function AppLayout() {
  const { session, isAdmin } = useAuth();
  return (
            <div className="flex h-dvh w-full flex-col overflow-hidden bg-[#0b1120] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pt-[env(safe-area-inset-top)] text-[#e8edf5]">
              <Navbar />
              <div className="relative min-h-0 w-full grow overflow-hidden">
                <Suspense fallback={<PageLoader />}>
                  <Outlet />
                </Suspense>
              </div>
              {session && isAdmin && <LocalChat key={session.user.id} />}
            </div>
  );
}

const router = createBrowserRouter([{
  element: <AppLayout />,
  children: [
    { path: "/", element: <SkillMap /> },
    { path: "/linee-guida", element: <Guidelines /> },
    { path: "/sicurezza", element: <Security /> },
    { path: "/ai-web-dev", element: <AiWebDev /> },
    { path: "/percorso-guidato", element: <GuidedPath /> },
    { path: "/glossario", element: <Glossary /> },
    { path: "/notebook/dentro-il-pc", element: <LegacyComputerRedirect /> },
    { path: "/notebook/:slug", element: <VisualNotebook /> },
    { path: "/griglia/:slug", element: <VisualGrid /> },
    { path: "/admin/griglie/nuova", element: <RequireEditor><VisualGridEditor /></RequireEditor> },
    { path: "/admin/griglie/:slug/modifica", element: <RequireEditor><VisualGridEditor /></RequireEditor> },
    { path: "/admin/percorsi/nuovo", element: <RequireEditor><NotebookEditor /></RequireEditor> },
    { path: "/admin/percorsi/dentro-il-pc/modifica", element: <RequireEditor><Navigate to="/admin/griglie/dentro-il-pc/modifica" replace /></RequireEditor> },
    { path: "/admin/percorsi/:slug/modifica", element: <RequireEditor><NotebookEditor /></RequireEditor> },
    { path: "/login", element: <Login /> },
    { path: "/quick-add", element: <RequireEditor><QuickAdd /></RequireEditor> },
    { path: "/admin", element: <RequireEditor><Admin /></RequireEditor> },
  ],
}]);

export default function App() {
  return (
      <MotionConfig reducedMotion="user">
        <AuthProvider>
          <GlossaryProvider>
            <RouterProvider router={router} />
          </GlossaryProvider>
        </AuthProvider>
      </MotionConfig>
  );
}
