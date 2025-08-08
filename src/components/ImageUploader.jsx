import { useState } from "react";
import axios from "axios";

export default function ImageUploader({ onUpload, value }) {
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await axios.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      onUpload(data.url);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {loading && <p>Uploading...</p>}
      {!loading && value && (
        <img src={value} alt="Uploaded" className="mt-2 max-h-40 rounded" />
      )}
    </div>
  );
}
