import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import Link from 'next/link';
import MainMenuItems from '@/components/MainMenuItems';
import { ChevronDownIcon } from '@heroicons/react/24/outline'

export default async function Navbar() {

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

    return (
        <div className="navbar fixed top-0 left-0 w-full z-50 bg-transparent px-4 py-2">
            <div className="flex-1">
                <Link href="/">
                    <button className="btn btn-soft">Home</button>
                </Link>
            </div>

            <div className="flex justify-end w-full">
                <div className="flex items-center space-x-2">
                    <div className="dropdown dropdown-end">
                        {loggedIn ? (
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-ghost rounded-field">{decoded.user ? decoded.user.name : 'Menu'} <ChevronDownIcon className="w-6" /></div>
                                <MainMenuItems />
                            </div>
                        ) : (
                            <Link href="/login">
                                <button className="btn btn-soft">Log in</button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
