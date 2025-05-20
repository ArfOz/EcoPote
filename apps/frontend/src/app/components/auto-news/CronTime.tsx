'use client';
import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '@utils';
import { useRouter } from 'next/navigation';
import {
  ResponseCron,
  ResponseCronUpdateDto,
  ScheduleEnum,
} from '@shared/dtos';
import { CronCreator } from '.';

export const CronTime = () => {
  const [data, setData] = useState<ResponseCron['data']>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingCron, setEditingCron] = useState<number | null>(null);
  const [tempCron, setTempCron] = useState<
    Partial<{
      id: number;
      name: string;
      schedule: string;
      status: boolean;
      startTime: Date;
      nextRun: Date;
      lastRun: Date;
      createdAt: Date;
      updatedAt: Date;
    }>
  >({});

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

      console.log('body', body);

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

  const handleSave = async () => {
    if (!tempCron.id) return;
    await handleChange(tempCron as any);
    setEditingCron(null);
    setTempCron({});
  };

  const handleCancel = () => {
    setData((prev) =>
      prev.map((job) =>
        job.id === editingCron
          ? ((orig) => ({ ...orig }))(prev.find((j) => j.id === editingCron)!)
          : job
      )
    );
    setEditingCron(null);
    setTempCron({});
  };

  return (
    <div className="bg-gray-100 p-4 rounded shadow-md overflow-x-auto w-full">
      <h2 className="text-lg font-semibold mb-4 text-center">Cron Jobs</h2>
      {error && <p className="text-red-500">{error}</p>}
      <table className="min-w-full bg-white border border-gray-300 text-center">
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
            <th className="py-2 px-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((cronJob) => (
            <tr key={cronJob.id}>
              <td className="py-2 px-2 border-b">{cronJob.id}</td>
              <td className="py-2 px-2 border-b">
                {editingCron === cronJob.id ? (
                  <input
                    value={tempCron.name}
                    onChange={(e) =>
                      setTempCron({ ...tempCron, name: e.target.value })
                    }
                    className="px-1 border"
                  />
                ) : (
                  cronJob.name
                )}
              </td>
              <td className="py-2 px-2 border-b">
                {editingCron === cronJob.id ? (
                  <select
                    value={tempCron.schedule}
                    onChange={(e) =>
                      setTempCron({ ...tempCron, schedule: e.target.value })
                    }
                    className="px-1 border"
                  >
                    {Object.values(ScheduleEnum).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                ) : (
                  cronJob.schedule
                )}
              </td>
              <td className="py-2 px-2 border-b">
                {new Date(cronJob.createdAt).toLocaleString()}
              </td>
              <td className="py-2 px-2 border-b">
                {new Date(cronJob.updatedAt).toLocaleString()}
              </td>
              <td className="py-2 px-2 border-b">
                {editingCron === cronJob.id ? (
                  <input
                    type="datetime-local"
                    value={new Date(tempCron.startTime!)
                      .toISOString()
                      .slice(0, 16)}
                    onChange={(e) =>
                      setTempCron({
                        ...tempCron,
                        startTime: new Date(e.target.value),
                      })
                    }
                    className="px-1 border"
                  />
                ) : (
                  new Date(cronJob.startTime).toLocaleString()
                )}
              </td>
              <td className="py-2 px-2 border-b">
                {editingCron === cronJob.id ? (
                  <input
                    type="checkbox"
                    checked={tempCron.status}
                    onChange={(e) =>
                      setTempCron({ ...tempCron, status: e.target.checked })
                    }
                  />
                ) : (
                  <span
                    className={`inline-block w-3 h-3 rounded-full ${
                      cronJob.status ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  ></span>
                )}
              </td>

              <td className="py-2 px-2 border-b">
                {cronJob.lastRun
                  ? new Date(cronJob.lastRun).toLocaleString()
                  : '-'}
              </td>
              <td className="py-2 px-2 border-b">
                {cronJob.nextRun
                  ? new Date(cronJob.nextRun).toLocaleString()
                  : '-'}
              </td>

              <td className="py-2 px-2 border-b">
                {editingCron === cronJob.id ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="px-2 py-1 bg-green-500 text-white rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-2 py-1 bg-gray-400 text-white rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingCron(cronJob.id);
                        setTempCron({
                          id: cronJob.id,
                          name: cronJob.name,
                          schedule: cronJob.schedule,
                          status: cronJob.status,
                          startTime: new Date(cronJob.startTime),
                        });
                      }}
                      className="px-2 py-1 bg-blue-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cronJob.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && <CronCreator setData={setData} />}
    </div>
  );
};
