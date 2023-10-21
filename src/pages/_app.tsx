import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '../styles/main.module.css'
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';

import { useSession, signIn, signOut } from 'next-auth/react';
import React from 'react';

const Main = () => {
  const { data: session, status } = useSession();
  const view = session ? <OperationView session={session} /> : <LoginView />;
  return view;
}

const LoginView = () => {
  const googleId = process.env.GOOGLE_ID || "";
  const googleSecret = process.env.GOOGLE_SECRET || "";
  console.log(googleId);
  const view = (
    <>
        Sign in<br />
        <button onClick={() => signIn()}>Sign in</button>
    </>
  );

  return view;
}

const OperationView = (session) => {
  const session_data = JSON.stringify(session);
  const view = (
    <>{session_data}</>
  );

  return view;
}

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  return (
    <SessionProvider session={session}>
      <Main />
    </SessionProvider>
  );
}

export default App;