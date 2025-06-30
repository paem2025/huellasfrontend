import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FiguraForm from "../components/FiguraForm";
import FigurasDropdown from "../components/FigurasDropdown";
import axios from "axios";
import { API_URLS } from "../config/api";
import jsPDF from "jspdf";
import "jspdf-autotable";

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

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [figuras, setFiguras] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [allCalzados, setAllCalzados] = useState([]);

  // Obtener todos los calzados al montar el componente
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const [figurasResponse, marcasResponse, modelosResponse, categoriasResponse, calzadosResponse] = await Promise.all([
          axios.get(API_URLS.FORMAS),
          axios.get(API_URLS.MARCAS),
          axios.get(API_URLS.MODELOS),
          axios.get(API_URLS.CATEGORIAS),
          axios.get(API_URLS.CALZADOS)
        ]);
        
        setFiguras(figurasResponse.data.map(f => f.nombre));
        setMarcas(marcasResponse.data);
        setModelos(modelosResponse.data);
        setCategorias(categoriasResponse.data);
        
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

      //Refresh
      setSearchCriteria({
        categoria: "",
        marca: "",
        modelo: "",
        talle: "",
        figurasSuperiorIzquierdo: [],
        figurasSuperiorDerecho: [],
        figurasCentral: [],
        figurasInferiorIzquierdo: [],
        figurasInferiorDerecho: [],
      });

    } catch (error) {
      console.error("Error en la búsqueda:", error);
      setError("Error al realizar la búsqueda");
    } finally {
      setIsLoading(false);
    }
  };

  const exportarPDF = () => {
    if (results.length === 0) {
      alert("No hay resultados para exportar.");
      return;
  }

    const confirmar = window.confirm("¿Deseás descargar los resultados como PDF?");
    if (!confirmar) return;

    const nombreArchivo = window.prompt("Ingresá el nombre del archivo PDF:", "resultados_calzados");
    const nombreFinal = nombreArchivo?.trim() ? `${nombreArchivo.trim()}.pdf` : "resultados_calzados.pdf";
    
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Resultados de búsqueda de calzados", 14, 20);

    const columnas = [
      "Categoría", "Marca", "Modelo", "Talle", "Colores",
      "Sup. Izq.", "Sup. Der.", "Central", "Inf. Izq.", "Inf. Der.",
  ];

    const filas = results.map((r) => [
      r.categoria || "—",
      r.marca || "—",
      r.modelo || "—",
      r.talle || "—",
      Array.isArray(r.colores) ? r.colores.join(", ") : (r.colores || "—"),

      r.figurasSuperiorIzquierdo?.join(", ") || "—",
      r.figurasSuperiorDerecho?.join(", ") || "—",
      r.figurasCentral?.join(", ") || "—",
      r.figurasInferiorIzquierdo?.join(", ") || "—",
      r.figurasInferiorDerecho?.join(", ") || "—",
  ]);

  doc.autoTable({
    startY: 30,
    head: [columnas],
    body: filas,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [22, 78, 99] },
  });

  doc.save(nombreFinal);
};

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
        {/* Categoría */}
        <FigurasDropdown
          title="Categoría"
          options={categorias.map(c => c.nombre)}
          selectedOptions={searchCriteria.categoria ? [searchCriteria.categoria] : []}
          onChange={(selected) => setSearchCriteria(prev => ({ ...prev, categoria: selected[0] || "" }))}
          multiple={false}
        />

        {/* Marca */}
        <FigurasDropdown
          title="Marca"
          options={marcas.map(m => m.nombre)}
          selectedOptions={searchCriteria.marca ? [searchCriteria.marca] : []}
          onChange={(selected) => setSearchCriteria(prev => ({ ...prev, marca: selected[0] || "" }))}
          multiple={false}
        />

        {/* Modelo */}
        <FigurasDropdown
          title="Modelo"
          options={modelos.map(m => m.nombre)}
          selectedOptions={searchCriteria.modelo ? [searchCriteria.modelo] : []}
          onChange={(selected) => setSearchCriteria(prev => ({ ...prev, modelo: selected[0] || "" }))}
          multiple={false}
        />
        
        {["talle"].map((field) => (
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
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Resultados:</h3>
          <button
            onClick={exportarPDF}
            disabled={results.length === 0}
            className={`py-2 px-4 rounded-lg font-semibold transition
              ${results.length === 0
                ? "bg-green-900 cursor-not-allowed text-white" 
                : "bg-green-600 hover:bg-green-700 text-white" 
    }`}
    >
      Exportar a PDF
    </button>
  </div>
        
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