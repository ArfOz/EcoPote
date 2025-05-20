import React from 'react';
import { AllEmails, Navbar } from '../components';

const EmailsPage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <AllEmails />
    </div>
  );
};

export default EmailsPage;
