import React, { useState } from "react";
import axios from "axios";
import CategorizeQuestion from "../components/CategorizeQuestion";
import ClozeQuestion from "../components/ClozeQuestion";
import ComprehensionQuestion from "../components/ComprehensionQuestion";
import ImageUploader from "../components/ImageUploader";

export default function Builder() {
  const [title, setTitle] = useState("My New Form");
  const [headerImage, setHeaderImage] = useState("");
  const [questions, setQuestions] = useState([]);

  const addQuestion = (type) => {
    setQuestions((prev) => [
      ...prev,
      { type, questionText: "", options: [], categories: [], metadata: {} },
    ]);
  };

  const updateQuestion = (idx, patch) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === idx ? { ...q, ...patch } : q))
    );
  };

  const saveForm = async () => {
    const trimmedTitle = title.trim();
    const validQuestions = questions.filter(
      (q) => q.questionText && q.questionText.trim() !== ""
    );

    if (!trimmedTitle) {
      alert("Please enter a form title before saving.");
      return;
    }

    if (validQuestions.length === 0) {
      alert("Please add at least one question with some text before saving.");
      return;
    }

    const payload = {
      title: trimmedTitle,
      headerImage: headerImage.trim(),
      questions: validQuestions,
    };

    try {
      const res = await axios.post("/forms", payload);
      alert("Saved! Form id: " + res.data._id);
      setTitle("My New Form");
      setHeaderImage("");
      setQuestions([]);
    } catch (error) {
      alert("Failed to save form. Try again.");
      console.error(error);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-6 sm:p-10 pb-32">
        {/* Added pb-32 for fixed button space */}
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-6 sm:p-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter form title"
              className="w-full sm:w-auto text-xl sm:text-4xl font-extrabold text-indigo-700 placeholder-indigo-300
                       border-b-4 border-indigo-400 focus:outline-none focus:border-indigo-600
                       transition-all duration-300 shadow-md px-3 py-2 rounded-md"
            />

            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center sm:justify-start w-full sm:w-auto">
              <button
                onClick={() => addQuestion("categorize")}
                className="px-4 py-2 border-2 border-indigo-600 rounded-lg text-indigo-600 font-semibold
                         hover:bg-indigo-600 hover:text-white transition shadow-sm whitespace-nowrap"
              >
                Add Categorize
              </button>
              <button
                onClick={() => addQuestion("cloze")}
                className="px-4 py-2 border-2 border-green-600 rounded-lg text-green-600 font-semibold
                         hover:bg-green-600 hover:text-white transition shadow-sm whitespace-nowrap"
              >
                Add Cloze
              </button>
              <button
                onClick={() => addQuestion("comprehension")}
                className="px-4 py-2 border-2 border-yellow-500 rounded-lg text-yellow-600 font-semibold
                         hover:bg-yellow-500 hover:text-white transition shadow-sm whitespace-nowrap"
              >
                Add Comprehension
              </button>
            </div>
          </div>

          {/* Header Image Upload */}
          <div className="mt-8">
            <label className="block mb-2 font-semibold text-indigo-700">
              Upload Form Header Image (optional)
            </label>
            <ImageUploader value={headerImage} onUpload={setHeaderImage} />
          </div>

          <div className="mt-8 sm:mt-12 space-y-6 sm:space-y-8">
            {questions.map((q, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-8 border border-gray-200 rounded-2xl bg-indigo-50 shadow-md hover:shadow-xl transition"
              >
                {q.type === "categorize" && (
                  <CategorizeQuestion
                    value={q}
                    onChange={(patch) => updateQuestion(idx, patch)}
                  />
                )}
                {q.type === "cloze" && (
                  <ClozeQuestion
                    value={q}
                    onChange={(patch) => updateQuestion(idx, patch)}
                  />
                )}
                {q.type === "comprehension" && (
                  <ComprehensionQuestion
                    value={q}
                    onChange={(patch) => updateQuestion(idx, patch)}
                  />
                )}
              </div>
            ))}
          </div>
          {/* Fixed Save Button at Bottom */}
          <div className="flex justify-end z-50 pointer-events-none mt-4">
            <button
              onClick={saveForm}
              className="pointer-events-auto px-8 py-3 bg-indigo-700 text-white rounded-full font-semibold
                     shadow-xl hover:bg-indigo-800 transition  "
              aria-label="Save Form"
            >
              Save Form
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
