import { Geist, Geist_Mono } from "next/font/google";
import { cookies, headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import * as Session from '@/lib/session';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ekhoes",
  description: "Share your vision. Shape it with code.",
};

const COOKIE_NAME = process.env.COOKIE_NAME;

const noNavBar = ['/login'];

export default async function RootLayout({ children }) {
  const allHeaders = await headers();
  const url = allHeaders.get('x-url');
  const hideNavbar = noNavBar.includes(url);
  const now = new Date().toLocaleString();

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value || '';

  if (token) {
    if (!await Session.isAuthenticated()) {
      
      // Token found. Session not found. Redirect to /logout to invalidate token

      console.log(`${now} [layout] Not authenticated`);
      redirect('/logout');
    }
  }

  return (
    <html lang="en" data-theme="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

        <div className="relative h-screen bg-black text-white overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 z-0">
            <img
              src="/digital-echo.jpg"
              alt="digital echo background"
              className="w-full h-full object-cover blur-sm brightness-20"
            />
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-[#00f2ff]/10 z-10 mix-blend-multiply"></div>

          {/* ✅ Navbar + content */}
          <div className="relative z-20">
            {!hideNavbar && <Navbar />}
            {hideNavbar && (        <div className="navbar fixed top-0 left-0 w-full z-50 bg-transparent px-4 py-2">
            <div className="flex-1">
                <a href="/">
                    <button className="btn btn-soft">Home</button>
                </a>
            </div>
        </div>)}

            <div className="mt-[5em]">
              {children}
            </div>
          </div>
        </div>

      </body>
    </html>
  );
}
