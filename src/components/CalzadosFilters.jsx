import React from "react";

const CalzadosFilters = ({ 
  filter, 
  setFilter, 
  searchTerm, 
  setSearchTerm 
}) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 sm:mb-6 gap-2 sm:gap-4">
      <div className="flex flex-wrap gap-1 sm:gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-sm ${
            filter === "all"
              ? "bg-purple-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilter("indubitada_proveedor")}
          className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-sm ${
            filter === "indubitada_proveedor"
              ? "bg-purple-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Indubitadas (Proveedor)
        </button>
        <button
          onClick={() => setFilter("indubitada_comisaria")}
          className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-sm ${
            filter === "indubitada_comisaria"
              ? "bg-purple-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Indubitadas (Comisaría)
        </button>
        <button
          onClick={() => setFilter("dubitada")}
          className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-sm ${
            filter === "dubitada"
              ? "bg-purple-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Dubitadas
        </button>
      </div>

      <div className="relative w-full lg:w-64">
        <input
          type="text"
          placeholder="Buscar calzado..."
          className="w-full p-2 pl-8 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <svg
          className="absolute left-2 top-3 h-4 w-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  );
};

export default CalzadosFilters; 