import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-indigo-700 text-white px-6 py-4 shadow-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold tracking-wide hover:text-indigo-300 transition"
        >
          Custom Form Builder
        </Link>
        <div>
          <Link
            to="/forms"
            className="px-4 py-2 border border-white rounded-md hover:bg-white hover:text-indigo-700 transition"
          >
            All Quizzes
          </Link>
        </div>
      </div>
    </nav>
  );
}
