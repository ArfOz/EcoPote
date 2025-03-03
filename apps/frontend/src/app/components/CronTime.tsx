"use client";

import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '@utils';
import { useRouter } from 'next/navigation';
import { ResponseCron } from '@shared/dtos';

export const CronTime = () => {
  const [data, setData] = useState<ResponseCron['data']>([]);
  const [error, setError] = useState<string | null>(null);

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
            <th className="py-2 px-4 border-b">Time</th>
            <th className="py-2 px-4 border-b">Created</th>
            <th className="py-2 px-4 border-b">Updated</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Last Run</th>
            <th className="py-2 px-4 border-b">Next Run</th>
          </tr>
        </thead>
        <tbody>
          {data.map((cronJob) => (
            <tr key={cronJob.id}>
              
              <td className="py-2 px-4 border-b">{cronJob.id}</td>
              <td className="py-2 px-4 border-b">{cronJob.name}</td>
              <td className="py-2 px-4 border-b">{cronJob.schedule}</td>
              <td className="py-2 px-4 border-b">{cronJob.cronTime}</td>
              <td className="py-2 px-4 border-b">{new Date(cronJob.startTime).toLocaleString()}</td>
              <td className="py-2 px-4 border-b">{new Date(cronJob.startTime).toLocaleString()}</td>
              <td className="py-2 px-4 border-b">{cronJob.status ? 'Active' : 'Inactive'}</td>
              <td className="py-2 px-4 border-b">{cronJob.lastRun ? new Date(cronJob.lastRun).toLocaleString() : 'N/A'}</td>
              <td className="py-2 px-4 border-b">N/A</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

