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
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Ocultar navegación en login y registro
  if (!isAuthenticated && ["/login", "/registro"].includes(location.pathname)) {
    return null;
  }

  // Definir los enlaces disponibles para cada rol
  const getLinksForRole = (role) => {
    const commonLinks = [
      { to: "/busqueda", label: "Búsqueda", roles: ["user", "operador", "admin"] },
    ];
    
    const roleSpecificLinks = {
      operador: [
        { to: "/indubitadas", label: "Indubitadas", roles: ["operador", "admin"] },
        { to: "/indubitadas-comisaria", label: "Indubitadas Comisarías", roles: ["operador", "admin"] },
        { to: "/dubitadas", label: "Dubitadas", roles: ["operador", "admin"] },
        { to: "/listado-calzados", label: "Listado de Calzados", roles: ["operador", "admin"] },
      ],
      admin: [
        { to: "/user-management", label: "Gestión de Usuarios", roles: ["admin"] },
      ],
    };

    return [
      ...commonLinks,
      ...(roleSpecificLinks[role] || []),
    ].filter(link => link.roles.includes(role));
  };

  if (loading) {
    return (
      <nav className="flex justify-center mb-6 bg-white rounded-2xl shadow-lg p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
      </nav>
    );
  }

  return (
    <nav className="flex justify-center flex-wrap gap-2 mb-6 bg-white rounded-2xl shadow-lg p-4">
      {isAuthenticated && (
        <>
          {getLinksForRole(user?.role).map(({ to, label }) => (
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
          {user?.role && (
            <span className="text-sm text-gray-500 px-2 self-center">
              ({user.role})
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
  const { isAuthenticated, user, loading } = useAuth();

  // Función para determinar la ruta inicial según el rol
  const getDefaultRoute = () => {
    if (!isAuthenticated) return "/login";
    
    switch(user?.role) {
      case "admin": return "/user-management";
      case "operador": return "/indubitadas";
      case "user": return "/busqueda";
      default: return "/login";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
          {/* Redirige a la ruta por defecto según el rol */}
          <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          {/* Rutas protegidas */}
          <Route
            path="/indubitadas"
            element={
              <ProtectedRoute allowedRoles={["operador", "admin"]}>
                <Indubitadas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/indubitadas-comisaria"
            element={
              <ProtectedRoute allowedRoles={["operador", "admin"]}>
                <IndubitadasComisaria />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dubitadas"
            element={
              <ProtectedRoute allowedRoles={["operador", "admin"]}>
                <Dubitadas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/busqueda"
            element={
              <ProtectedRoute allowedRoles={["user", "operador", "admin"]}>
                <Busqueda />
              </ProtectedRoute>
            }
          />
          <Route
            path="/listado-calzados" 
            element={
              <ProtectedRoute allowedRoles={["operador", "admin"]}>
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
                  to={getDefaultRoute()}
                  className="mt-4 inline-block text-blue-600 hover:underline"
                >
                  Volver al inicio
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