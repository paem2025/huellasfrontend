import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Indubitadas from "./pages/Indubitadas";
import IndubitadasComisaria from "./pages/IndubitadasComisaria";
import Dubitadas from "./pages/Dubitadas";
import Busqueda from "./pages/Busqueda";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import ListadoCalzados from "./pages/ListadoCalzados";
import UserManagement from "./pages/UserManagement";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-extrabold text-center mb-6 text-blue-800">
              Sistema de Huellas de Calzado
            </h1>
            <Navigation />
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <AnimatedRoutes />
            </div>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

// Navegación superior
const Navigation = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Ocultar navegación en login y registro
  if (!isAuthenticated && ["/login", "/registro"].includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="flex justify-center flex-wrap gap-2 mb-6 bg-white rounded-2xl shadow-lg p-4">
      {isAuthenticated && (
        <>
          {user?.role === 'admin' ? (
            // Menú completo para admin
            <>
              {[
                { to: "/indubitadas", label: "Indubitadas" },
                { to: "/indubitadas-comisaria", label: "Indubitadas Comisarías" },
                { to: "/dubitadas", label: "Dubitadas" },
                { to: "/busqueda", label: "Búsqueda" },
                { to: "/listado-calzados", label: "Listado de Calzados" },
                { to: "/user-management", label: "Gestión de Usuarios" }
              ].map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    isActive
                      ? "bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
                      : "text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-lg transition"
                  }
                >
                  {label}
                </NavLink>
              ))}
            </>
          ) : (
            // Menú reducido para user
            <NavLink
              to="/busqueda"
              className={({ isActive }) =>
                isActive
                  ? "bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
                  : "text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-lg transition"
              }
            >
              Búsqueda
            </NavLink>
          )}
          
          {user?.role && (
            <span className="text-sm text-gray-500 px-2 self-center">
              ({user.role === 'user' ? 'Operador' : user.role})
            </span>
          )}

          <button
            onClick={() => navigate("/login?logout=true")}
            className="text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg transition"
          >
            Cerrar Sesión
          </button>
        </>
      )}
    </nav>
  );
};

// Rutas animadas y protegidas
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ duration: 0.5 }}
      >
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* Rutas protegidas */}
          <Route
            path="/indubitadas"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Indubitadas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/indubitadas-comisaria"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <IndubitadasComisaria />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dubitadas"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Dubitadas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/busqueda"
            element={
              <ProtectedRoute allowedRoles={["admin", "user"]}>
                <Busqueda />
              </ProtectedRoute>
            }
          />
          <Route
            path="/listado-calzados"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ListadoCalzados />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-management"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          
          {/* Página no encontrada */}
          <Route
            path="*"
            element={
              <div className="text-center py-20">
                <h2 className="text-xl font-semibold text-red-500">
                  404 — Página no encontrada
                </h2>
                <NavLink
                  to="/login"
                  className="mt-4 inline-block text-blue-600 hover:underline"
                >
                  Volver al login
                </NavLink>
              </div>
            }
          />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

export default App;