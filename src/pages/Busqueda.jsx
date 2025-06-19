import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FiguraForm from "../components/FiguraForm";
import FigurasDropdown from "../components/FigurasDropdown";
import axios from "axios";

const API_URL_FORMAS = "http://127.0.0.1:5000/formas/";

const Busqueda = () => {
  const [searchCriteria, setSearchCriteria] = useState({
    categoria: "",
    marca: "",
    modelo: "",
    talle: "",
    figurasSuperiorIzquierdo: [],
    figurasSuperiorDerecho: [],
    figurasCentral: [],
    figurasInferiorDerecho: [],
    figurasInferiorIzquierdo: [],
  });

  const [mostrarFiguraForm, setMostrarFiguraForm] = useState(false);

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
        figurasSuperiorIzquierdo: ["Círculo", "Triángulo"],
        figurasSuperiorDerecho: [],
        figurasCentral: [],
        figurasInferiorIzquierdo: [],
        figurasInferiorDerecho: [],
      },
      {
        id: 2,
        categoria: "Urbano",
        marca: "Adidas",
        modelo: "Superstar",
        talle: "40",
        figurasSuperiorIzquierdo: [],
        figurasSuperiorDerecho: ["Triangulo"],
        figurasCentral: [],
        figurasInferiorIzquierdo: [],
        figurasInferiorDerecho: ["Rectángulo", "Cuadrado"],
      },
    ]);
  };

  //Estado para figuras
  const [figuras, setFiguras] = useState([]);

  const fetchFiguras = () => {
    axios
      .get(API_URL_FORMAS)
      .then((response) => {
        const nombresFiguras = response.data.map(f => f.nombre);
        setFiguras(nombresFiguras);
      })
      .catch((error) => {
        console.error("Error al obtener figuras:", error);
      });
  };
  useEffect(() => {
    fetchFiguras();
  }, []);

  //Reemplazar formulario Busqueda por FiguraForm si mostrarFiguraForm es igual a true
  if (mostrarFiguraForm) {
    return (
      <motion.div
        className="p-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <FiguraForm 
          onClose={() => setMostrarFiguraForm(false)} 
          onUpdateFiguras={fetchFiguras}
        />
      </motion.div>
    );
  }

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
          <label className="block text-sm font-semibold mb-3">Figuras por Cuadrante:</label>

          <FigurasDropdown
            title="Cuadrante Superior Izquierdo"
            options={figuras}
            selectedOptions={searchCriteria.figurasSuperiorIzquierdo}
            onChange={(selectedFigures) => setSearchCriteria((prev) => ({...prev, figurasSuperiorIzquierdo: selectedFigures,}))}
          />

          <FigurasDropdown
            title="Cuadrante Superior Derecho"
            options={figuras}
            selectedOptions={searchCriteria.figurasSuperiorDerecho}
            onChange={(selectedFigures) => setSearchCriteria((prev) => ({...prev, figurasSuperiorDerecho: selectedFigures,}))}
          />

          <FigurasDropdown
            title="Cuadrante Central"
            options={figuras}
            selectedOptions={searchCriteria.figurasCentral}
            onChange={(selectedFigures) =>
              setSearchCriteria((prev) => ({...prev,figurasCentral: selectedFigures,}))}
          />

          <FigurasDropdown
            title="Cuadrante Inferior Izquierdo"
            options={figuras}
            selectedOptions={searchCriteria.figurasInferiorIzquierdo}
            onChange={(selectedFigures) => setSearchCriteria((prev) => ({...prev, figurasInferiorIzquierdo: selectedFigures,}))}
          />

          <FigurasDropdown
            title="Cuadrante Inferior Derecho"
            options={figuras}
            selectedOptions={searchCriteria.figurasInferiorDerecho}
            onChange={(selectedFigures) => setSearchCriteria((prev) => ({...prev, figurasInferiorDerecho: selectedFigures,}))}
          />

          {/* Botón Nueva Figura */}
          <button
            type="button"
            onClick={() => setMostrarFiguraForm(true)}
            className="mt-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition duration-300 shadow-md"
          >
            Nueva Figura
          </button>
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
                <p><strong>Superior Izquierdo:</strong> {result.figurasSuperiorIzquierdo?.join(", ")}</p>
                <p><strong>Superior Derecho:</strong> {result.figurasSuperiorDerecho?.join(", ")}</p>
                <p><strong>Central:</strong> {result.figurasCentral?.join(", ")}</p>
                <p><strong>Inferior Izquierdo:</strong> {result.figurasInferiorIzquierdo?.join(", ")}</p>
                <p><strong>Inferior Derecho:</strong> {result.figurasInferiorDerecho?.join(", ")}</p>
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