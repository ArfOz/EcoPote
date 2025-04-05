import React from 'react';

export const NewsPageButton = ({
  totalNews,
  limit,
  page,
  setPage,
}: {
  totalNews: number;
  limit: number;
  page: number;
  setPage: (page: number) => void;
}) => {
  return (
    <>
      {Array.from({ length: Math.ceil(totalNews / limit) }, (_, index) => (
        <button
          key={index}
          onClick={() => setPage(index + 1)}
          className={`px-3 py-1 rounded ${
            page === index + 1
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          {index + 1}
        </button>
      ))}
    </>
  );
};
