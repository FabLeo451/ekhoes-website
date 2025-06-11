import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
const redis = require('@/lib/redis');

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = process.env.COOKIE_NAME;

async function getCurrentSession() {

	const cookieStore = await cookies();
	const token = cookieStore.get(COOKIE_NAME)?.value;

	if (!token)
		return false;

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		const sessionData = await redis.get(`${decoded.sessionId}`);

		if (!sessionData) {
			return new NextResponse(JSON.stringify({ message: 'Session not found' }), {
				status: 401,
				headers: corsHeaders,
			});
		}

		return {
			_redisKey: decoded.sessionId,
			data: JSON.parse(sessionData)
		};

	} catch (err) {
		console.log('[session]', err);
	}

	return false;
}

async function updateUser(userdata) {

	let session = await getCurrentSession();

	if (!session)
		return false;

	// Update or add data

	for (let k in userdata) {
		session.data.user[k] = userdata[k];
	}

	session.data.updated = new Date().toISOString();

	await redis.set(session._redisKey, JSON.stringify(session.data), 'KEEPTTL');
}

/**
 * Check tolen validity and related session on Redis
 * @param {string} token 
 */
async function isAuthenticated() {
	return await getCurrentSession();
}

async function isAdmin() {

	let session = await getCurrentSession();

	if (!session)
		return false;

	if (!session.hasOwnProperty('data') || !session.data.user)
		return false;

	if (!session.data.user.privileges)
		return false;

	const result = session.data.user.privileges.some(role => role.toLowerCase() === 'admin');

	return result;
}

async function hasPrivilege(privilege) {

	let session = await getCurrentSession();

	if (!session)
		return false;

	if (!session.hasOwnProperty('data') || !session.data.user)
		return false;

	if (!session.data.user.privileges)
		return false;

	const included = session.data.user.privileges.some(role => role.toLowerCase() === privilege.toLowerCase());
	const hasAdminRole = session.data.user.privileges.some(role => role.toLowerCase() === 'admin');

	return included || hasAdminRole;
}

export { getCurrentSession, updateUser, isAuthenticated , isAdmin, hasPrivilege };
