import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
const redis = require('@/lib/redis');

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = process.env.COOKIE_NAME;

export async function GET() {
  await deleteSession();

  const response = NextResponse.redirect(process.env.NEXT_PUBLIC_API_BASE_URL);

  response.cookies.set(COOKIE_NAME, '', {
    path: '/',
    expires: new Date(0),
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    domain: '.ekhoes.com',
  });

  return response;
}

async function deleteSession() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const sessionData = await redis.get(`${decoded.sessionId}`);

    if (sessionData) {
      await redis.del(decoded.sessionId);
      return true;
    }

  } catch (err) {
    console.error('[logout] JWT verification failed', err);
  }

  return false;
}
