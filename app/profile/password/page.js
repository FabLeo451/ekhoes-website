'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

function Form({ onSuccess }) {
	const [userId, setUserId] = useState(null);
	const [password, setPassword] = useState('');
	const [password_confirm, setPasswordConfirm] = useState('');

	const [successMsg, setSuccessMessage] = useState(null);
	const [errorMsg, setError] = useState(null);

	const passwordTooShort = password.length > 0 && password.length < 5;
	const passwordConfirmed = !password_confirm || (password == password_confirm);
	const formValid = password && password_confirm && !passwordTooShort && passwordConfirmed;

	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!formValid)
			return;

		try {

			setError(null);
			setSuccessMessage(null)
			const response = await axios.put(`/api/auth/me/password`, { password });

			setSuccessMessage('Password successfully updated')

		} catch (err) {
			if (!err.response) {
				setError('Network error: ' + err.message);
			} else {
				setError(err.message || 'Something went wrong');
			}
		}
	};

	return (
		<>
				{successMsg && (
					<div role="alert" className="alert alert-success w-full max-w-[90vw] lg:max-w-[50vw] mx-auto mt-3">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<span>{successMsg}</span>
					</div>
				)}

				{errorMsg && (
					<div role="alert" className="alert alert-error w-full max-w-[90vw] lg:max-w-[50vw] mx-auto mt-3">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<span>{errorMsg}</span>
					</div>
				)}

			<div className="w-[20em] mx-auto">

				<form onSubmit={handleSubmit} className="w-[20em]">

				<div>
					<div className="mt-[2em] mb-[0.5em]">New password</div>
					<label className="input validator">
					<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full" required />
					</label>
					{passwordTooShort && (<div className="text-sm text-red-500 mt-2">Password should be at least 5 characters long</div>)}
				</div>

				<div>
					<div className="mt-[2em] mb-[0.5em]">Confirm new password</div>
					<label className="input validator">
					<input type="password" value={password_confirm} onChange={(e) => setPasswordConfirm(e.target.value)} className="w-full" required />
					</label>
					{passwordConfirmed || (<div className="text-sm text-red-500 mt-2">Password and confirmed password don't match</div>)}
				</div>

					<div className="mt-[2em]">
						<button className="btn btn-primary" type="submit" disabled={!formValid} >Save</button>
					</div>

				</form>
			</div>
		</>
	);
}

export default function ChangePassword() {
	const [successUser, setSuccessUser] = useState(null);

	return (
		<div>
			<div className="flex justify-center mt-[3em] font-bold text-4xl">
				Change password
			</div>

			<Form />

		</div>
	);
}
