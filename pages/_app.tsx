import "../styles/global.css";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { GoogleOAuthProvider } from "@react-oauth/google";

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  const googleId = process.env.GOOGLE_ID as string;

  return (
    <>
      <Head>
        <title>CFV</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="google-signin-client_id" content={process.env.GOOGLE_ID}></meta>
        <script src="https://apis.google.com/js/platform.js" async defer></script>
      </Head>

      <SessionProvider session={session}>
        <GoogleOAuthProvider clientId={googleId}>
          <Component pageProps={pageProps} />
        </GoogleOAuthProvider>
      </SessionProvider>
    </>
  );
};

export default App;
