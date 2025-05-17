'use client';
import { News } from '@prisma/client';
import React from 'react';

export const TipDetailComplete = ({
  selectedTipNews,
  handleDeleteNews,
}: {
  selectedTipNews: News[];
  handleDeleteNews: (id: number) => Promise<void>;
}) => {
  return (
    <div>
      <ul className="space-y-2">
        {selectedTipNews.map((newsItem, index) => (
          <li key={index} className="text-sm text-gray-500">
            <p>News Name: {newsItem.title}</p>
            <button
              className="text-blue-500 hover:underline"
              onClick={() => {
                const newWindow = window.open();
                if (newWindow) {
                  newWindow.document.write(newsItem.content);
                  newWindow.document.close();
                }
              }}
            >
              <span className="text-blue-500 hover:underline">
                View Content
              </span>
            </button>
            <button
              className="text-red-500 hover:underline ml-2"
              onClick={async () => {
                handleDeleteNews(newsItem.id);
              }}
            >
              Delete
            </button>
            <p className="text-xs text-gray-400">
              Created At: {new Date(newsItem.createdAt).toLocaleString()}
            </p>
            <p className="text-xs text-gray-400">
              Updated At: {new Date(newsItem.updatedAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};
