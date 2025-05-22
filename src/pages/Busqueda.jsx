import React, { useState } from "react";

const Busqueda = () => {
  const [searchCriteria, setSearchCriteria] = useState({
    categoria: "",
    marca: "",
    modelo: "",
    talle: "",
    cuadrante: "",
    figurasGeometricas: "",
  });

  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    setSearchCriteria({ ...searchCriteria, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Criterios de búsqueda:", searchCriteria);
    
    // Simulando resultados de búsqueda
    setResults([
      {
        id: 1,
        categoria: "Deportivo",
        marca: "Nike",
        modelo: "Air Max",
        talle: "42",
        cuadrante: "Superior Izquierdo",
        figurasGeometricas: "Círculo, Triángulo",
      },
      {
        id: 2,
        categoria: "Urbano",
        marca: "Adidas",
        modelo: "Superstar",
        talle: "40",
        cuadrante: "Inferior Derecho",
        figurasGeometricas: "Rectángulo, Cuadrado",
      },
    ]);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg mx-auto transition hover:shadow-2xl">
      <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">
        Búsqueda de Huellas
      </h2>
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Categoría:</label>
          <select
            name="categoria"
            value={searchCriteria.categoria}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Seleccionar categoría</option>
            <option value="Deportivo">Deportivo</option>
            <option value="Urbano">Urbano</option>
            <option value="Trabajo">Trabajo</option>
          </select>
        </div>
        
        {["marca", "modelo", "talle"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-semibold mb-1 capitalize">
              {field}:
            </label>
            <input
              type="text"
              name={field}
              value={searchCriteria[field]}
              onChange={handleChange}
              placeholder={`Ingrese ${field}`}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-semibold mb-1">Cuadrante del calzado:</label>
          <select
            name="cuadrante"
            value={searchCriteria.cuadrante}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Seleccionar categoría</option>
            <option value="Superior Izquierdo">Superior Izquierdo</option>
            <option value="Superior Derecho">Superior Derecho</option>
            <option value="Central">Central</option>
            <option value="Inferior Izquierdo">Inferior Izquierdo</option>
            <option value="Inferior Derecho">Inferior Derecho</option>
            
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Figuras Geométricas:</label>
          <input
            type="text"
            name="figurasGeometricas"
            value={searchCriteria.figurasGeometricas}
            onChange={handleChange}
            placeholder="Ej: Círculo, Cuadrado"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition duration-300 shadow-md"
        >
          Buscar
        </button>
      </form>

      {/* Resultados de búsqueda */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2 text-center">Resultados:</h3>
        {results.length > 0 ? (
          <div className="space-y-3">
            {results.map((result) => (
              <div key={result.id} className="bg-blue-50 p-4 rounded-lg shadow-inner text-gray-700">
                <p><strong>Categoría:</strong> {result.categoria}</p>
                <p><strong>Marca:</strong> {result.marca}</p>
                <p><strong>Modelo:</strong> {result.modelo}</p>
                <p><strong>Talle:</strong> {result.talle}</p>
                <p><strong>Cuadrante:</strong> {result.cuadrante}</p>
                <p><strong>Figuras Geométricas:</strong> {result.figurasGeometricas}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">Sin resultados (aún no implementado).</p>
        )}
      </div>
    </div>
  );
};

export default Busqueda;