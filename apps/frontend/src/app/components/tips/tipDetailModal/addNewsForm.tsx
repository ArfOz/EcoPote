import React from 'react';

export const AddNewsForm = ({
  newsTitle,
  setNewsTitle,
  addNewsBackend,
  setFile,
  selectedTip,
}: {
  newsTitle: string;
  setNewsTitle: (title: string) => void;
  addNewsBackend: (id: number) => Promise<void>;
  setFile: (file: File | null) => void;
  selectedTip: { id: number };
}) => {
  return (
    <div className="mt-4">
      <textarea
        className="w-full p-2 border border-gray-300 rounded mb-2"
        placeholder="News Title"
        value={newsTitle}
        onChange={(e) => setNewsTitle(e.target.value)}
      />

      <input
        type="file"
        className="w-full p-2 border border-gray-300 rounded mb-2"
        accept=".htm,.html"
        onChange={(e) => {
          const selectedFile = e.target.files ? e.target.files[0] : null;
          setFile(selectedFile);
        }}
        required
      />
      <button
        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
        onClick={() => addNewsBackend(selectedTip.id)}
      >
        Submit News
      </button>
    </div>
  );
};
