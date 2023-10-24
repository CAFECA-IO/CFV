import '../styles/globals.css';
import Image from 'next/image';
import {Inter} from 'next/font/google';
import styles from '../styles/main.module.css';
import {SessionProvider} from 'next-auth/react';
import type {AppProps} from 'next/app';
import {GoogleOAuthProvider} from '@react-oauth/google';

import {useSession, signIn, signOut} from 'next-auth/react';
import React from 'react';
import {GoogleLogin} from '@react-oauth/google';

const Main = () => {
  const {data: session, status} = useSession();
  const content = !session ? <OperationView session={session} /> : <LoginView />;
  const view = <div className={styles.container}>{content}</div>;
  return view;
};

const LoginView = () => {
  const view = (
    <div className={styles.loginView}>
      <div className={styles.loginBlock}>
        <GoogleLogin
          onSuccess={credentialResponse => {
            console.log(credentialResponse);
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />
      </div>
    </div>
  );

  return view;
};

const OperationView = session => {
  const session_data = JSON.stringify(session);
  const view = (
    <div className={styles.operationView}>
      <MenuView></MenuView>
      <JobBoard></JobBoard>
    </div>
  );

  return view;
};
const MenuView = () => {
  const view = (
    <div className={styles.menuView}>
      <div className={styles.menuLogo}></div>
      <div className={styles.menuBlock}>
        <div className={styles.menuItem}>1</div>
        <div className={styles.menuItem}>2</div>
        <div className={styles.menuItem}>3</div>
        <div className={styles.menuItem}>4</div>
      </div>
    </div>
  );
  return view;
};
const JobBoard = () => {
  const view = <div className={styles.jobBoard}></div>;
  return view;
};

const App = ({Component, pageProps: {session, ...pageProps}}: AppProps) => {
  const googleId = process.env.GOOGLE_ID || '';
  const googleSecret = process.env.GOOGLE_SECRET || '';

  return (
    <SessionProvider session={session}>
      <GoogleOAuthProvider clientId={googleId}>
        <Main />
      </GoogleOAuthProvider>
    </SessionProvider>
  );
};

export default App;
