"use client"

import { useSession } from 'next-auth/react';
import { signIn, signOut } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const handleSignIn = () => signIn('google');
const handleSignOut = () => signOut();

export default function LoginPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'unauthorized') {
      setErrorMessage('You do not have permission to access that page. Please contact an administrator if you need access.');
    }
  }, [searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-4">
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {errorMessage}
          </div>
        )}
        
        {session ? (
          <div className="text-center">
            <h2 className="text-lg font-medium text-gray-700 mb-2">
              Welcome, {session.user ? session.user.name : 'Guest'}!
            </h2>
            {session.user?.scopes && (
              <p className="text-sm text-gray-600 mb-4">
                Your access level: {session.user.scopes.join(', ')}
              </p>
            )}
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              AI Career Coach
            </h1>
            <button
              onClick={handleSignIn}
              className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Sign in with Google
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

