import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import pool from '@/lib/db';
import * as Mail from '@/lib/mail';

const SCHEMA = process.env.DB_SCHEMA;

async function sendMail(to, name, user_name, token) {

	let subject = 'Registration to ekhoes.com';

	if (/*process.env.NODE_ENV === 'production'*/true) {

		return Mail.sendSignUp(to, subject, name, user_name, token)

	} else {

		let html = `
			<p>Hello, ${name}.</p>
			<p>Take note of your user code, it can be useful: <strong>${user_name}</strong>.</p>
			<p>
				Click on the link below to complete the registration process:<br>
				<a href='http://localhost:3001/confirm?token=${token}'>Confirm</a>
			</p>
		`;

		return Mail.sendLocal(to, subject, html);
	}
}

export async function POST(req) {
	try {
		const { email, username, password } = await req.json();

		const id = uuidv4();

		const query = `
			INSERT INTO ${SCHEMA}.users ("id", "name", "email", "password") VALUES 
			($1, $2, $3, crypt($4, gen_salt('bf')))
			RETURNING id, user_name
		`;

		const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '24h' });

		await pool.query('BEGIN');

		const result = await pool.query(query, [id, username, email, password]);

		await pool.query(`INSERT INTO ${SCHEMA}.user_roles ("user_id", "roles") VALUES ($1, 'USER')`, [id]);
		await pool.query(`INSERT INTO ${SCHEMA}.confirmations ("user_id", "request", "token") VALUES ($1, 'sign-up', $2)`, [id, token]);

		await pool.query('COMMIT');

		console.log('[sign-in] inserted = ', result.rows[0]);

		//sendMail(email, username, result.rows[0].user_name, token);
		Mail.sendSignUp(email, 'Registration to ekhoes.com', username, result.rows[0].user_name, token)

		return NextResponse.json({ message: 'Created' }, { status: 201 });

	} catch (err) {
		await pool.query('ROLLBACK');

		let msg, status;

		switch (err.code) {
			case '23505':
				msg = 'A user with the same email exists';
				status = 400;
				break;
			default:
				msg = `Database error ${err.code} ${err.message}`;
				status = 500;
		}

		console.error('[signin] ', err);

		return NextResponse.json({ message: msg, err }, { status });
	}
}
