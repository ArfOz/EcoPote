import React from 'react';

export const TipsComponent = ({
  tips,
  handleTipClick,
  page,
}: {
  tips: any[];
  handleTipClick: (id: number) => void;
  page: number;
}) => {
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
