import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL_CATEGORIAS = "http://127.0.0.1:5000/categorias/";

const CategoriaForm = ({ onClose, onUpdateCategorias }) => {
  const [categoria, setCategoria] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editNombre, setEditNombre] = useState("");

  const handleChange = (e) => {
    setCategoria(e.target.value);
  };

  const fetchCategorias = () => {
    axios
      .get(API_URL_CATEGORIAS)
      .then((res) => {
        setCategorias(res.data);
      })
      .catch((error) => {
        console.error("Error al obtener categorías:", error);
      });
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(API_URL_CATEGORIAS, { nombre: categoria })
      .then(() => {
        alert("Categoría cargada correctamente");
        setCategoria("");
        fetchCategorias();
        onUpdateCategorias();
      })
      .catch(() => {
        alert("Error al cargar categoría");
      });
  };

  const handleEditClick = (id, nombre) => {
    setEditId(id);
    setEditNombre(nombre);
  };

  const handleSaveEdit = () => {
    axios
      .patch(`${API_URL_CATEGORIAS}${editId}`, { nombre: editNombre })
      .then(() => {
        alert("Categoría editada correctamente");
        setEditId(null);
        setEditNombre("");
        fetchCategorias();
        onUpdateCategorias();
      })
      .catch(() => {
        alert("Error al editar categoría");
      });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditNombre("");
  };

  const handleDelete = (id) => {
    axios
      .delete(`${API_URL_CATEGORIAS}${id}`)
      .then(() => {
        alert("Categoría eliminada correctamente");
        fetchCategorias();
        onUpdateCategorias();
      })
      .catch(() => {
        alert("Error al eliminar categoría");
      });
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-lg mx-auto space-y-4"
      >
        <label className="block text-sm font-semibold mb-1">Categoría:</label>

        <input
          type="text"
          value={categoria}
          onChange={handleChange}
          placeholder="Ingrese categoría"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
        />

        <div className="flex justify-end space-x-2 mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Guardar
          </button>

          {onClose && (
            <button
              type="button"
              onClick={() => {
                onUpdateCategorias();
                onClose();
              }}
              className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition font-semibold"
            >
              Volver
            </button>
          )}
        </div>
      </form>

      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg mx-auto mt-6">
        <h2 className="text-sm font-semibold mb-4">Categorías cargadas:</h2>

        {categorias.length === 0 && <p>No hay categorías cargadas</p>}

        {categorias.length > 0 && (
          <ul className="list-disc list-inside">
            {categorias.map((c) => (
              <li
                key={c.id_categoria}
                className="flex items-center justify-between py-1 border-b last:border-b-0"
              >
                {editId === c.id_categoria ? (
                  <>
                    <input
                      type="text"
                      value={editNombre}
                      onChange={(e) => setEditNombre(e.target.value)}
                      className="border p-1 rounded"
                    />
                    <div className="space-x-2">
                      <button
                        onClick={handleSaveEdit}
                        className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 mr-2"
                        type="button"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                        type="button"
                      >
                        Cancelar
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span>{c.nombre}</span>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleEditClick(c.id_categoria, c.nombre)}
                        className="bg-blue-600 text-white text-sm px-2 py-0.5 rounded hover:bg-blue-700"
                        type="button"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(c.id_categoria)}
                        className="bg-red-600 text-white text-sm px-2 py-0.5 rounded hover:bg-red-700"
                        type="button"
                      >
                        Eliminar
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CategoriaForm;