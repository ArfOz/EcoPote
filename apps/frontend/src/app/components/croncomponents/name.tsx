import { ResponseCron } from '@shared/dtos';
import React from 'react';

export const Cronname = ({
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
  setData: React.Dispatch<React.SetStateAction<ResponseCron['data']>>; // Add this line
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
    console.log('handleSave called with id:', id);
    const updatedJob = data.find((job) => job.id === id);
    console.log('updatedJob:', updatedJob?.name);
    if (updatedJob) {
      handleChange(id, updatedJob.name);
    }
    setEditingName(null);
    delete originalNameRef.current[id]; // Remove the stored original start time
  };

  const handleDiscard = (id: number) => {
    console.log(' handleeeeee', cronJob.name);
    setData((prevData) =>
      prevData.map((job) =>
        job.id === id
          ? { ...job, name: originalNameRef.current[id] } // Revert to the original start time
          : job
      )
    );
    setEditingName(null);
  };

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
        // onBlur={() => {
        //   setEditingName(null);
        // }}
        onChange={(e) => {
          handleNameChange(e, cronJob.id);
        }}
      />
      {editingName === cronJob.id && (
        <div className="flex space-x-2 mt-2">
          <button
            className="px-2 py-1 bg-green-500 text-white rounded"
            onClick={() => {
              handleSave(cronJob.id);
            }}
          >
            Save
          </button>
          <button
            className="px-2 py-1 bg-red-500 text-white rounded"
            onClick={() => {
              console.log(' handleeeeee', cronJob.name);
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
