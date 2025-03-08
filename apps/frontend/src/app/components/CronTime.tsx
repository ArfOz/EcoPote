'use client';

import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '@utils';
import { useRouter } from 'next/navigation';
import { ResponseCron, ResponseCronUpdateDto, ScheduleEnum } from '@shared/dtos';

export const CronTime = () => {
  const [data, setData] = useState<ResponseCron['data']>([]);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchCronJobs = async () => {
      try {
        const res: ResponseCron = await fetchWithAuth(
          'cron/get-jobs',
          {},
          false
        );
        setData(res.data);
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

  const handleChange = async ({id, status, schedule}:{id: number, status?: boolean, schedule?: string}) => {
    try {

      const body :{ id: number; status?: boolean; schedule?: string } = {
        id,
        ...(status !== undefined && { status }),
        ...(schedule !== undefined && { schedule }),
      };
      const response: ResponseCronUpdateDto = await fetchWithAuth(
        'cron/update-job',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      console.log("response", response);

      if (response.success) {
        // Update the local state with the new status or schedule
        
        setData([response.data]);

        console.log('Cron job updated successfully');
      } else {
        console.error('Failed to update cron job', response.message);
      }
    } catch (error) {
      console.error('Failed to update cron job', error);
    } 
  };

  // // Function to handle schedule change
  // const handleScheduleChange = async (id: number, schedule: string) => {
  //   try {
  //     const response: ResponseCronUpdateDto = await fetchWithAuth(
  //       'cron/update-job',
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ id, schedule }),
  //       }
  //     );
  //     if (response.success) {
  //       setData((prevData) =>
  //         prevData.map((job) => (job.id === id ? { ...job, schedule } : job))
  //       );
  //       console.log('Schedule updated successfully');
  //     } else {
  //       console.error('Failed to update schedule', response.message);
  //     }
  //   } catch (error) {
  //     console.error('Failed to update schedule', error);
  //   }
  // };

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
            {/* <th className="py-2 px-4 border-b">Time</th> */}
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
              <td className="py-2 px-4 border-b">
                <select
                  className="ml-2 px-2 py-1 bg-gray-200 rounded"
                  value={cronJob.schedule}
                
                  onChange={
                    (e) =>
                      handleChange({id:cronJob.id,schedule: e.target.value})
                  }
                >
                  {Object.values(ScheduleEnum).map((schedule) => (
                    <option key={schedule} value={schedule}>
                      {schedule.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                    </option>
                  ))}
              
                </select>
              </td>
              {/* <td className="py-2 px-4 border-b">{cronJob.cronTime}</td> */}
              <td className="py-2 px-4 border-b">
                {new Date(cronJob.startTime).toLocaleString()}
              </td>
              <td className="py-2 px-4 border-b">
                {new Date(cronJob.updatedAt).toLocaleString()}
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
                      handleChange({id:cronJob.id, status:cronJob.status})
                    }
                  >
                    {cronJob.status ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </td>
              <td className="py-2 px-4 border-b">
                {cronJob.lastRun
                  ? new Date(cronJob.lastRun).toLocaleString()
                  : 'N/A'}
              </td>
              <td className="py-2 px-4 border-b">N/A</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
