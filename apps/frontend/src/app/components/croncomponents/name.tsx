
import { ResponseCron } from '@shared/dtos';
import React from 'react'

export const Cronname = ({
    cronJob,
    setEditingName,
    originalNameRef,
    editingName,
    setData,
    handleChange
}: {
    cronJob: ResponseCron["data"][0];
    setEditingName: React.Dispatch<React.SetStateAction<number | null>>;
    originalNameRef: React.MutableRefObject<{ [key: number]: string }>;
    editingName: number | null;
    setData: React.Dispatch<React.SetStateAction<ResponseCron["data"]>>; // Add this line
    handleChange: (data: { id: number; name?: string; schedule?: string; status?: boolean; startTime?: Date }) => void; // Add this line
}) => {
  return (
    <td className="py-2 px-4 border-b">
                <input
                  type="text"
                  className="bg-transparent border-none"
                  value={cronJob.name}
                  onFocus={() => {
                    setEditingName(cronJob.id);
                    originalNameRef.current[cronJob.id] = cronJob.name; // Store original name
                  }}
                  onChange={(e) => {
                    setData((prevData) =>
                      prevData.map((job) =>
                        job.id === cronJob.id ? { ...job, name: e.target.value } : job
                      )
                    );
                  }}
                />
                {editingName === cronJob.id && (
                  <div className="flex space-x-2 mt-2">
                    <button
                      className="px-2 py-1 bg-green-500 text-white rounded"
                      onClick={() => handleChange({ id: cronJob.id, name: cronJob.name })}
                    >
                      Save
                    </button>
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded"
                      onClick={() => {
                        setData((prevData) =>
                          prevData.map((job) =>
                            job.id === cronJob.id
                              ? { ...job, name: originalNameRef.current[cronJob.id] }
                              : job
                          )
                        );
                        setEditingName(null);
                      }}
                    >
                      Discard
                    </button>
                  </div>
                )}
              </td>
  )
}

