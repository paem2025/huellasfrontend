import React from "react";

const FigurasChecklist = ({ title, figures, selectedFigures = [], onChange }) => {
    const handleCheckboxChange = (figure) => {
        if (selectedFigures.includes(figure)) {
            onChange(selectedFigures.filter((item) => item !== figure));
        } else {
            onChange([...selectedFigures, figure]);
        }
    };

    return (
        <div className="p-4 rounded-lg shadow-md bg-white border border-gray-200">
            <h3 className="text-base font-semibold text-gray-700 mb-3">{title}</h3>
            <div className="flex flex-col gap-2">
                {figures.map((figure) => (
                    <label key={figure} className="flex items-center gap-2 text-sm text-gray-600">
                        <input
                            type="checkbox"
                            checked={selectedFigures.includes(figure)}
                            onChange={() => handleCheckboxChange(figure)}
                            className="accent-blue-600 w-4 h-4"
                        />
                        <span>{figure}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default FigurasChecklist;
