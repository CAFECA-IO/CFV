import '../styles/globals.css';
import Head from 'next/head';
import Image from 'next/image';
import {SessionProvider} from 'next-auth/react';
import type {AppProps} from 'next/app';
import {GoogleOAuthProvider} from '@react-oauth/google';
import {useSession, signIn, signOut} from 'next-auth/react';
import {GoogleLogin} from '@react-oauth/google';
import {PiHouseBold} from 'react-icons/pi';
import {LuUsers} from 'react-icons/lu';

const Main = () => {
  const {data: session, status} = useSession();
  const content = !session ? <OperationView session={session} /> : <LoginView />;
  const view = (
    <div className="p-10px font-roboto flex min-h-screen max-w-1032px mx-auto justify-center items-center">
      {content}
    </div>
  );
  return view;
};

const LoginView = () => {
  const view = (
    <div className="flex flex-col justify-center items-center h-720px w-full bg-white rounded">
      <div className="ml-530px w-560px h-250px 80px text-2xl font-bold">
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
    <div className="flex items-start justify-start w-full h-720px rounded bg-white">
      <MenuView />
      <JobBoard />
    </div>
  );

  return view;
};

const MenuView = () => {
  const view = (
    <div className="w-250px flex flex-col space-y-20 items-center h-full rounded px-4 py-6 bg-white shadow-xl">
      {/* Info: (20231024 - Julian) Logo */}
      <div>
        <Image src="/tsmc_logo.svg" width={100} height={80} alt="tsmc_logo" />
      </div>
      {/* Info: (20231024 - Julian) User Info */}
      <div className="flex space-x-4 items-center">
        {/* Info: (20231024 - Julian) Avatar */}
        <div className="rounded-full overflow-hidden relative w-50px h-50px">
          <Image
            src={'/avatar/user_photo_1.jpeg'}
            fill
            style={{objectFit: 'cover', objectPosition: 'top'}}
            alt="avatar"
          />
        </div>
        {/* Info: (20231024 - Julian) User Name & Email */}
        <div className="flex flex-col">
          <h2 className="text-sm text-black">Jane Doe</h2>
          <p className="text-gray text-xs">jane.doe@gmail.com</p>
        </div>
      </div>
      {/* Info: (20231024 - Julian) Menu Items */}
      <div className="flex flex-col w-full">
        {/* Info: (20231024 - Julian) Overview */}
        <button className="flex w-full text-white font-bold border border-primaryGreen text-base items-center space-x-2 p-3 bg-primaryGreen">
          <PiHouseBold size={24} />
          <p>Overview</p>
        </button>
        {/* Info: (20231024 - Julian) Collaborators */}
        <button className="flex w-full text-black2 border font-bold border-gray2 text-base items-center space-x-2 p-3 bg-white">
          <LuUsers size={24} />
          <p>Collaborators</p>
        </button>
      </div>
    </div>
  );
  return view;
};
const JobBoard = () => {
  const view = <div className="flex h-full bg-white2"></div>;
  return view;
};

const App = ({Component, pageProps: {session, ...pageProps}}: AppProps) => {
  const googleId = process.env.GOOGLE_ID || '';
  const googleSecret = process.env.GOOGLE_SECRET || '';

  return (
    <>
      <Head>
        <title>TSMS</title>
        <link rel="icon" href="/tsms.ico" />
      </Head>

      <SessionProvider session={session}>
        <GoogleOAuthProvider clientId={googleId}>
          <Main />
        </GoogleOAuthProvider>
      </SessionProvider>
    </>
  );
};

export default App;
