import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import pool from '@/lib/db';

const SCHEMA = process.env.DB_SCHEMA;

export async function POST(req) {
	try {
		const { name, message } = await req.json();

		const id = uuidv4();

		const query = `
			INSERT INTO ${SCHEMA}.messages ("id", "name", "message") VALUES ($1, $2, $3)
		`;

		const result = await pool.query(query, [id, name, message]);

		return NextResponse.json({ message: 'Created' }, { status: 201 });

	} catch (err) {
		await pool.query('ROLLBACK');

		let msg, status;

		switch (err.code) {
			default:
				msg = `Database error ${err.code} ${err.message}`;
				status = 500;
		}

		console.error('[message] ', err);

		return NextResponse.json({ message: msg, err }, { status });
	}
}
