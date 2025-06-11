import Link from 'next/link';
import * as Session from '@/lib/session';
import MainMenuItems from '@/components/MainMenuItems';
import { ChevronDownIcon } from '@heroicons/react/24/outline'

export default async function Navbar() {

    let session = await Session.getCurrentSession();

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
                        {session ? (
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-ghost rounded-field">{session ? session.data.user.name : 'Menu'} <ChevronDownIcon className="w-6" /></div>
                                <MainMenuItems />
                            </div>
                        ) : (
                            <>
                            <Link href="/login">
                                <button className="btn btn-primary mx-[2em]">Log in</button>
                            </Link>
                            {/*<Link href="/sign-in">
                                <button className="btn btn-soft">Sign in</button>
                            </Link>*/}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
