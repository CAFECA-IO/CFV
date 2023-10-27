import "../styles/global.css";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { GoogleOAuthProvider } from "@react-oauth/google";

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  const googleId = process.env.GOOGLE_ID || "";
  const googleSecret = process.env.GOOGLE_SECRET || "";

  return (
    <>
      <Head>
        <title>CFV</title>
        <link rel="icon" href="/favicon.ico" />
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
