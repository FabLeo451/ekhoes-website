'use client';

import { useState } from 'react';
import axios from 'axios';

import ResultBox from '@/components/ResultBox';

function Success({ username }) {
  return (
    <div className="m-[6em] w-[20em] mx-auto justify-center text-center">
      <div className="text-2xl font-bold mb-2">✅ Registration Successful</div>
      <p className="my-[2em]">Welcome, <strong>{username}</strong>!</p>
      <p>You will receive an email with a link.</p>
      <p>Click on the link to complete the process.</p>
    </div>
  );
}

function Form({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState(null);

  const passwordTooShort = password.length > 0 && password.length < 5;
  const passwordConfirmed = !password_confirm || (password == password_confirm);
  const formValid = email && password && username && password_confirm && !passwordTooShort && passwordConfirmed;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    /*
    if (!email.trim()) return setError('Email is a mandatory field');
    if (!username.trim()) return setError('Username is a mandatory field');
    if (!password || !password_confirm) return setError('Please set a password and confirm it');
    if (password !== password_confirm) return setError("Password and confirmed password don't match");
    if (password.length < 5) return setError("Password should be at least 5 characters long");
    */

    if (!formValid)
      return;

    try {
      setError('');
      const response = await axios.post('/api/sign-in', { email, username, password });
      onSuccess(response.data.username || username);
    } catch (err) {
      if (!err.response) {
        setError('Network error: ' + err.message);
      } else {
        setError(err.response.data.message || 'Something went wrong');
      }
    }
  };

  return (
    <>
      <div className="flex justify-center my-[1em] font-bold text-4xl">
        Sign in
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
            <input type="text" placeholder="Any name you want" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full" required />
          </label>

          <div>
            <div className="mt-[2em] mb-[0.5em]">Password</div>
            <label className="input validator">
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full" required />
            </label>
            {passwordTooShort && (<div className="text-sm text-red-500 mt-2">Password should be at least 5 characters long</div>)}
          </div>

          <div>
            <div className="mt-[2em] mb-[0.5em]">Confirm password</div>
            <label className="input validator">
              <input type="password" value={password_confirm} onChange={(e) => setPasswordConfirm(e.target.value)} className="w-full" required />
            </label>
            {passwordConfirmed || (<div className="text-sm text-red-500 mt-2">Password and confirmed password don't match</div>)}
          </div>

          <div className="mt-[2em]">
            <button className="btn btn-primary" type="submit" disabled={!formValid} >Sign in</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default function SignInPage() {
  const [successUser, setSuccessUser] = useState(null);

  return (
    <div>
      {!successUser ? (
        <Form onSuccess={setSuccessUser} />
      ) : (
        <Success username={successUser} />
      )}
    </div>
  );
}
