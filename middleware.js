import { NextResponse } from 'next/server'
import { jwtVerify, SignJWT } from 'jose';

const COOKIE_NAME = process.env.COOKIE_NAME;
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const TOKEN_EXPIRATION_TOKEN = process.env.TOKEN_EXPIRATION_TOKEN;

var authPaths = {
	'/profile': { privileges: ['access'] }, 
	'/profile/password': { privileges: ['access'] }
};

export async function middleware(request) {

	// Gestione diretta delle richieste OPTIONS
	if (request.method === 'OPTIONS') {

		const origin = request.headers.get('origin') || '*'

		return new Response(null, {
			status: 204,
			headers: {
				'Access-Control-Allow-Origin': origin,
				'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
				'Access-Control-Allow-Headers': 'Content-Type, Authorization',
				'Access-Control-Allow-Credentials': 'true',
			},
		})
	}

	const { pathname } = request.nextUrl;

	console.log('[middleware] ' + request.method + ' ', pathname)
	//console.log('[middleware] cookies', request.cookies)

	var response = NextResponse.next();
	response.headers.set('x-url', pathname); // will be read by layout.js

	//if (protectedPaths.indexOf(pathname) > -1) {
	if (authPaths[pathname]) {

		const token = request.cookies.get(COOKIE_NAME)?.value;

		//console.log('[middleware] token = ' + token)

		if (!token) {
			return NextResponse.redirect(new URL('/login', request.url))
		}

		try {

			const { payload } = await jwtVerify(token, JWT_SECRET);

			//console.log('[middleware] ', payload);

			// Check privileges

			//console.log('[middleware] Requested privilege', authPaths[pathname].privilege);
			//console.log('[middleware] User privileges', payload.user.privileges);

			let authorized = false;

			const privilege = authPaths[pathname].privilege;

			if (privilege) {
				const hasRole = payload.user.privileges.some(role => role.toLowerCase() === privilege.toLowerCase());
				const hasAdminRole = payload.user.privileges.some(role => role.toLowerCase() === 'admin');

				authorized = hasRole || hasAdminRole;

			} else
				authorized = true;

			if (authorized) {

				// Authenticated with right role

			} else {

				return new NextResponse(JSON.stringify({ error: 'Forbidden: missing permissions' }), {
					status: 403,
					headers: {
						'Content-Type': 'application/json',
					},
				});
			}

		} catch (err) {

			console.log('[middleware] invalid cookie: ', err.message);

			response = NextResponse.redirect(new URL('/login', request.url));
			//response.headers.set('x-force-reload', 'true');

			response.cookies.set(COOKIE_NAME, '', {
				httpOnly: true,
				path: '/',
				maxAge: 0,
			})

		}
	}

	return response;
}

export const config = {
  matcher: [
    /*
     * Match tutte le pagine tranne:
     * - /_next
     * - /favicon.ico
     * - /robots.txt
     * - /api/*
     * - /static/*
     * - /images/*
     * - /fonts/*
     */
    '/((?!_next|favicon.ico|robots.txt|api|static|images|fonts).*)',
  ],
};
