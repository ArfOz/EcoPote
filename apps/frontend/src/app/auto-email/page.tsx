'use client';

import Navbar from '../components/navbar/Navbar';
import { CronTime } from '../components/auto-email/CronTime';
const CronPage = () => {
  return (
    <>
      <Navbar />
      <CronTime />
    </>
  );
};

export default CronPage;
