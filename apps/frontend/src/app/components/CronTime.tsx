"use client";

const CronTime = () => {
  const cronTime = "* */5 * * * *";

  return (
    <div className="bg-gray-100 p-4 rounded shadow-md">
      <h2 className="text-xl font-bold mb-2">Cron Time</h2>
      <p className="text-gray-700">{cronTime}</p>
    </div>
  );
};

export default CronTime;
