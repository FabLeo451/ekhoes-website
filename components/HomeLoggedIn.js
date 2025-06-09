import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import Link from 'next/link';
import * as Utils from '@/lib/utils';
const redis = require('@/lib/redis');

export default async function HomeLoggedIn() {

    const cookieStore = await cookies();
    const token = cookieStore.get(process.env.COOKIE_NAME)?.value;

    let loggedIn = false;
    let decoded, session;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);

        //console.log('[Navbar] decoded = ', decoded)

        let sessionStr = await redis.get(`${decoded.sessionId}`);

        if (sessionStr) {
            session = JSON.parse(sessionStr);
            loggedIn = true;
        }

        //console.log('[Navbar] session = ', session)

    } catch (err) {
        //return (<div className="pl-1">Invalid token: {err.message}</div>);
    }

    return (
        <div className="relative min-h-screen flex flex-col lg:flex-row justify-center items-start gap-6 px-6 pt-[4em]">

            {/* Contacts */}
            <div className="card w-85 bg-white/10 border border-white/10 backdrop-blur-md shadow-2xl shadow-black/40">
                <div className="card-body">
                    <h2 className="card-title">Contacts</h2>
                    <p className="text-gray-400">Leave a message for our team</p>
                    <div className="card-actions justify-end">
                        <Link href="/contacts">
                            <button className="btn btn-primary">Go</button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Control panel */}
            {Utils.hasPrivilege(session, 'read_session') && (
                <div className="card w-85 bg-white/10 border border-white/10 backdrop-blur-md shadow-2xl shadow-black/40">
                    <div className="card-body">
                        <h2 className="card-title">Control panel</h2>
                        <p className="text-gray-400">Monitor system and manage users</p>
                        <div className="card-actions justify-end">
                            <Link href={process.env.NEXT_PUBLIC_CONTROL_PANEL} target="_blank">
                                <button className="btn btn-primary">Go</button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    );
}
