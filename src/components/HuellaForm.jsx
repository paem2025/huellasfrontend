import React from "react";
import FigurasChecklist from "./FigurasChecklist";

const HuellaForm = ({ figuras, setFiguras }) => {
  const figurasOptions = ["Figura1", "Figura2", "Figura3"];

  return (
    <div className="w-full overflow-x-auto">
      <div className="grid grid-cols-3 gap-6 justify-items-center items-start min-w-[900px] mx-auto">
        {/* Fila 1 */}
        <FigurasChecklist
          title="Cuadrante Superior Izquierdo"
          figures={figurasOptions}
          selectedFigures={figuras.superiorIzquierdo}
          onChange={(nuevas) => setFiguras((prev) => ({ ...prev, superiorIzquierdo: nuevas }))}
        />
        <div></div>
        <FigurasChecklist
          title="Cuadrante Superior Derecho"
          figures={figurasOptions}
          selectedFigures={figuras.superiorDerecho}
          onChange={(nuevas) => setFiguras((prev) => ({ ...prev, superiorDerecho: nuevas }))}
        />

        {/* Centro */}
        <div></div>
        <FigurasChecklist
          title="Cuadrante Central"
          figures={figurasOptions}
          selectedFigures={figuras.central}
          onChange={(nuevas) => setFiguras((prev) => ({ ...prev, central: nuevas }))}
        />
        <div></div>

        {/* Fila 3 */}
        <FigurasChecklist
          title="Cuadrante Inferior Izquierdo"
          figures={figurasOptions}
          selectedFigures={figuras.inferiorIzquierdo}
          onChange={(nuevas) => setFiguras((prev) => ({ ...prev, inferiorIzquierdo: nuevas }))}
        />
        <div></div>
        <FigurasChecklist
          title="Cuadrante Inferior Derecho"
          figures={figurasOptions}
          selectedFigures={figuras.inferiorDerecho}
          onChange={(nuevas) => setFiguras((prev) => ({ ...prev, inferiorDerecho: nuevas }))}
        />
      </div>
    </div>
  );
};

export default HuellaForm;
