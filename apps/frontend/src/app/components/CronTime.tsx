"use client";

import { fetchWithAuth } from "@utils";
import {  useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const CronTime = () => {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetchWithAuth("cron/get-jobs", {}, false);

        const data = res
        console.log(data);
        setData(data);
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

    fetchUsers();
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
            <th className="py-2 px-4 border-b">Time</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Last Run</th>
            <th className="py-2 px-4 border-b">Next Run</th>
            </tr>
              
                </thead>
                <tbody>
                  {data?.map((jobs) => (

                    <tr key={jobs.id}>
                      <td className="py-2 px-4 border-b">{jobs.id}</td>
                      <td className="py-2 px-4 border-b">{jobs.name}</td>
                      <td className="py-2 px-4 border-b">{jobs.time}</td>
                      <td className="py-2 px-4 border-b">{jobs.status}</td>
                      <td className="py-2 px-4 border-b">{jobs.last_run}</td>
                      <td className="py-2 px-4 border-b">{jobs.next_run}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
                  
    </div>
  );


}

