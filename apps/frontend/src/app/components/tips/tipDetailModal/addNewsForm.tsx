import React from 'react';

export const AddNewsForm = ({
  newsTitle,
  setNewsTitle,
  addNewsBackend,
  setFile,
  selectedTip,
  setNewsStatus,
  newsStatus,
}: {
  newsTitle: string;
  setNewsTitle: (title: string) => void;
  addNewsBackend: (id: number) => Promise<void>;
  setFile: (file: File | null) => void;
  setNewsStatus: (status: 'true' | 'false') => void;
  newsStatus: 'true' | 'false';
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
      <div className="mb-4">
        <label
          htmlFor="subscription"
          className="block text-gray-700 font-bold mb-2"
        >
          Active:
        </label>
        <input
          type="checkbox"
          id="subscription"
          name="subscription"
          className="mr-2 leading-tight"
          checked={newsStatus === 'true'}
          onChange={(e) => setNewsStatus(e.target.checked ? 'true' : 'false')}
        />
        <span className="text-sm">Yes</span>
      </div>
      <button
        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
        onClick={() => addNewsBackend(selectedTip.id)}
      >
        Submit News
      </button>
    </div>
  );
};
