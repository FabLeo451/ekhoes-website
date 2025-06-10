'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

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
	//const [email, setEmail] = useState('');
	const [name, setName] = useState('');
	const [isOpen, setIsOpen] = useState(false);

	const [successMsg, setSuccessMessage] = useState(null);
	const [errorMsg, setError] = useState(null);

	const formValid = name;

	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!formValid)
			return;

		try {
			setError(null);
			setSuccessMessage(null)
			const response = await axios.put(`/api/auth/me`, { name });
			//onSuccess(response.data.username || username);

			setSuccessMessage('Profile successfully updated. Refresh page to see the changes.')

		} catch (err) {
			if (!err.response) {
				setError('Network error: ' + err.message);
			} else {
				setError(err.response.data.message || 'Something went wrong');
			}
		}
	};

	const handleDeleteAccount = async (e) => {
		e.preventDefault();
		
		setIsOpen(false);

		try {
			setError(null);
			setSuccessMessage(null)
			const response = await axios.delete(`/api/auth/me`);

			setSuccessMessage('Account successfully deleted');

			router.push('/logout');

		} catch (err) {
			if (!err.response) {
				setError('Network error: ' + err.message);
			} else {
				setError(err.response.data.message || 'Something went wrong');
			}
		}
	}

	const getCurrentValues = async () => {
		try {
			setError(null);
			setSuccessMessage(null)

			const response = await axios.get('/api/auth/me');

			//console.log(response)

			setUserId(response.data.user.id);
			//setEmail(response.data.user.email);
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

			{/* Modal DaisyUI */}
			{isOpen && (
				<div className="modal modal-open">
					<div className="modal-box">
						<h3 className="font-bold text-lg">Confirm</h3>
						<p className="py-4">Are you sure you want to delete your account?</p>
						<div className="modal-action">
							<button className="btn btn-error mx-[1em]" onClick={handleDeleteAccount}>
								Proceed
							</button>
							<button className="btn" onClick={() => setIsOpen(false)}>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}


			<div className="w-[20em] mx-auto">

				<form onSubmit={handleSubmit} className="w-[20em]">
					{/*<div>
						<div className="mt-[2em] mb-[0.5em]">Email</div>
						<label className="input validator">
							<input type="email" placeholder="mail@site.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
						</label>
						<div className="validator-hint hidden">Enter valid email address</div>
					</div>*/}

					<div className="mt-[2em] mb-[0.5em]">Name</div>
					<label className="input">
						<input type="text" placeholder="Any name you want" value={name} onChange={(e) => setName(e.target.value)} className="w-full" required />
					</label>

					<div className="mt-[2em]">
						<button className="btn btn-primary" type="submit" disabled={!formValid} >Save</button>
					</div>

					<div className="flex justify-center mt-[2em] text-gray-300">
						<a href="/profile/password" className="link" >Change password</a>
					</div>

					<div className="flex justify-center mt-[1em] text-gray-300">
						<a href="/change-email" className="link" >Change email</a>
					</div>

				</form>

				<div className="flex justify-center my-[3em]">
					<button className="btn btn-error" onClick={() => setIsOpen(true)}>
						Delete account
					</button>
				</div>
			</div>
		</>
	);
}

export default function Profile() {
	const [successUser, setSuccessUser] = useState(null);

	return (
		<div>
			<div className="flex justify-center mt-[3em] font-bold text-4xl">
				Your profile
			</div>

			<Form />

		</div>
	);
}
