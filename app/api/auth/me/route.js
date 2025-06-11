import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import * as Session from '@/lib/session';

const SCHEMA = process.env.DB_SCHEMA;

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

	let session = await Session.getCurrentSession();

	return new NextResponse(JSON.stringify(session ? session.data : { message: "Not authenticated"}), {
		status: session ? 200 : 403,
		headers: corsHeaders,
	});

}

// PUT /api/auth/me
export async function PUT(request) {
	const origin = request.headers.get('origin') || '*';

	const corsHeaders = {
		'Access-Control-Allow-Origin': origin,
		'Access-Control-Allow-Methods': 'GET, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type, Authorization',
		'Access-Control-Allow-Credentials': 'true',
		'Content-Type': 'application/json',
	};

	let session = await Session.getCurrentSession();

	if (!session) {
		return new NextResponse(JSON.stringify(session ? session.data : { message: "Not authenticated"}), {
			status: session ? 200 : 403,
			headers: corsHeaders,
		});
	}

	const userId = session.data.user.id;
	let rowCount = 0;

	const { name } = await request.json();

	try {

		const result = await pool.query(`update ${SCHEMA}.users set name = $1, updated = now() where id = $2`, [name, userId]);

		rowCount = result.rowCount;

		if (!Session.updateUser({ name }))
			console.log('[me] Unable tu update session');

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

	let session = await Session.getCurrentSession();

	if (!session) {
		return new NextResponse(JSON.stringify(session ? session.data : { message: "Not authenticated"}), {
			status: session ? 200 : 403,
			headers: corsHeaders,
		});
	}

	const userId = session.data.user.id;
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
