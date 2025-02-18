"use client";

import Navbar from '../components/Navbar';
import CronTime from '../components/CronTime';

const CronPage = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Cron Jobs</h1>
        <p className="text-gray-700">Manage your cron jobs here.</p>
        <CronTime />
      </div>
    </>
  );
};

export default CronPage;
