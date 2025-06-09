import React from 'react';

export default async function Confirm({ searchParams }) {
  const params = await searchParams;
  const token = params.token;

  if (!token) {
    return <div>Missing token</div>;
  }

  let success = false;
  let message = '';

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/confirm?token=${token}`, {
      method: 'POST',
      cache: 'no-store',  // evita cache in SSR
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      message = data.message || 'Confirmation error';
    } else {
      success = true;
      message = 'Email successfully confirmed!';
    }
  } catch (error) {
    message = 'Network error: ' + error.message;
  }

  return (
    <div>
      {success ? (
        <div style={{ color: 'green' }}>
          <div className="m-[6em] w-[20em] mx-auto justify-center text-center">
            <div className="text-2xl font-bold mb-2">✅ Confirmed</div>
            <p className="my-[2em]">Welcome, <strong>{username}</strong>!</p>
            <p>Welcome! Now you can log in with your email and password.</p>
          </div>
        </div>
      ) : (
        <div style={{ color: 'red' }}>
          <div className="m-[6em] w-[20em] mx-auto justify-center text-center">
            <h2>Error</h2>
            <p>{message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
