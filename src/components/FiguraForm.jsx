import React,{ useState, useEffect } from "react";
import axios from 'axios';

const API_URL = "http://127.0.0.1:5000/formas/";

const FiguraForm = ({ onClose }) => {
    const [figura, setFigura] = useState("");
    const [figuras, setFiguras] = useState([]);

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

        const newFigura = {
            nombre: figura,
        };
        axios
            .post(API_URL, newFigura)
            .then((response) => {
                alert("Figura cargada correctamente")
                setFigura("");
                fetchFiguras();
            })
            .catch((error) => {
                alert("Error al cargar figura")
            })
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
                            onClick = {onClose}
                            className = "bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition font-semibold"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
            {/* Listado de figuras */}
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg mx-auto mt-6">
                <h2 className="text-xl font-semibold mb-4">Figuras cargadas:</h2>
                {figuras.length === 0 && <p>No hay figuras cargadas</p>}

                {figuras.length > 0 && (
                <ul className="list-disc list-inside">
                    {figuras.map((f) => (
                    <li key={f.id_forma}>{f.nombre}</li>
                    ))}
                </ul>
                )}
            </div>
        </div>
    );
};

export default FiguraForm;