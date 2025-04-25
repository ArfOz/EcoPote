'use client';
import { ResponseEmailOrderDto } from '@shared/dtos';
import { fetchWithAuth } from '@utils';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export const Emailorder = () => {
  const [data, setData] = useState<ResponseEmailOrderDto['data'] | null>(null);

  useEffect(() => {
    const fetchEmailOrder = async () => {
      try {
        const res: ResponseEmailOrderDto = await fetchWithAuth(
          'email/emailsorder',
          {},
          true
        );
        setData(res.data);
      } catch (error) {
        console.error('Error fetching email order:', error);
      }
    };

    fetchEmailOrder();
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 py-10">
        <h1 className="text-2xl font-bold mb-4">Email Order</h1>
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
                className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-200`}
              >
                <td className="py-3 px-6">{item.id}</td>
                <td className="py-3 px-6">
                  <Link
                    href={`/email-order/${item.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {item.title}
                  </Link>
                </td>
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
