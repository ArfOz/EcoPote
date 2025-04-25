'use client';
import React, { useEffect, useState, useRef } from 'react';
import { fetchWithAuth } from '@utils';
import { useRouter } from 'next/navigation';
import {
  ResponseCron,
  ResponseCronUpdateDto,
  ScheduleEnum,
} from '@shared/dtos';
import { CronCreator, CronJobStartTime, CronName } from './croncomponents';

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
        const res: ResponseCron = await fetchWithAuth(
          'cron/get-jobs',
          {},
          true
        );
        setData(res.data);

        console.log('Cron jobs fetched:', res.data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
          if (
            error.message === 'Token is expired' ||
            error.message === 'Unauthorized access'
          ) {
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

  const handleChange = async ({
    id,
    name,
    schedule,
    status,
    startTime,
  }: {
    id: number;
    name?: string;
    schedule?: string;
    status?: boolean;
    startTime?: Date;
  }) => {
    try {
      const body = {
        id,
        ...(name !== undefined && { name }),
        ...(schedule !== undefined && { schedule }),
        ...(status !== undefined && { status }),
        ...(startTime !== undefined && { startTime }),
      };

      const response: ResponseCronUpdateDto = await fetchWithAuth(
        'cron/update-job',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        },
        true
      );

      if (response.success) {
        setData((prevData) =>
          prevData.map((job) => (job.id === id ? response.data : job))
        );
        setEditingName(null);
        setEditingStartTime(null);
      } else {
        console.error('Failed to update cron job', response.message);
      }
    } catch (error) {
      console.error('Failed to update cron job', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetchWithAuth(`cron/delete-job/${id}`, {
        method: 'POST',
      });

      if (response.success) {
        setData((prevData) => prevData.filter((job) => job.id !== id));
      } else {
        console.error('Failed to delete cron job', response.message);
      }
    } catch (error) {
      console.error('Failed to delete cron job', error);
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded shadow-md overflow-x-auto w-full">
      <h2 className="text-lg font-semibold mb-4">Cron Jobs</h2>
      {error && <p className="text-red-500">{error}</p>}
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-2 border-b">ID</th>
            <th className="py-2 px-2 border-b">Name</th>
            <th className="py-2 px-2 border-b">Schedule</th>
            <th className="py-2 px-2 border-b">Created</th>
            <th className="py-2 px-2 border-b">Updated</th>
            <th className="py-2 px-2 border-b">Start Time</th>
            <th className="py-2 px-2 border-b">Status</th>
            <th className="py-2 px-2 border-b">Last Run</th>
            <th className="py-2 px-2 border-b">Next Run</th>
            <th className="py-2 px-2 border-b">Delete</th>
          </tr>
        </thead>
        <tbody>
          {data.map((cronJob) => (
            <tr key={cronJob.id}>
              <td className="py-2 px-2 border-b">{cronJob.id}</td>
              <CronName
                cronJob={cronJob}
                editingName={editingName}
                setEditingName={setEditingName}
                originalNameRef={originalNameRef}
                handleChange={(id: number, name: string) =>
                  handleChange({ id, name })
                }
                data={data}
                setData={setData}
              />
              <td className="py-2 px-2 border-b">
                <select
                  className="ml-2 px-2 py-1 bg-gray-200 rounded"
                  value={cronJob.schedule}
                  onChange={(e) =>
                    handleChange({ id: cronJob.id, schedule: e.target.value })
                  }
                >
                  {Object.values(ScheduleEnum).map((schedule) => (
                    <option key={schedule} value={schedule}>
                      {schedule
                        .replace(/-/g, ' ')
                        .replace(/\b\w/g, (char) => char.toUpperCase())}
                    </option>
                  ))}
                </select>
              </td>
              <td className="py-2 px-2 border-b">
                {new Date(cronJob.createdAt).toLocaleString()}
              </td>
              <td className="py-2 px-2 border-b">
                {new Date(cronJob.updatedAt).toLocaleString()}
              </td>

              <CronJobStartTime
                cronJob={cronJob}
                editingStartTime={editingStartTime}
                setEditingStartTime={setEditingStartTime}
                originalStartTimeRef={originalStartTimeRef}
                handleChange={(id: number, startTime: Date) =>
                  handleChange({ id, startTime })
                }
                data={data}
                setData={setData}
              />
              <td className="py-2 px-2 border-b">
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
                      handleChange({ id: cronJob.id, status: !cronJob.status })
                    }
                  >
                    {cronJob.status ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </td>
              <td className="py-2 px-2 border-b">
                {cronJob.lastRun
                  ? new Date(cronJob.lastRun).toLocaleString()
                  : 'N/A'}
              </td>
              <td className="py-2 px-2 border-b">N/A</td>
              <td className="py-2 px-2 border-b">
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded"
                  onClick={async () => {
                    handleDelete(cronJob.id);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <CronCreator setData={setData} />
    </div>
  );
};
