import React from "react";
import { useNavigate } from "react-router-dom";
import HuellaForm from "../components/HuellaForm";

const FigurasForm = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 w-full">
      <h2 className="text-xl font-bold mb-4 text-blue-800 text-center">
        Figuras de la Suela
      </h2>

      {/* Esto ya tiene un contenedor dentro con min-width y grid */}
      <HuellaForm />

      <div className="mt-6 text-center">
        <button
          onClick={() => navigate("/registro")}
          className="text-blue-600 underline hover:text-blue-800"
        >
          ← Volver
        </button>
      </div>
    </div>
  );
};

export default FigurasForm;
