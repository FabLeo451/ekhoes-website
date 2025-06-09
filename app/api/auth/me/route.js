import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
const redis = require('@/lib/redis');
import pool from '@/lib/db';

const SCHEMA = process.env.DB_SCHEMA;
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

export async function GET(req) {
	const origin = req.headers.get('origin') || '*';

	const corsHeaders = {
		'Access-Control-Allow-Origin': origin,
		'Access-Control-Allow-Methods': 'GET, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type, Authorization',
		'Access-Control-Allow-Credentials': 'true',
		'Content-Type': 'application/json',
	};

	let result = await getMe(req);


	return new NextResponse(JSON.stringify(result.status == 200 ? result.data : result), {
		status: result.status,
		headers: corsHeaders,
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

	let result = await getMe(request);

	if (result.status != 200) {
		return new NextResponse(JSON.stringify(result), {
			status: result.status,
			headers: corsHeaders,
		});
	}

	const userId = result.data.user.id;
	let rowCount = 0;

	const { email, name } = await request.json();

	try {

		console.log('[me] Updating ', [email, name, userId]);

		const result = await pool.query(`update ${SCHEMA}.users set email = $1, name = $2 where id = $3`, [email, name, userId]);

		rowCount = result.rowCount;

	} catch (err) {
		console.log('[me]', err)
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

export async function DELETE(request) {
	const origin = request.headers.get('origin') || '*';

	const corsHeaders = {
		'Access-Control-Allow-Origin': origin,
		'Access-Control-Allow-Methods': 'GET, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type, Authorization',
		'Access-Control-Allow-Credentials': 'true',
		'Content-Type': 'application/json',
	};

	let result = await getMe(request);

	if (result.status != 200) {
		return new NextResponse(JSON.stringify(result), {
			status: result.status,
			headers: corsHeaders,
		});
	}

	const userId = result.data.user.id;
	let rowCount = 0;

	try {

		console.log('[me] Deleting ', [userId]);

		const result = await pool.query(`delete from ${SCHEMA}.users where id = $1 and reserved = false`, [userId]);

		rowCount = result.rowCount;

	} catch (err) {
		console.log('[me]', err)
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
