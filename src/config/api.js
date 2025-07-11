const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const API_URLS = {
  FORMAS: `${API_BASE_URL}formas/`,
  CALZADOS: `${API_BASE_URL}calzados/`,
  SUELAS: `${API_BASE_URL}suelas/`,
  MARCAS: `${API_BASE_URL}marcas/`,
  MODELOS: `${API_BASE_URL}modelos/`,
  CATEGORIAS: `${API_BASE_URL}categorias/`,
  COLORES: `${API_BASE_URL}colores/`,
  USUARIOS: `${API_BASE_URL}usuarios/`,
  LOGIN: `${API_BASE_URL}auth/login`,
  IMPUTADOS: `${API_BASE_URL}imputados`,
};

// Configuración de Google OAuth
export const GOOGLE_CONFIG = {
  CLIENT_ID: process.env.REACT_APP_CLIENT_ID,
  SCOPES: ["openid", "profile", "email"],
};

export { API_BASE_URL };