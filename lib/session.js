import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
const redis = require('@/lib/redis');

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = process.env.COOKIE_NAME;

async function getCurrentSession() {

	let result = { _found: false };

	const cookieStore = await cookies();
	const token = cookieStore.get(COOKIE_NAME)?.value;

	if (!token) {
		result = {
			status: 401,
			message: 'Not authenticated',
		};
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		const sessionData = await redis.get(`${decoded.sessionId}`);

		if (!sessionData) {
			return new NextResponse(JSON.stringify({ message: 'Session not found' }), {
				status: 401,
				headers: corsHeaders,
			});
		}

		result.data = JSON.parse(sessionData);
		result._found = true;
		result._redisKey = decoded.sessionId;

	} catch (err) {
		result = {
			status: 401,
			message: err.message,
		};
	}

	return result;
}

async function updateUser(userdata) {

	let session = await getCurrentSession();

	if (!session._found)
		return false;

	// Update or add data

	for (let k in userdata) {
		session.data.user[k] = userdata[k];
	}

	session.data.updated = new Date().toISOString();

    await redis.set(session._redisKey, JSON.stringify(session.data), 'KEEPTTL');
}

export { getCurrentSession, updateUser };
