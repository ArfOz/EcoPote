'use client';

import Navbar from '../components/Navbar';
import { CronTime } from '../components/CronTime';
import { CronCreator } from '../components/croncomponents/cronCreator';

const CronPage = () => {
  return (
    <>
      <Navbar />
      <CronTime />
      <CronCreator />
    </>
  );
};

export default CronPage;
