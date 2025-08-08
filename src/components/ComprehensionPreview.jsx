import React, { useState } from "react";

export default function ComprehensionPreview({ question, onChange }) {
  const {
    passageTitle = "",
    passage = "",
    questionText = "",
    options = [],
  } = question || {};

  const [selectedOptions, setSelectedOptions] = useState([]);

  const toggleOption = (option) => {
    let updatedSelections;
    if (selectedOptions.includes(option)) {
      updatedSelections = selectedOptions.filter((opt) => opt !== option);
    } else {
      updatedSelections = [...selectedOptions, option];
    }
    setSelectedOptions(updatedSelections);
    if (onChange) onChange(updatedSelections);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      {/* Passage Title */}
      {passageTitle && (
        <h2 className="text-3xl font-bold text-indigo-700 mb-4 border-b-4 border-indigo-300 pb-2">
          {passageTitle}
        </h2>
      )}

      {/* Passage Text */}
      {passage && (
        <p className="mb-8 text-gray-700 whitespace-pre-wrap leading-relaxed text-lg">
          {passage}
        </p>
      )}

      {/* Question Text */}
      {questionText && (
        <div className="mb-6 text-xl font-semibold text-gray-800">
          {questionText}
        </div>
      )}

      {/* Options */}
      <div className="grid gap-4 sm:grid-cols-2">
        {options.map((opt, idx) => {
          const isSelected = selectedOptions.includes(opt);
          return (
            <label
              key={opt}
              htmlFor={`option-${idx}`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  toggleOption(opt);
                }
              }}
              className={`flex items-center cursor-pointer rounded-lg p-4 border transition duration-300 ease-in-out
                ${
                  isSelected
                    ? "bg-indigo-100 border-indigo-500 shadow-md"
                    : "bg-white border-gray-300 hover:shadow-lg hover:border-indigo-400"
                }
                focus:outline-none focus:ring-4 focus:ring-indigo-300`}
            >
              <div className="relative flex-shrink-0">
                <input
                  id={`option-${idx}`}
                  type="checkbox"
                  value={opt}
                  checked={isSelected}
                  onChange={() => toggleOption(opt)}
                  className="appearance-none w-6 h-6 border-2 border-gray-400 rounded-md cursor-pointer transition-colors duration-300
                    checked:border-indigo-600 checked:bg-indigo-600 focus:outline-none"
                />
                {/* Animated checkmark */}
                <svg
                  className={`absolute top-0 left-0 w-6 h-6 stroke-white stroke-2 pointer-events-none transition-transform duration-300
                    ${isSelected ? "scale-100" : "scale-0"}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <span className="ml-4 text-gray-900 font-medium flex items-center select-none">
                {opt.startsWith("http") ? (
                  <img
                    src={opt}
                    alt={`option-${idx}`}
                    className="w-20 h-20 object-cover rounded-md shadow-sm"
                  />
                ) : (
                  opt
                )}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
