import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URLS } from "../config/api";

const MarcaForm = ({ onClose, onUpdateMarcas }) => {
  const [marca, setMarca] = useState("");
  const [marcas, setMarcas] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editNombre, setEditNombre] = useState("");

  const handleChange = (e) => {
    setMarca(e.target.value);
  };

  const fetchMarcas = () => {
    axios
        .get(API_URLS.MARCAS)
        .then((res) => setMarcas(res.data))
        .catch((error) => console.error("Error al obtener marcas:", error));
  };

  useEffect(() => {
    fetchMarcas();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(API_URLS.MARCAS, { nombre: marca })
      .then(() => {
        alert("Marca cargada correctamente");
        setMarca("");
        fetchMarcas();
        onUpdateMarcas();
      })
      .catch(() => {
        alert("Error al cargar marca");
      });
  };

  const handleEditClick = (id, nombre) => {
    setEditId(id);
    setEditNombre(nombre);
  };

  const handleSaveEdit = () => {
    if (!window.confirm("¿Estás seguro de que deseas editar esta marca?")) {
      return;
    }
    axios
      .patch(`${API_URLS.MARCAS}${editId}`, { nombre: editNombre })
      .then(() => {
        alert("Marca editada correctamente");
        setEditId(null);
        setEditNombre("");
        fetchMarcas();
        onUpdateMarcas();
      })
      .catch(() => {
        alert("Error al editar marca");
      });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditNombre("");
  };

  const handleDelete = (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta marca?")) {
      return;
    }
    axios
      .delete(`${API_URLS.MARCAS}${id}`)
      .then(() => {
        alert("Marca eliminada correctamente");
        fetchMarcas();
        onUpdateMarcas();
      })
      .catch(() => {
        alert("Error al eliminar marca");
      });
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-lg mx-auto space-y-4"
      >
        <label className="block text-sm font-semibold mb-1">Marca:</label>

        <input
          type="text"
          value={marca}
          onChange={handleChange}
          placeholder="Ingrese marca"
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
                onUpdateMarcas();
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
        <h2 className="text-sm font-semibold mb-4">Marcas cargadas:</h2>

        {marcas.length === 0 && <p>No hay marcas cargadas</p>}

        {marcas.length > 0 && (
          <ul className="list-disc list-inside">
            {marcas.map((m) => (
              <li
                key={m.id_marca}
                className="flex items-center justify-between py-1 border-b last:border-b-0"
              >
                {editId === m.id_marca ? (
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
                    <span>{m.nombre}</span>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleEditClick(m.id_marca, m.nombre)}
                        className="bg-blue-600 text-white text-sm px-2 py-0.5 rounded hover:bg-blue-700"
                        type="button"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(m.id_marca)}
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

export default MarcaForm;