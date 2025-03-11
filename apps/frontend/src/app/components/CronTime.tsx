import React, { useEffect, useState, useRef, useCallback } from 'react';
import { fetchWithAuth } from '@utils';
import { useRouter } from 'next/navigation';
import { ResponseCron, ResponseCronUpdateDto, ScheduleEnum } from '@shared/dtos';

export const CronTime = () => {
  const [data, setData] = useState<ResponseCron['data']>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<number | null>(null);
  const [editingStartTime, setEditingStartTime] = useState<number | null>(null);
  const originalNameRef = useRef<{ [key: number]: string }>({}); // Store original names
  const originalStartTimeRef = useRef<{ [key: number]: Date }>({}); // Store original start times

  const router = useRouter();

  useEffect(() => {
    const fetchCronJobs = async () => {
      try {
        const res: ResponseCron = await fetchWithAuth('cron/get-jobs', {}, false);
        setData(res.data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
          if (error.message === 'Token is expired' || error.message === 'Unauthorized access') {
            localStorage.removeItem('token');
            router.push('/login');
          }
        } else {
          setError('An unknown error occurred');
        }
      }
    };

    fetchCronJobs();
  }, [router]);

  const handleChange = async ({ id, name, schedule, status, startTime }: { id: number; name?: string; schedule?: string; status?: boolean; startTime?: Date }) => {
    try {
      const body = { id, ...(name !== undefined && { name }), ...(schedule !== undefined && { schedule }), ...(status !== undefined && { status }), ...(startTime !== undefined && { startTime }) };
      const response: ResponseCronUpdateDto = await fetchWithAuth('cron/update-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.success) {
        setData((prevData) => prevData.map((job) => (job.id === id ? response.data : job)));
        setEditingName(null);
        setEditingStartTime(null);
        console.log('Cron job updated successfully');
      } else {
        console.error('Failed to update cron job', response.message);
      }
    } catch (error) {
      console.error('Failed to update cron job', error);
    }
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
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

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (editingStartTime !== null && !event.composedPath().some(el => (el as HTMLElement).classList?.contains('datetime-input'))) {
      // Do not set editingStartTime to null here to keep the buttons visible
    } else if (editingName !== null && !event.composedPath().some(el => (el as HTMLElement).classList?.contains('bg-transparent'))) {
      setEditingName(null);
    }
  }, [editingStartTime, editingName]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleSave = (id: number) => {
    const updatedJob = data.find((job) => job.id === id);
    if (updatedJob) {
      handleChange({ id, startTime: updatedJob.startTime });
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
    // Do not delete originalStartTimeRef.current[id] here
  };

  return (
    <div className="bg-gray-100 p-4 rounded shadow-md">
      <h2 className="text-lg font-semibold mb-4">Cron Jobs</h2>
      {error && <p className="text-red-500">{error}</p>}
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Schedule</th>
            <th className="py-2 px-4 border-b">Created</th>
            <th className="py-2 px-4 border-b">Updated</th>
            <th className="py-2 px-4 border-b">Start Time</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Last Run</th>
            <th className="py-2 px-4 border-b">Next Run</th>
          </tr>
        </thead>
        <tbody>
          {data.map((cronJob) => (
            <tr key={cronJob.id}>
              <td className="py-2 px-4 border-b">{cronJob.id}</td>
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
              <td className="py-2 px-4 border-b">
                <select
                  className="ml-2 px-2 py-1 bg-gray-200 rounded"
                  value={cronJob.schedule}
                  onChange={(e) => handleChange({ id: cronJob.id, schedule: e.target.value })}
                >
                  {Object.values(ScheduleEnum).map((schedule) => (
                    <option key={schedule} value={schedule}>
                      {schedule.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                    </option>
                  ))}
                </select>
              </td>
              <td className="py-2 px-4 border-b">{new Date(cronJob.createdAt).toLocaleString()}</td>
              <td className="py-2 px-4 border-b">{new Date(cronJob.updatedAt).toLocaleString()}</td>

              <td className="py-2 px-4 border-b relative">
                <input
                  type="datetime-local"
                  className="ml-2 px-2 py-1 bg-gray-200 rounded z-10 datetime-input"
                  value={cronJob.startTime ? new Date(cronJob.startTime).toISOString().substring(0, 16) : ''}
                  onFocus={() => {
                    setEditingStartTime(cronJob.id);
                    originalStartTimeRef.current[cronJob.id] = new Date(cronJob.startTime); // Store original start time       
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
              <td className="py-2 px-4 border-b">
                <div className="flex flex-col items-center">
                  <div>
                    <span
                      className={`inline-block w-3 h-3 rounded-full ${
                        cronJob.status ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    ></span>
                    <span className="ml-2">
                      {cronJob.status ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <button
                    className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
                    onClick={() =>
                      handleChange({id:cronJob.id, status:!cronJob.status})
                    }
                  >
                    {cronJob.status ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </td>
              <td className="py-2 px-4 border-b">
                {cronJob.lastRun ? new Date(cronJob.lastRun).toLocaleString() : 'N/A'}
              </td>
              <td className="py-2 px-4 border-b">N/A</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};