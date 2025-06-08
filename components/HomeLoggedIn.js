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
        <div className="relative h-screen flex flex-col items-center justify-center px-6 py-6">
            <div className="card w-96 bg-white/10 border border-white/10 backdrop-blur-md shadow-2xl shadow-black/40
">

                <div className="card-body">
                    <h2 className="card-title">Control panel</h2>
                    <p className='text-gray-400'>Monitor system and manage users</p>
                    <div className="card-actions justify-end">
                        <Link href={process.env.NEXT_PUBLIC_CONTROL_PANEL} target='_blank'>
                            <button className="btn btn-primary">Go</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
