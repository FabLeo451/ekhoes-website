import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';

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

export async function POST(request) {

  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  console.log('[confirm] token =', token)

	const origin = request.headers.get('origin') || '*';

	const corsHeaders = {
		'Access-Control-Allow-Origin': origin,
		'Access-Control-Allow-Methods': 'GET, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type, Authorization',
		'Access-Control-Allow-Credentials': 'true',
		'Content-Type': 'application/json',
	};
  
  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(`select user_id from ${SCHEMA}.confirmations where request = 'sign-up' and token = $1`, [token]);

    if (result.rowCount > 0) {

      console.log('[confirm] result = ', result.rows[0]);

      let user_id = result.rows[0].user_id;

      await pool.query('BEGIN');
      await pool.query(`update ${SCHEMA}.users set status = 'enabled' where id = $1`, [user_id]);
      await pool.query(`delete from ${SCHEMA}.confirmations where token = $1`, [token]);
      await pool.query('COMMIT');

      return NextResponse.json({ message: 'Confirmed' }, { status: 200, headers: corsHeaders });

    } else {
      return NextResponse.json({ message: 'Confirmation record not found' }, { status: 404, headers: corsHeaders });
    }

  } catch (err) {
    await pool.query('ROLLBACK');

    let msg, status;

    msg = `Confirmation failed: ${err.code} ${err.message}`;
    status = 500;

    console.error('[signin] ', err);

    return NextResponse.json({ message: msg, err }, { status });
  }
}
