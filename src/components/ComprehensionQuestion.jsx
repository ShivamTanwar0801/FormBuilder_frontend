import React, { useState } from 'react';
import ImageUploader from './ImageUploader';

export default function ComprehensionQuestion({ value, onChange }) {
  const {
    passageTitle = '',
    passage = '',
    questionText = '',
    options = [],
    questionImage = '',
  } = value || {};

  const [newOption, setNewOption] = useState('');

  const update = (patch) => onChange && onChange({ ...value, ...patch });

  const addOption = () => {
    const trimmed = newOption.trim();
    if (trimmed && !options.includes(trimmed)) {
      update({ options: [...options, trimmed] });
      setNewOption('');
    }
  };

  const removeOption = (optToRemove) => {
    update({ options: options.filter((opt) => opt !== optToRemove) });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addOption();
    }
  };

  return (
    <div>
      <label className="block font-medium">Comprehension Passage Title</label>
      <input
        type="text"
        className="mt-1 w-full border p-2 rounded"
        value={passageTitle}
        onChange={(e) => update({ passageTitle: e.target.value })}
        placeholder="Enter passage title..."
      />

      <label className="block font-medium mt-4">Comprehension Passage</label>
      <textarea
        className="mt-1 w-full border p-2 rounded"
        value={passage}
        onChange={(e) => update({ passage: e.target.value })}
        rows={4}
        placeholder="Enter comprehension passage..."
      />

      <label className="block font-medium mt-4">Question</label>
      <input
        type="text"
        className="mt-1 w-full border p-2 rounded"
        value={questionText}
        onChange={(e) => update({ questionText: e.target.value })}
        placeholder="Enter question..."
      />

      <label className="block font-medium mt-4">Options</label>
      <div className="flex gap-2 mt-1">
        <input
          type="text"
          className="flex-grow border p-2 rounded"
          placeholder="Type option and press Add"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          onClick={addOption}
          className="bg-indigo-600 text-white px-4 rounded hover:bg-indigo-700 transition"
        >
          Add
        </button>
      </div>

      <ul className="mt-2 space-y-1">
        {options.map((opt, idx) => (
          <li
            key={idx}
            className="flex items-center justify-between bg-indigo-50 rounded px-3 py-1"
          >
            <span>{opt}</span>
            <button
              type="button"
              onClick={() => removeOption(opt)}
              className="text-red-600 hover:text-red-800 font-bold"
              aria-label={`Remove option ${opt}`}
            >
              &times;
            </button>
          </li>
        ))}
      </ul>

      <label className="block font-medium mt-4">Optional Question Image</label>
      <ImageUploader
        value={questionImage}
        onUpload={(url) => update({ questionImage: url })}
      />
    </div>
  );
}
