
import { NextResponse } from 'next/server';

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

export async function GET() {

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