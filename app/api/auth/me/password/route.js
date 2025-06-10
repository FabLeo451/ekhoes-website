import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
const redis = require('@/lib/redis');
import pool from '@/lib/db';
import * as Session from '@/lib/session';

const SCHEMA = process.env.DB_SCHEMA;

/*
const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = process.env.COOKIE_NAME;

async function getMe(req) {

	let result = { status: 200 };

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

	} catch (err) {
		result = {
			status: 401,
			message: err.message,
		};
	}

	return result;
}
*/

// Handle CORS preflight if needed
export async function OPTIONS(req) {
	const origin = req.headers.get('origin') || '*';

	return new NextResponse(null, {
		status: 204,
		headers: {
			'Access-Control-Allow-Origin': origin,
			'Access-Control-Allow-Methods': 'GET, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization',
			'Access-Control-Allow-Credentials': 'true',
		},
	});
}

export async function PUT(request) {
	const origin = request.headers.get('origin') || '*';

	const corsHeaders = {
		'Access-Control-Allow-Origin': origin,
		'Access-Control-Allow-Methods': 'GET, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type, Authorization',
		'Access-Control-Allow-Credentials': 'true',
		'Content-Type': 'application/json',
	};

	//let result = await getMe(request);
	let result = await Session.getCurrentSession();

	if (!result._found) {
		return new NextResponse(JSON.stringify(result), {
			status: 400,
			headers: corsHeaders,
		});
	}

	const userId = result.data.user.id;
	let rowCount = 0;

	const { password } = await request.json();

	try {

		const result = await pool.query(`update ${SCHEMA}.users set password = crypt($1, gen_salt('bf')), updated = now() where id = $2`, [password, userId]);

		rowCount = result.rowCount;

	} catch (err) {
		console.log('[me/password]', err)
		var msg = 'Database error ' + err.code + ' ' + err.message;
		return new NextResponse(JSON.stringify({ message: 'Database error', error: err.message }), {
			status: 500,
			headers: corsHeaders,
		});
	}

	const response = NextResponse.json({ rowCount }, {
		status: 200,
		headers: corsHeaders,
	});

	return response;
}
