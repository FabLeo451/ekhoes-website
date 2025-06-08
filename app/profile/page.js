'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

import ResultBox from '@/components/ResultBox';

function Success({ username }) {
  return (
    <div className="m-4">
      <h2 className="text-xl font-bold mb-2">✅ Registration Successful</h2>
      <p>Welcome, <strong>{username}</strong>!</p>
      <p>You will receive an email with a link. Click on the link to complete the process</p>
    </div>
  );
}

function Form({ onSuccess }) {
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const formValid = email && name;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formValid)
      return;

    try {
      setError('');
      const response = await axios.put(`/api/auth/me`, { email, name });
      //onSuccess(response.data.username || username);
    } catch (err) {
      if (!err.response) {
        setError('Network error: ' + err.message);
      } else {
        setError(err.response.data.message || 'Something went wrong');
      }
    }
  };

  const getCurrentValues = async () => {
    try {
      setError('');

      const response = await axios.get('/api/auth/me');

      //console.log(response)

      setUserId(response.data.user.id);
      setEmail(response.data.user.email);
      setName(response.data.user.name);

    } catch (err) {
      if (!err.response) {
        setError('Network error: ' + err.message);
      } else {
        setError(err.response.data.message || 'Something went wrong');
      }
    }
  }

  useEffect(() => {

    // Get current values
    getCurrentValues();
    
  }, []);

  return (
    <>
      <div className="flex justify-center mt-[3em] font-bold text-4xl">
        Profile
      </div>

      <div className="w-[20em] mx-auto">

        <ResultBox fail="true" className={`${error ? '' : 'invisible'}`}>{error}</ResultBox>

        <form onSubmit={handleSubmit} className="w-[20em]">
          <div>
            <div className="mt-[2em] mb-[0.5em]">Email</div>
            <label className="input validator">
              <input type="email" placeholder="mail@site.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <div className="validator-hint hidden">Enter valid email address</div>
          </div>

          <div className="mt-[2em] mb-[0.5em]">Name</div>
          <label className="input">
            <input type="text" placeholder="Any name you want" value={name} onChange={(e) => setName(e.target.value)} className="w-full" required />
          </label>

          <div className="mt-[2em]">
            <button className="btn btn-primary" type="submit" disabled={!formValid} >Save</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default function Profile() {
  const [successUser, setSuccessUser] = useState(null);

  return (
    <div>
        <Form />
    </div>
  );
}
