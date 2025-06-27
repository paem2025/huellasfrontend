import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FiguraForm from "../components/FiguraForm";
import FigurasDropdown from "../components/FigurasDropdown";
import axios from "axios";
import { API_URLS } from "../config/api";

const Busqueda = () => {
  const [searchCriteria, setSearchCriteria] = useState({
    categoria: "",
    marca: "",
    modelo: "",
    talle: "",
    // Mantenemos los estados de figuras por si el backend las implementa en el futuro
    figurasSuperiorIzquierdo: [],
    figurasSuperiorDerecho: [],
    figurasCentral: [],
    figurasInferiorIzquierdo: [],
    figurasInferiorDerecho: [],
  });

  const [mostrarFiguraForm, setMostrarFiguraForm] = useState(false);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [figuras, setFiguras] = useState([]);
  const [allCalzados, setAllCalzados] = useState([]);

  // Obtener todos los calzados al montar el componente
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const [figurasResponse, calzadosResponse] = await Promise.all([
          axios.get(API_URLS.FORMAS),
          axios.get(API_URLS.CALZADOS)
        ]);
        
        setFiguras(figurasResponse.data.map(f => f.nombre));
        setAllCalzados(calzadosResponse.data);
      } catch (err) {
        console.error("Error al obtener datos iniciales:", err);
        setError("Error al cargar los datos iniciales");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleChange = (e) => {
    setSearchCriteria({ ...searchCriteria, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Primero intentamos usar el endpoint de búsqueda si existe
      try {
        const params = new URLSearchParams();
        if (searchCriteria.categoria) params.append('categoria', searchCriteria.categoria);
        if (searchCriteria.marca) params.append('marca', searchCriteria.marca);
        if (searchCriteria.modelo) params.append('modelo', searchCriteria.modelo);
        if (searchCriteria.talle) params.append('talle', searchCriteria.talle);

        const response = await axios.get(`${API_URLS.CALZADOS}/buscar?${params.toString()}`);
        setResults(response.data);
        return;
      } catch (apiError) {
        console.log("Endpoint de búsqueda no disponible, filtrando localmente");
      }

      // Si el endpoint de búsqueda no funciona, filtramos localmente
      const resultadosFiltrados = allCalzados.filter(calzado => {
        // Filtro por categoría
        if (searchCriteria.categoria && calzado.categoria !== searchCriteria.categoria) {
          return false;
        }
        
        // Filtro por marca
        if (searchCriteria.marca && calzado.marca?.toLowerCase() !== searchCriteria.marca.toLowerCase()) {
          return false;
        }
        
        // Filtro por modelo
        if (searchCriteria.modelo && calzado.modelo?.toLowerCase() !== searchCriteria.modelo.toLowerCase()) {
          return false;
        }
        
        // Filtro por talle
        if (searchCriteria.talle && calzado.talle !== searchCriteria.talle) {
          return false;
        }

        return true;
      });

      // Mock de figuras para demostración (eliminar cuando el backend lo soporte)
      const resultadosConFiguras = resultadosFiltrados.map((calzado, index) => ({
        ...calzado,
        figurasSuperiorIzquierdo: index % 2 === 0 ? ["Círculo"] : [],
        figurasSuperiorDerecho: index % 3 === 0 ? ["Triángulo"] : [],
        figurasCentral: [],
        figurasInferiorIzquierdo: [],
        figurasInferiorDerecho: index % 4 === 0 ? ["Rectángulo"] : [],
      }));

      setResults(resultadosConFiguras);

    } catch (error) {
      console.error("Error en la búsqueda:", error);
      setError("Error al realizar la búsqueda");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFiguras = () => {
    axios.get(API_URLS.FORMAS)
      .then((response) => {
        setFiguras(response.data.map(f => f.nombre));
      })
      .catch((error) => {
        console.error("Error al obtener figuras:", error);
      });
  };

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
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

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
            <option value="Deportivo">Casual</option>
            <option value="Deportivo">formal</option>
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

          {["SuperiorIzquierdo", "SuperiorDerecho", "Central", "InferiorIzquierdo", "InferiorDerecho"].map((cuadrante) => (
            <FigurasDropdown
              key={cuadrante}
              title={`Cuadrante ${cuadrante.replace(/([A-Z])/g, ' $1').trim()}`}
              options={figuras}
              selectedOptions={searchCriteria[`figuras${cuadrante}`]}
              onChange={(selectedFigures) => 
                setSearchCriteria(prev => ({
                  ...prev, 
                  [`figuras${cuadrante}`]: selectedFigures
                }))
              }
            />
          ))}

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
          disabled={isLoading}
          className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition duration-300 shadow-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {/* Resultados de búsqueda */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2 text-center">Resultados:</h3>
        
        {isLoading ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-3">
            {results.map((result) => (
              <div key={result.id_calzado || result.id} className="bg-blue-50 p-4 rounded-lg shadow-inner text-gray-700">
                <p><strong>Categoría:</strong> {result.categoria || 'No especificado'}</p>
                <p><strong>Marca:</strong> {result.marca || 'No especificado'}</p>
                <p><strong>Modelo:</strong> {result.modelo || 'No especificado'}</p>
                <p><strong>Talle:</strong> {result.talle || 'No especificado'}</p>
                
                {/* Mostrar figuras solo si existen en los datos */}
                {result.figurasSuperiorIzquierdo?.length > 0 && (
                  <p><strong>Superior Izquierdo:</strong> {result.figurasSuperiorIzquierdo.join(", ")}</p>
                )}
                {result.figurasSuperiorDerecho?.length > 0 && (
                  <p><strong>Superior Derecho:</strong> {result.figurasSuperiorDerecho.join(", ")}</p>
                )}
                {result.figurasCentral?.length > 0 && (
                  <p><strong>Central:</strong> {result.figurasCentral.join(", ")}</p>
                )}
                {result.figurasInferiorIzquierdo?.length > 0 && (
                  <p><strong>Inferior Izquierdo:</strong> {result.figurasInferiorIzquierdo.join(", ")}</p>
                )}
                {result.figurasInferiorDerecho?.length > 0 && (
                  <p><strong>Inferior Derecho:</strong> {result.figurasInferiorDerecho.join(", ")}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-4">
            {error ? "Error al obtener resultados" : "No se encontraron resultados"}
          </p>
        )}
      </div>
    </div>
  );
};

export default Busqueda;