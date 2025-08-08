import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import ImageUploader from "./ImageUploader";

export default function CategorizeQuestion({ value, onChange }) {
  const {
    questionText = "",
    options = [],
    categories = [],
    questionImage = "",
  } = value || {};

  // Ensure each option has a stable { id, url } format
  const normalizeOptions = (opts) =>
    (opts || []).map((opt) =>
      typeof opt === "string" ? { id: uuidv4(), url: opt } : opt
    );

  const [localOptions, setLocalOptions] = useState(normalizeOptions(options));
  const [categoryInput, setCategoryInput] = useState(categories.join(", "));

  useEffect(() => {
    setLocalOptions(normalizeOptions(options));
    setCategoryInput(categories.join(", "));
  }, [options, categories]);

  const update = (patch) => {
    onChange && onChange({ ...value, ...patch });
  };

  const updateOptionImage = (index, url) => {
    setLocalOptions((prev) => {
      const updated = [...prev];
      if (!updated[index]) {
        updated[index] = { id: uuidv4(), url };
      } else {
        updated[index] = { ...updated[index], url };
      }
      update({ options: updated });
      return updated;
    });
  };

  const handleCategoriesBlur = () => {
    update({
      categories: categoryInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });
  };

  return (
    <div className="border rounded-xl p-6 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
      <label className="block text-lg font-semibold text-indigo-700 mb-3">
        Categorize Question
      </label>

      {/* Question Text */}
      <input
        className="mt-1 w-full border border-gray-300 focus:border-indigo-500 focus:ring-indigo-300
                   rounded-md shadow-sm p-3 text-gray-700 placeholder-gray-400 transition"
        value={questionText}
        onChange={(e) => update({ questionText: e.target.value })}
        placeholder="Enter the question text here"
      />

      {/* Question Image Upload */}
      <div className="mt-6">
        <label className="font-medium text-gray-800 mb-2 block">Question Image</label>
        <ImageUploader
          value={questionImage}
          onUpload={(url) => update({ questionImage: url })}
        />
      </div>

      {/* Option Images */}
      <div className="mt-6">
        <label className="font-medium text-gray-800 mb-2 block">
          Option Images <span className="text-sm text-gray-500">(2 images)</span>
        </label>
        <div className="flex space-x-6 mt-3">
          {[0, 1].map((idx) => (
            <div
              key={localOptions[idx]?.id || idx}
              className="flex flex-col justify-between w-full cursor-pointer hover:scale-105 transform transition duration-300"
            >
              <ImageUploader
                value={localOptions[idx]?.url || ""}
                onUpload={(url) => updateOptionImage(idx, url)}
              />
              <span className="text-sm text-gray-600 mt-2 font-medium">
                Option {idx + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="mt-6">
        <label className="font-medium text-gray-800 mb-2 block">
          Categories (comma separated)
        </label>
        <input
          className="mt-1 w-full border border-gray-300 focus:border-indigo-500 focus:ring-indigo-300
                     rounded-md shadow-sm p-3 text-gray-700 placeholder-gray-400 transition"
          value={categoryInput}
          onChange={(e) => setCategoryInput(e.target.value)}
          onBlur={handleCategoriesBlur}
          placeholder="e.g. Fruits, Animals"
        />
      </div>
    </div>
  );
}
