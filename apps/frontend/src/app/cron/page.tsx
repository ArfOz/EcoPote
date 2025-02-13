"use client";

import Navbar from '../components/Navbar';

const CronPage = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Cron Jobs</h1>
        <p className="text-gray-700">Manage your cron jobs here.</p>
        {/* Add your cron job management components here */}
      </div>
    </>
  );
};

export default CronPage;
