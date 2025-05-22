import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setTimeout(() => {
      try {
        navigate("/login", { replace: true });
      } catch (error) {
        console.warn("Error al redirigir:", error);
      }
    }, 0);
  };

  return (
    <button onClick={handleLogout} className="text-red-600 font-bold ml-4">
      Cerrar Sesión
    </button>
  );
};

export default LogoutButton;
