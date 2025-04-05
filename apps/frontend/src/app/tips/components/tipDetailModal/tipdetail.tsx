import React from 'react';

export const Tipdetail = ({
  selectedTip,
  addNews,
}: {
  selectedTip: { id: number; title: string; description: string };
  addNews: () => void;
}) => {
  return (
    <>
      <p className="font-medium">Description:</p>
      <p>{selectedTip?.description}</p>
      <button
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        onClick={() => {
          addNews();
        }}
      >
        Add News
      </button>
    </>
  );
};
