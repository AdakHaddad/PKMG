"use client";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [prompt, setPrompt] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);
  const [fileEnter, setFileEnter] = useState(false);
  const [file, setFile] = useState<string>();

  const handleProcess = async () => {
    try {
      const response = await axios.post("/api/process", { prompt });
      setResult(response.data.result);
    } catch (error) {
      console.error("Error processing prompt:", error);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFileEnter(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFileEnter(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileUpload(droppedFile);
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("prompt", prompt);

    try {
      const response = await axios.post("/api/process", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResult(response.data.result);
    } catch (error) {
      console.error("Error processing file:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12">
      <div className="w-2/3 p-6 border-dashed border-2 border-gray-300 rounded-lg bg-white text-center">
        <input
          className="w-full p-2 border text-black border-gray-300 rounded-lg mb-4"
          type="text"
          placeholder="Tulis kebutuhan atau pertanyaan Anda"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <div
          className={`${
            fileEnter ? "border-4" : "border-2"
          } mx-auto bg-white flex flex-col w-full max-w-xs h-72 border-dashed items-center justify-center`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <label
            htmlFor="file"
            className="h-full flex flex-col justify-center text-center"
          >
            Click to upload or drag and drop
          </label>
          <input
            id="file"
            type="file"
            className="hidden"
            onChange={(e) => {
              let files = e.target.files;
              if (files && files[0]) {
                let blobUrl = URL.createObjectURL(files[0]);
                setFile(blobUrl);
                handleFileUpload(files[0]);
              }
            }}
          />
        </div>

        <button
          onClick={handleProcess}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg mt-4"
        >
          Proses
        </button>
      </div>

      <div>
        {result && (
          <div className="flex mt-6 p-4 border text-black border-gray-300 rounded-lg bg-white">
            <h2 className="text-xl font-bold">Hasil:</h2>
            <pre className="mt-2 text-left whitespace-pre-line">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
