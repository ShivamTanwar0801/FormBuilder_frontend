import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CategorizePreview from "../components/CategorizePreview";
import ClozePreview from "../components/ClozePreview";
import ComprehensionPreview from "../components/ComprehensionPreview";

export default function Preview() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [resetKey, setResetKey] = useState(0); // to force remount of question components

  useEffect(() => {
    setLoading(true);
    setError(null);
    setAnswers({}); // Clear answers when form changes
    setResetKey((k) => k + 1); // reset child components when form changes

    axios
      .get(`/forms/${id}`)
      .then((res) => setForm(res.data))
      .catch(() => setError("Failed to load form"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (qidx, value) => {
    setAnswers((prev) => ({ ...prev, [qidx]: value }));
  };

  const validateAnswers = () => {
    if (!form) return false;

    return form.questions.every((_, idx) => {
      const ans = answers[idx];
      if (ans === undefined || ans === null) return false;

      if (typeof ans === "string") {
        return ans.trim() !== "";
      }

      if (typeof ans === "object") {
        return Object.values(ans).every(
          (v) =>
            v !== null &&
            v !== undefined &&
            !(typeof v === "string" && v.trim() === "")
        );
      }

      return true;
    });
  };

  const submit = async () => {
    if (!validateAnswers()) {
      alert("Please answer all questions before submitting.");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post("/responses", {
        formId: id,
        answers,
      });
      alert("Submitted — thank you!");
      setAnswers({});
      setResetKey((k) => k + 1); // force reset of child components after submit
    } catch {
      alert("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6">Loading form...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  const groupedQuestions = form.questions.reduce((acc, q, idx) => {
    acc[q.type] = acc[q.type] || [];
    acc[q.type].push({ question: q, globalIndex: idx });
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-2xl">
        <h1 className="text-3xl font-extrabold mb-6 text-indigo-700">
          {form.title}
        </h1>
        {form.headerImage && (
          <img
            src={form.headerImage}
            alt="header"
            className="w-full h-52 object-cover rounded-2xl mb-8 shadow-md"
          />
        )}

        <div className="space-y-12">
          {Object.entries(groupedQuestions).map(([type, questions]) => (
            <section key={type}>
              <h2
                className="text-xl font-semibold mb-5 uppercase tracking-wide
               text-indigo-500 border-b border-indigo-300 pb-1"
              >
                {type} Questions
              </h2>
              <div className="space-y-8">
                {questions.map(({ question, globalIndex }) => (
                  <div
                    key={question._id || globalIndex}
                    className="bg-gradient-to-tr from-white via-indigo-50 to-white
                   p-6 rounded-2xl shadow-lg border border-indigo-200
                   hover:shadow-2xl transition-transform duration-300 transform hover:-translate-y-1"
                  >
                    {type === "categorize" && (
                      <CategorizePreview
                        question={question}
                        onChange={(v) => handleChange(globalIndex, v)}
                        key={`${resetKey}-${globalIndex}`}
                      />
                    )}
                    {type === "cloze" && (
                      <ClozePreview
                        question={question}
                        onChange={(v) => handleChange(globalIndex, v)}
                        key={`${resetKey}-${globalIndex}`}
                      />
                    )}
                    {type === "comprehension" && (
                      <ComprehensionPreview
                        question={question}
                        onChange={(v) => handleChange(globalIndex, v)}
                        key={`${resetKey}-${globalIndex}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 text-right">
          <button
            onClick={submit}
            disabled={submitting}
            className={`px-6 py-3 rounded-full text-white font-semibold shadow-lg
              ${
                submitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
