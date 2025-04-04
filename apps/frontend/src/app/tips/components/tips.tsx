import { Tips } from '@prisma/client';
import { ResponseTipsDetails, ResponseTipNews } from '@shared/dtos';
import { fetchWithAuth } from '@utils';
import React from 'react';

export const TipsComponent = ({
  tips,
  setSelectedTip,
  setError,
  setSelectedTipNews,
}: {
  tips: Tips[];
  setSelectedTip: (tip: ResponseTipsDetails['data']) => void;
  setError: (error: string) => void;
  setSelectedTipNews: (news: ResponseTipNews['data'] | null) => void;
}) => {
  const handleTipClick = async (id: number) => {
    try {
      const tipData: ResponseTipsDetails = await fetchWithAuth(
        `admin/tips/${id}`,
        {},
        false
      );

      const page = 1; // Set the page number you want to fetch
      const limit = 5; // Set the limit for the number of news items to fetch

      const tipNews: ResponseTipNews = await fetchWithAuth(
        `admin/tips/news/${id}?page=${page}&limit=${limit}`,
        {},
        false
      );

      const news = tipNews.data;
      setSelectedTipNews(news);
      const data = tipData.data;
      if (data) {
        setSelectedTip(data);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Created At</th>
            <th className="py-2 px-4 border-b">Updated At</th>
          </tr>
        </thead>
        <tbody>
          {tips.map((tip, index) => (
            <tr
              key={index}
              onClick={() => handleTipClick(tip.id)}
              className="hover:bg-gray-50 cursor-pointer"
            >
              <td className="py-2 px-4 border-b">{tip.id}</td>
              <td className="py-2 px-4 border-b">{tip.title}</td>
              <td className="py-2 px-4 border-b">{tip.description}</td>
              <td className="py-2 px-4 border-b">{tip.createdAt.toString()}</td>
              <td className="py-2 px-4 border-b">{tip.updatedAt.toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
