import { Route, Routes } from "react-router-dom";
import Builder from "./pages/Builder";
import Preview from "./pages/Preview";
import axios from "axios";
import Forms from "./pages/Forms";
import Navbar from "./Navbar";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

axios.defaults.baseURL = API_BASE;


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Builder />} />
        <Route path="/forms" element={<Forms />} />
        <Route path="/form/:id" element={<Preview />} />
      </Routes>
    </>
  );
}

export default App;
