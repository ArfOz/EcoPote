import React from 'react';
import { ResponseCron } from '@shared/dtos';

export const CronName = ({
  cronJob,
  setEditingName,
  originalNameRef,
  editingName,
  handleChange,
  data,
  setData,
}: {
  cronJob: ResponseCron['data'][0];
  setEditingName: React.Dispatch<React.SetStateAction<number | null>>;
  originalNameRef: React.MutableRefObject<{ [key: number]: string }>;
  editingName: number | null;
  handleChange: (id: number, name: string) => Promise<void>;
  data: ResponseCron['data'];
  setData: React.Dispatch<React.SetStateAction<ResponseCron['data']>>;
}) => {
  const handleNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    setData((prevData) =>
      prevData.map((job) =>
        job.id === id ? { ...job, name: e.target.value } : job
      )
    );
  };

  const handleSave = (id: number) => {
    const updatedJob = data.find((job) => job.id === id);
    console.log('updatedJob', updatedJob);
    if (!updatedJob) {
      console.error('Job not found');
    }
    if (updatedJob) {
      handleChange(id, updatedJob.name)
        .then(() => {
          console.log('handleChange resolved');
        })
        .catch((error) => {
          console.error('handleChange error:', error);
        });
    }
    setEditingName(null);
    delete originalNameRef.current[id];
  };

  const handleDiscard = (id: number) => {
    console.log('handleDiscard called with id:', id);
    setData((prevData) =>
      prevData.map((job) =>
        job.id === id ? { ...job, name: originalNameRef.current[id] } : job
      )
    );
    setEditingName(null);
  };

  return (
    <td className="py-2 px-4 border-b relative">
      <input
        type="text"
        className="ml-2 px-2 py-1 bg-gray-200 rounded z-10 name-input"
        value={cronJob.name}
        onFocus={() => {
          setEditingName(cronJob.id);
          originalNameRef.current[cronJob.id] = cronJob.name;
          console.log('onFocus called with id:', cronJob.id);
        }}
        onChange={(e) => handleNameChange(e, cronJob.id)}
      />
      {editingName === cronJob.id && (
        <div className="flex space-x-2 mt-2 z-0">
          <button
            type="submit"
            className="px-2 py-1 bg-green-500 text-white rounded"
            onClick={() => {
              handleSave(cronJob.id);
            }}
          >
            Save
          </button>
          <button
            type="button"
            className="px-2 py-1 bg-red-500 text-white rounded"
            onClick={() => {
              handleDiscard(cronJob.id);
            }}
          >
            Discard
          </button>
        </div>
      )}
    </td>
  );
};
