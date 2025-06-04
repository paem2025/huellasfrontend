import React from "react";

const FigurasChecklist = ({title, figures, selectedFigures = [], onChange}) => {
    const handleCheckboxChange = (figure) => {
        if (selectedFigures.includes(figure)){
            onChange(selectedFigures.filter((item) => item !== figure));
        }else{
            onChange([...selectedFigures, figure]);
        }
    };

    return(
        <div className = "mb-4">
            <h3 className = "block text-sm font-semibold mb-1 capitalize">{title}</h3>
            <div className = "grid grid-cols-3 gap-3">
                {figures.map((figure) => (
                    <label key = {figure} className = "flex items-center space-x-2">
                        <input
                            type = "checkbox"
                            checked = {selectedFigures.includes(figure)}
                            onChange = {() => handleCheckboxChange(figure)}
                            className = "form-checkbox"
                        ></input>
                        <span className="text-sm">{figure}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};
export default FigurasChecklist;



