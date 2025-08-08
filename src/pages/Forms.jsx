import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Forms() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axios.get("/forms");
        const data = res.data;
        if (mounted) setForms(Array.isArray(data) ? data : []);
      } catch (e) {
        if (mounted) setError(e.message || "Failed to load forms");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading)
    return (
      <div className="p-8 flex justify-center items-center text-indigo-600 text-lg font-semibold">
        Loading forms…
      </div>
    );

  if (error)
    return (
      <div className="p-8 text-center text-red-600 font-semibold">
        Error: {error}
      </div>
    );

  if (!forms.length)
    return (
      <div className="p-8 text-center text-gray-600 text-lg">
        <h1 className="text-2xl font-bold mb-4">All Forms</h1>
        <p>No forms found.</p>
      </div>
    );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold text-indigo-700 mb-8 text-center">
        All Quizzes
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {forms.map((form) => (
          <button
            key={form._id}
            onClick={() => navigate(`/form/${form._id}`)}
            className="group bg-white rounded-xl border border-gray-200 shadow-sm 
      hover:shadow-lg transition-shadow duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300
      flex flex-col overflow-hidden"
            aria-label={`View form: ${form.title || "Untitled form"}`}
          >
            <img
              src={form.headerImage ? form.headerImage : "/Form.jpg"}
              alt={form.title ? `${form.title} header` : "Default form header"}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="p-5 flex flex-col flex-grow bg-blue-200/30">
              <h2 className="text-xl font-semibold text-gray-700 mb-2 truncate">
                {form.title || "Untitled form"}
              </h2>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
