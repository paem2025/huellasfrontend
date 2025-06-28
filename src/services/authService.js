import axios from "axios";
import { API_URLS } from "../config/api";

class AuthService {
  async login(username, password) {
    try {
      const response = await axios.post(API_URLS.LOGIN, {
        username,
        password
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        if (response.data.token) {
          localStorage.setItem("authToken", response.data.token);
        }
        return {
          success: true,
          user: response.data.user,
          message: "Login exitoso"
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Credenciales inválidas"
        };
      }
    } catch (error) {
      console.error("Error en login:", error);
      return {
        success: false,
        message: "Error de conexión con el servidor"
      };
    }
  }

  async register(userData) {
    try {
      const response = await axios.post(API_URLS.USUARIOS, userData);
      
      if (response.data.success) {
        return {
          success: true,
          message: "Usuario registrado exitosamente"
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Error al registrar usuario"
        };
      }
    } catch (error) {
      console.error("Error en registro:", error);
      return {
        success: false,
        message: "Error de conexión con el servidor"
      };
    }
  }

  async verifyToken() {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return false;
    }

    try {
      return true;
    } catch (error) {
      console.error("Error verificando token:", error);
      localStorage.removeItem("authToken");
      return false;
    }
  }

  async logout() {
    try {
      localStorage.removeItem("authToken");
      localStorage.removeItem("currentUser");
      
      return {
        success: true,
        message: "Sesión cerrada exitosamente"
      };
    } catch (error) {
      console.error("Error en logout:", error);
      localStorage.removeItem("authToken");
      localStorage.removeItem("currentUser");
      return {
        success: true,
        message: "Sesión cerrada"
      };
    }
  }

  getCurrentUser() {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    const user = this.getCurrentUser();
    const token = localStorage.getItem("authToken");
    return !!(user || token);
  }

  async initialize() {
    console.log("Auth Service inicializado");
  }

  setupAxiosInterceptors() {
    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response && error.response.status === 401) {
          this.logout();
          window.location.href = '/login?logout=true';
        }
        return Promise.reject(error);
      }
    );
  }
}

export default new AuthService();
