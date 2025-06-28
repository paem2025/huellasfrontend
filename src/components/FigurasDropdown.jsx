import { useState, useRef, useEffect } from "react";

const FigurasDropdown = ({ title = "Seleccionar opciones", options = [], selectedOptions = [], onChange, multiple = true}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleOptionChange = (value) => {
    if (multiple) {
      if (selectedOptions.includes(value)) {
        onChange(selectedOptions.filter(opt => opt !== value));
      } else {
        onChange([...selectedOptions, value]);
      }
    } else {
      onChange([value]);
      setIsOpen(false);
    }
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => opt.toLowerCase().includes(searchTerm));

  return (
    <div className="dropdown-container mb-4" ref={dropdownRef}>
      <label className="block text-sm font-semibold mb-1 capitalize">{title}</label>
      <div
        className="dropdown-toggle border rounded-md p-2 bg-white shadow cursor-pointer"
        onClick={toggleDropdown}
      >
        <span className="truncate">
            {selectedOptions.length > 0
                ? selectedOptions.join(", ")
                : "Seleccionar opciones"}
        </span>
        <span className="float-right">▼</span>
      </div>

      {isOpen && (
        <div className="dropdown-menu border rounded-md shadow bg-white mt-1 p-2 max-h-60 overflow-y-auto">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full mb-2 p-1 border-b outline-none"
          />
          {filteredOptions.map(option => (
            <label key={option} className="flex items-center p-1 cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={selectedOptions.includes(option)}
                onChange={() => handleOptionChange(option)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default FigurasDropdown;