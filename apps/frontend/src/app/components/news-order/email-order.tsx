'use client';
import { ResponseNewsOrderDto } from '@shared/dtos';
import { fetchWithAuth } from '@utils';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { handleAuthError } from '../error'; // Adjust the import path if needed

export const Newsorder = () => {
  const [data, setData] = useState<ResponseNewsOrderDto['data'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchNewsOrder = async () => {
      try {
        const res: ResponseNewsOrderDto = await fetchWithAuth(
          'tips/newsorder',
          {},
          true
        );
        setData(res.data);
      } catch (error) {
        handleAuthError(error, setError, router);
        console.error('Error fetching news order:', error);
      }
    };

    fetchNewsOrder();
  }, [router]);

  return (
    <>
      <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 py-10">
        <h1 className="text-2xl font-bold mb-4">News Order</h1>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Title</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Created At</th>
              <th className="py-3 px-6 text-left">Updated At</th>
              <th className="py-3 px-6 text-left">Tips</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, index) => (
              <tr
                key={item.id}
                onClick={() => {
                  const newWindow = window.open();
                  if (newWindow) {
                    newWindow.document.write(item.content);
                    newWindow.document.close();
                  }
                }}
                className={`${
                  index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                } hover:bg-gray-200 cursor-pointer`}
              >
                <td className="py-3 px-6">{item.id}</td>
                <td className="py-3 px-6">{item.title}</td>
                <td className="py-3 px-6">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      item.status
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {item.status ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 px-6">
                  {new Date(item.createdAt).toLocaleString()}
                </td>
                <td className="py-3 px-6">
                  {new Date(item.updatedAt).toLocaleString()}
                </td>
                <td className="py-3 px-6">{item.tips.title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
