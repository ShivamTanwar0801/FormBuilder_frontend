import React, { useState, useEffect } from "react";

export default function ClozeQuestion({ value, onChange }) {
  const { questionText = "", underlinedWords = [], questionImage = "" } = value || {};

  const words = questionText.trim().split(/\s+/);

  const [localQuestionText, setLocalQuestionText] = useState(questionText);
  const [localUnderlinedWords, setLocalUnderlinedWords] = useState(underlinedWords);

  useEffect(() => {
    setLocalQuestionText(questionText);
    setLocalUnderlinedWords(underlinedWords);
  }, [questionText, underlinedWords]);

  const toggleUnderline = (index) => {
    const word = words[index];
    if (!word) return;
    const key = `${word}__${index}`;
    let updated = [...localUnderlinedWords];
    if (updated.some((w) => w.key === key)) {
      updated = updated.filter((w) => w.key !== key);
    } else {
      updated.push({ key, word });
    }
    setLocalUnderlinedWords(updated);
    onChange && onChange({ questionText: localQuestionText, underlinedWords: updated, questionImage });
  };

  const handleTextChange = (e) => {
    const text = e.target.value;
    setLocalQuestionText(text);
    setLocalUnderlinedWords([]); // reset underlines on text change
    onChange && onChange({ questionText: text, underlinedWords: [], questionImage });
  };

  return (
    <div>
      <label className="block font-medium mb-2">Cloze (Fill in the blank)</label>
      <textarea
        className="w-full border p-2 rounded resize-y"
        value={localQuestionText}
        onChange={handleTextChange}
        placeholder="Enter your sentence here..."
        rows={3}
      />

      <div className="mt-4">
        <div className="text-sm font-semibold mb-1">Tap words below to underline (make blank):</div>
        <div className="flex flex-wrap gap-2 p-2 border rounded bg-gray-50 min-h-[3rem]">
          {words.map((word, idx) => {
            const key = `${word}__${idx}`;
            const isUnderlined = localUnderlinedWords.some((w) => w.key === key);
            return (
              <span
                key={key}
                onClick={() => toggleUnderline(idx)}
                className={`cursor-pointer select-none px-2 py-1 rounded ${
                  isUnderlined
                    ? "underline decoration-indigo-600 font-semibold text-indigo-700"
                    : "text-gray-700 hover:bg-indigo-100"
                }`}
                title={isUnderlined ? "Click to remove underline" : "Click to underline"}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>

      {localUnderlinedWords.length > 0 && (
        <div className="mt-4">
          <div className="text-sm font-semibold mb-1">Draggable Options (preview only):</div>
          <div className="flex flex-wrap gap-3 p-2 border rounded bg-indigo-50">
            {localUnderlinedWords.map(({ key, word }) => (
              <div
                key={key}
                className="bg-indigo-600 text-white px-3 py-1 rounded select-none shadow cursor-move"
                draggable
                onDragStart={(e) => e.dataTransfer.setData("text/plain", word)}
              >
                {word}
              </div>
            ))}
          </div>
        </div>
      )}

      {questionImage && (
        <div className="mt-5">
          <label className="font-medium">Optional Question Image</label>
          <img src={questionImage} alt="Question" className="mt-2 max-h-40 rounded" />
        </div>
      )}
    </div>
  );
}
