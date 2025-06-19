import React,{ useState, useEffect } from "react";
import axios from 'axios';

const API_URL = "http://127.0.0.1:5000/formas/";

const FiguraForm = ({ onClose, onUpdateFiguras  }) => {
    const [figura, setFigura] = useState("");
    const [figuras, setFiguras] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editNombre, setEditNombre] = useState("");

    const handleChange = (e) => {
        setFigura(e.target.value);
    };

    const fetchFiguras = () => {
        axios
            .get(API_URL)
            .then((response) => {
                setFiguras(response.data);
            })
            .catch((error) => {
                console.error("Error al obtener figuras:", error);
            });
    };

    useEffect(() => {
        fetchFiguras();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        axios
            .post(API_URL, {nombre: figura})
            .then(() => {
                alert("Figura cargada correctamente")
                setFigura("");
                fetchFiguras();
            })
            .catch(() => {
                alert("Error al cargar figura")
            })
    };

    const handleEditClick = (id, nombre) => {
        setEditId(id);
        setEditNombre(nombre);
    };

    const handleSaveEdit = () => {
        axios
            .put(`${API_URL}${editId}`, { nombre: editNombre })
            .then(() => {
                alert("Figura editada correctamente")
                setEditId(null);
                setEditNombre("");
                fetchFiguras();
            })
            .catch(() => {
                alert ("Error al editar figura")
            });
    };

    const handleCancelEdit = () => {
        setEditId(null);
        setEditNombre("");
    };

    const handleDelete = (id) => {
        axios
            .delete(`${API_URL}${id}`)
            .then(() => {
                alert("Figura eliminada correctamente");
                fetchFiguras();
            })
            .catch(() => {
                alert("Error al eliminar figura");
            });
    };

    return (
        <div>
            <form
            onSubmit  = {handleSubmit}
            className = "bg-white p-8 rounded-2xl shadow-xl max-w-lg mx-auto space-y-4"
            >
            
                <label className = "block text-sm font-semibold mb-1">Figura:</label>

                <input
                    type = "text"
                    value = {figura}
                    onChange={handleChange}
                    placeholder = "Ingrese figura"
                    className = "w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    required
                ></input>

                <div className="flex justify-end space-x-2 mt-4">
                    <button
                        type = "submit"
                        className = "bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                        Guardar
                    </button>

                    {onClose && (
                        <button
                            type = "button"
                            onClick={() => {
                                if (onUpdateFiguras) onUpdateFiguras();
                                onClose();
                            }}
                            className = "bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition font-semibold"
                        >
                            Volver
                        </button>
                    )}
                </div>
            </form>
            {/* Listado de figuras */}
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg mx-auto mt-6">
                <h2 className="text-sm font-semibold mb-4">Figuras cargadas:</h2>
                {figuras.length === 0 && <p>No hay figuras cargadas</p>}

                {figuras.length > 0 && (
                    <ul className="list-disc list-inside">
                        {figuras.map((f) => (
                            <li key={f.id_forma} className="flex items-center justify-between py-1 border-b last:border-b-0">

                            {/* Modo editar figura*/}
                            {editId === f.id_forma ? (
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
                                <span>{f.nombre}</span>
                                <div className="space-x-2">
                                    <button
                                        onClick={() => handleEditClick(f.id_forma, f.nombre)}
                                        className="bg-blue-600 text-white text-sm px-2 py-0.5 rounded hover:bg-blue-700"
                                        type="button"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(f.id_forma)}
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

export default FiguraForm;