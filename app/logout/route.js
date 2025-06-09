
import { NextResponse } from 'next/server';
const redis = require('@/lib/redis');

const SCHEMA = process.env.DB_SCHEMA;
const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = process.env.COOKIE_NAME;

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

/**
 * Delete user session if exists
 * @returns true is session has been deleted
 */
async function deleteSession() {

	let result = { status: 200 };

	const cookieStore = await cookies();
	const token = cookieStore.get(COOKIE_NAME)?.value;

	if (!token)
    return;

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		const sessionData = await redis.get(`${decoded.sessionId}`);

		if (sessionData) {
			await redis.del(decoded.sessionId);
      return true;
		}

	} catch (err) {

	}

	return false;
}

export async function GET() {

  deleteSession();

  const response = NextResponse.redirect(process.env.NEXT_PUBLIC_API_BASE_URL);

  response.cookies.set(COOKIE_NAME, '', {
    path: '/',
    expires: new Date(0),
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  });

  return response;
}