import React from "react";
import { Link } from "react-router-dom";
import { FaShoePrints, FaSearch } from "react-icons/fa";

const Header = () => {
  return (
    <header className="bg-white shadow-md py-4 mb-6">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
          <FaShoePrints />
          Sistema de Huellas
        </h1>
        <nav className="flex gap-4 text-blue-600 font-medium">
          <Link to="/">Indubitadas</Link>
          <Link to="/indubitadas-comisaria">Comisarías</Link>
          <Link to="/dubitadas">Dubitadas</Link>
          <Link to="/busqueda">
            <FaSearch className="inline" /> Búsqueda
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
