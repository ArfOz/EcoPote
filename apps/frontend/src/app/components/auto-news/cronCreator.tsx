import {
  CronCreateDto,
  ResponseCreateCron,
  ResponseCron,
  ScheduleFrontEnum,
} from '@shared/dtos';

import { fetchWithAuth } from '@utils';
import React from 'react';

export const CronCreator = ({
  setData,
}: {
  setData: React.Dispatch<React.SetStateAction<ResponseCron['data']>>;
}) => {
  const [cronJobs, setCronJobs] = React.useState<ResponseCron[]>([]);
  const [status, setStatus] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [cronTime, setCronTime] = React.useState<string>('');

  const handleCreateCron = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    const cronData: CronCreateDto = {
      name: formData.get('name') as string,
      schedule: formData.get('schedule') as ScheduleFrontEnum,
      startTime: new Date(event.currentTarget.startTime.value),
      status: status ? true : false,
    };
    const res: ResponseCreateCron = await fetchWithAuth(
      'cron/create-job',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cronData),
      },
      false
    );

    console.log('Cron job created:', res);
    if (res.success) {
      // setCronJobs((prevCronJobs) => [...prevCronJobs, res.data]);
      setData((prevData) => [...prevData, res.data]); // Update the data state with the new cron job
      // Update the data state with the new cron job
    }
    if (res.message) {
      setError(res.message);
    }

    setLoading(false);
  };

  const [showModal, setShowModal] = React.useState(false);

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '20px',
        }}
      >
        <button
          onClick={() => setShowModal(true)}
          className="open-modal-button"
        >
          Create Cron Job
        </button>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Create Cron Job</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="space-y-4">
              <form onSubmit={handleCreateCron}>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Cron Job Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter cron job name"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="cron-schedule"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Cron Schedule
                  </label>
                  <select
                    id="cron-schedule"
                    name="schedule"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    {Object.values(ScheduleFrontEnum).map((schedule) => (
                      <option key={schedule} value={schedule}>
                        {schedule.charAt(0).toUpperCase() +
                          schedule.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="start-time"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    id="start-time"
                    name="startTime"
                    className="ml-2 px-2 py-1 bg-gray-200 rounded z-10 datetime-input"
                    value={cronTime}
                    onChange={(e) => setCronTime(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Status
                  </label>
                  <div className="flex items-center space-x-4 mt-2">
                    <button
                      type="button"
                      className={`px-4 py-2 rounded-md shadow-sm ${
                        status === true
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-300 text-gray-700'
                      }`}
                      onClick={() => setStatus(true)}
                    >
                      Active
                    </button>
                    <button
                      type="button"
                      className={`px-4 py-2 rounded-md shadow-sm ${
                        status === false
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-300 text-gray-700'
                      }`}
                      onClick={() => setStatus(false)}
                    >
                      Inactive
                    </button>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Create Cron Job
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
