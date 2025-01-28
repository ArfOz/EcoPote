"use client";

import { fetchWithAuth } from "@utils";
import React from "react";

const AddUser = () => {
  interface UserData {
    email: FormDataEntryValue | null;
    subscription?: boolean;
  }

  const [status, setStatus] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const userData: UserData = {
      email: formData.get('email'),
      subscription:   formData.get('subscription') === 'on' ? true : false,
    };

    try {
      const response = await fetchWithAuth('admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      }, true);

      // if (!response) {
      //   throw new Error('Failed to add emails');
      // }
      // if (response.message) {
      //   throw new Error(response.message);
      // }
      // if (response.error) {
      //   throw new Error(response.error);
      // }
      if (response.status === 201) {
        setStatus('User added successfully');
      }

      // Clear form fields
      (event.target as HTMLFormElement).reset();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
    
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow-md rounded">
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email:</label>
        <input type="email" id="email" name="email" required className="w-full px-3 py-2 border rounded" />
        <div className="mb-4">
          <label htmlFor="subscription" className="block text-gray-700 font-bold mb-2">Subscribe:</label>
          <input type="checkbox" id="subscription" name="subscription" className="mr-2 leading-tight" />
          <span className="text-sm">Yes</span>
        </div>
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">Add User</button>
      {status && <p className="mt-4 text-green-500">{status}</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </form>
  );
};

export default AddUser;
