import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white shadow-inner py-4 mt-10">
      <div className="text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Sistema de Huellas de Calzado. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
