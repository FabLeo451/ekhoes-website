import Link from 'next/link';
import * as Session from '@/lib/session';
import MainMenuItems from '@/components/MainMenuItems';
import { ChevronDownIcon } from '@heroicons/react/24/outline'

export default async function Navbar() {

    let session = await Session.getCurrentSession();

    return (
        <div className="navbar fixed top-0 left-0 w-full z-50 bg-transparent px-4 py-2">
            <div className="flex-1">
                <a href="/">
                    <button className="btn btn-soft">Home</button>
                </a>
            </div>

            <div className='ml-[1em] text-ms'>
                <Link href="/contacts">Contacts</Link>
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
                            <a href="/login">
                                <button className="btn btn-primary">Log in</button>
                            </a>
                            {<Link href="/sign-up">
                                <button className="btn btn-soft ml-[1em]">Sign up</button>
                            </Link>}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
