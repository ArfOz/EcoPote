import React from 'react';
import { ResponseCron } from '@shared/dtos';

export const CronJobStartTime = ({
  cronJob,
  setEditingStartTime,
  originalStartTimeRef,
  editingStartTime,
  handleChange,
  data,
  setData,
}: {
  cronJob: ResponseCron['data'][0];
  setEditingStartTime: React.Dispatch<React.SetStateAction<number | null>>;
  originalStartTimeRef: React.MutableRefObject<{ [key: string]: Date }>;
  editingStartTime: number | null;
  handleChange: (id: number, startTime: Date) => Promise<void>; // Add this line
  data: ResponseCron['data'];
  setData: React.Dispatch<React.SetStateAction<ResponseCron['data']>>; // Add this line
}) => {
  const handleStartTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const selectedTime = new Date(e.target.value).getTime();
    const now = new Date().getTime();

    const oneHourLater = now + 60 * 60 * 1000;
    if (selectedTime < oneHourLater) {
      alert('Start time must be at least 60 minutes in the future');
      return;
    }
    setData((prevData) =>
      prevData.map((job) =>
        job.id === id ? { ...job, startTime: new Date(selectedTime) } : job
      )
    );
  };

  const handleSave = (id: number) => {
    const updatedJob = data.find((job) => job.id === id);
    if (updatedJob) {
      handleChange(id, updatedJob.startTime);
    }
    setEditingStartTime(null);
    delete originalStartTimeRef.current[id]; // Remove the stored original start time
  };

  const handleDiscard = (id: number) => {
    setData((prevData) =>
      prevData.map((job) =>
        job.id === id
          ? { ...job, startTime: originalStartTimeRef.current[id] } // Revert to the original start time
          : job
      )
    );
    setEditingStartTime(null);
  };

  return (
    <td className="py-2 px-4 border-b relative">
      <input
        type="datetime-local"
        className="ml-2 px-2 py-1 bg-gray-200 rounded z-10 datetime-input"
        value={
          cronJob.startTime
            ? new Date(cronJob.startTime).toISOString().substring(0, 16)
            : ''
        }
        onFocus={() => {
          setEditingStartTime(cronJob.id);
          originalStartTimeRef.current[cronJob.id] = new Date(
            cronJob.startTime
          ); // Store original start time
        }}
        onChange={(e) => handleStartTimeChange(e, cronJob.id)}
      />
      {editingStartTime === cronJob.id && (
        <div className="flex space-x-2 mt-2 z-0">
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
