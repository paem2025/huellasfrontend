import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
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
    alto: "",
    ancho: "",
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
  const [allSuelas, setAllSuelas] = useState([]);
  const [todosImputados, setTodosImputados] = useState([]); // Todos los imputados con sus calzados

  // Obtener todos los datos iniciales al montar el componente
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const [
          figurasResponse, 
          marcasResponse, 
          modelosResponse, 
          categoriasResponse, 
          calzadosResponse, 
          suelasResponse,
          imputadosResponse
        ] = await Promise.all([
          axios.get(API_URLS.FORMAS),
          axios.get(API_URLS.MARCAS),
          axios.get(API_URLS.MODELOS),
          axios.get(API_URLS.CATEGORIAS),
          axios.get(API_URLS.CALZADOS),
          axios.get(API_URLS.SUELAS),
          axios.get(`${API_URLS.CALZADOS}todos_imputados_con_calzados`)
        ]);
        
        setFiguras(figurasResponse.data);
        setMarcas(marcasResponse.data);         
        setModelos(modelosResponse.data);    
        setCategorias(categoriasResponse.data);
        setAllCalzados(calzadosResponse.data);
        setAllSuelas(suelasResponse.data);
        setTodosImputados(imputadosResponse.data);
      } catch (err) {
        console.error("Error al obtener datos iniciales:", err);
        setError("Error al cargar los datos iniciales");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const figurasMap = useMemo(() => {
    const mapa = {};
    figuras.forEach(f => {
      mapa[f.id_forma] = f.nombre.toLowerCase();
    });
    return mapa;
  }, [figuras]);

  const handleChange = (e) => {
    setSearchCriteria({ ...searchCriteria, [e.target.name]: e.target.value });
  };

  const cuadrantesMap = {
    figurasSuperiorIzquierdo: 1,
    figurasSuperiorDerecho: 2,
    figurasInferiorIzquierdo: 3,
    figurasInferiorDerecho: 4,
    figurasCentral: 5,
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const filtros = searchCriteria;

      const resultadosFiltrados = allCalzados.filter((calzado) => {
        if (filtros.categoria && calzado.categoria !== filtros.categoria) return false;
        if (filtros.marca && calzado.marca !== filtros.marca) return false;
        if (filtros.modelo && calzado.modelo !== filtros.modelo) return false;
        if (filtros.talle && Number(calzado.talle) !== Number(filtros.talle)) return false;
        if (filtros.ancho && Number(calzado.ancho) !== Number(filtros.ancho)) return false;
        if (filtros.alto && Number(calzado.alto) !== Number(filtros.alto)) return false;

        const suela = allSuelas.find((s) => s.id_calzado === calzado.id_calzado);
        const hayFigurasSeleccionadas = Object.keys(cuadrantesMap).some(
          (key) => filtros[key] && filtros[key].length > 0
        );

        if ((!suela || !suela.detalles) && hayFigurasSeleccionadas) {
          return false;
        }

        // Filtrar por detalles de la suela 
        for (const key in cuadrantesMap) {
          const figurasBuscadas = filtros[key]; // array de figuras seleccionadas para cada cuadrante
          if (!figurasBuscadas || figurasBuscadas.length === 0) continue;

          // Obtener nombres de figuras en esa suela para cada cuadrante
          const figurasEnSuela = suela.detalles
            .filter(det => det.id_cuadrante === cuadrantesMap[key])
            .map(det => figurasMap[det.id_forma]?.toLowerCase())
            .filter(Boolean);

          // Chequear que todas las figuras estén en la suela
          const todasCoinciden = figurasBuscadas.every(figura =>
            figurasEnSuela.includes(figura.toLowerCase())
          );

          if (!todasCoinciden) {
            return false; 
          }
        }

        return true; 
      });

      // Agregar las figuras por cuadrante a cada resultado
      const resultadosConFiguras = resultadosFiltrados.map((calzado) => {
        const suela = allSuelas.find((s) => s.id_calzado === calzado.id_calzado);

        const figurasPorCuadrante = {
          figurasSuperiorIzquierdo: [],
          figurasSuperiorDerecho: [],
          figurasCentral: [],
          figurasInferiorIzquierdo: [],
          figurasInferiorDerecho: [],
        };

        if (suela && suela.detalles) {
          suela.detalles.forEach((det) => {
            const cuadranteNombre = Object.entries(cuadrantesMap).find(
              ([key, id]) => id === det.id_cuadrante
            )?.[0];

            const nombreFigura = figurasMap[det.id_forma];
            if (cuadranteNombre && nombreFigura) {
              figurasPorCuadrante[cuadranteNombre].push(nombreFigura);
            }
          });
        }

        return {
          ...calzado,
          ...figurasPorCuadrante,
        };
      });

      setResults(resultadosConFiguras);
      
      // Limpiar campos
      setSearchCriteria({
        categoria: "",
        marca: "",
        modelo: "",
        talle: "",
        alto: "",
        ancho: "",
        figurasSuperiorIzquierdo: [],
        figurasSuperiorDerecho: [],
        figurasCentral: [],
        figurasInferiorIzquierdo: [],
        figurasInferiorDerecho: [],
      });
    } catch (error) {
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
    
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(16);
    doc.text("Resultados de búsqueda de calzados", 14, 20);

    // Definir columnas principales
    const columnas = [
      "Categoría", "Marca", "Modelo", "Talle", "Alto", "Ancho", "Tipo Registro","Colores",
      "Sup. Izq.", "Sup. Der.", "Central", "Inf. Izq.", "Inf. Der.",
      "Imputado"
    ];

    // Preparar datos para la tabla
    const filas = results.map((r) => {
      const relacion = todosImputados.find(item => 
        item.calzados.some(calzado => calzado.id_calzado === r.id_calzado)
      );
      
      const infoImputado = relacion && r.tipo_registro === "indubitada_comisaria" 
        ? `${relacion.imputado.nombre || '—'} (DNI: ${relacion.imputado.dni || '—'})`
        : "—";

      return [
        r.categoria || "—",
        r.marca || "—",
        r.modelo || "—",
        r.talle || "—",
        r.alto || "—",                        
        r.ancho || "—", 
        r.tipo_registro || "—",
        Array.isArray(r.colores) && r.colores.length > 0 ? r.colores.join(", ") : "—",
        r.figurasSuperiorIzquierdo?.join(", ") || "—",
        r.figurasSuperiorDerecho?.join(", ") || "—",
        r.figurasCentral?.join(", ") || "—",
        r.figurasInferiorIzquierdo?.join(", ") || "—",
        r.figurasInferiorDerecho?.join(", ") || "—",
        infoImputado
      ];
    });

    // Crear tabla principal
    doc.autoTable({
      startY: 30,
      head: [columnas],
      body: filas,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 78, 99] },
    });

    doc.save(nombreFinal);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto transition hover:shadow-2xl">
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
        
        {["talle", "alto", "ancho"].map((field) => (
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
              options={figuras.map(f => f.nombre)}
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
            {results.map((result) => {
              const relacion = todosImputados.find(item => 
                item.calzados.some(calzado => calzado.id_calzado === result.id_calzado)
              );
              
              return (
                <div key={result.id_calzado} className="bg-blue-50 p-4 rounded-lg shadow-inner text-gray-700">
                  {/* Información básica del calzado */}
                  <div className="flex justify-between items-start">
                    <div>
                      <p><strong>Categoría:</strong> {result.categoria || 'No especificado'}</p>
                      <p><strong>Marca:</strong> {result.marca || 'No especificado'}</p>
                      <p><strong>Modelo:</strong> {result.modelo || 'No especificado'}</p>
                      <p><strong>Talle:</strong> {result.talle || 'No especificado'}</p>
                      <p><strong>Tipo Registro:</strong> {result.tipo_registro || 'No especificado'}</p>
                      <p><strong>Alto:</strong> {result.alto || "No especificado"}</p>
                      <p><strong>Ancho:</strong> {result.ancho || "No especificado"}</p>

                      {/* Mostrar colores solo si existen en los datos */}
                      {result.colores?.length > 0 && (
                        <p><strong>Colores:</strong> {result.colores.join(", ")}</p>
                      )}
                    </div>
                  </div>

                  {/* Mostrar información del imputado si existe y es indubitada_comisaria */}
                  {relacion && result.tipo_registro === "indubitada_comisaria" && (
                    <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h4 className="font-bold text-yellow-800">Información del Imputado:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Nombre:</p>
                          <p className="text-sm">{relacion.imputado.nombre || '—'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">DNI:</p>
                          <p className="text-sm">{relacion.imputado.dni || '—'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Dirección:</p>
                          <p className="text-sm">{relacion.imputado.direccion || '—'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Comisaría:</p>
                          <p className="text-sm">{relacion.imputado.comisaria || '—'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Jurisdicción:</p>
                          <p className="text-sm">{relacion.imputado.jurisdiccion || '—'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
