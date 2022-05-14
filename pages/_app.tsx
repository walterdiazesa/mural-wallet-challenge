import "../styles/globals.css";
import "../extends";
import type { AppProps } from "next/app";
import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";
import MetaWallet from "../components/MetaWallet";
import Layout from "../components/Layout";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>CriptoDodo | Ethereum Wallet</title>
        <meta name="description" content="Cripto wallet challenge for mural" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"
        />
      </Head>
      <ThirdwebProvider desiredChainId={ChainId.Rinkeby}>
        <Layout>
          <MetaWallet>
            <Component {...pageProps} />
          </MetaWallet>
        </Layout>
      </ThirdwebProvider>
    </>
  );
}

export default MyApp;
