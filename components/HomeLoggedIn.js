import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import Link from 'next/link';
import MainMenuItems from '@/components/MainMenuItems';
import { UserIcon } from '@heroicons/react/24/outline'

export default async function HomeLoggedIn() {
/*
    const cookieStore = await cookies();
    const token = cookieStore.get(process.env.COOKIE_NAME)?.value;

    let loggedIn = false;
    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);

        //console.log('[Navbar] decoded = ', decoded)

        loggedIn = true;

    } catch (err) {
        //return (<div className="pl-1">Invalid token: {err.message}</div>);
    }
*/
    return (
        <div>
            Home page for logged in users
        </div>
    );
}
