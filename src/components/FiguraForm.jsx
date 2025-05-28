import React,{ useState } from "react";

const FiguraForm = ({ onClose }) => {
    const [figura, setFigura] = useState("");

    const handleChange = (e) => {
        setFigura(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        //Logica para guardar la figura
        alert("Figura cargada correctamente");
        setFigura("");
    };

    return (
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
    );
};

export default FiguraForm;