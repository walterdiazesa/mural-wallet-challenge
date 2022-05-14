/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect } from "react";
import { useMetamask, useAddress } from "@thirdweb-dev/react";
import Button from "../Button";
import MetaFox from "../MetaFox";
import Image from "next/image";
import dynamic from "next/dynamic";
import { LoginIcon } from "@heroicons/react/outline";

const index = ({ children }: { children: JSX.Element }) => {
  const connectWithMetamask = useMetamask();
  const address = useAddress();

  // re-render if session ended bc of unused
  const [, updateState] = React.useState<any>();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  useEffect(() => {
    if (address) return localStorage.setItem("addressholder", "true");
    localStorage.removeItem("addressholder");

    return () => {
      localStorage.removeItem("addressholder");
    };
  }, [address]);

  if (!window.ethereum)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen min-w-screen max-w-screen">
        <div className="relative h-32 w-32 md:h-48 md:w-48">
          <Image
            src="/icon-512x512.png"
            alt="logo"
            priority
            layout="fill"
            objectFit="contain"
          />
        </div>
        <p className="text-white mt-3 animate-bounce">
          There is a dodoproblem...
        </p>
        <a
          href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en"
          className="hover:cursor-pointer hover:underline text-dodo-mint-clear hover:text-dodo-mint-end"
        >
          Install Metamask
        </a>
      </div>
    );

  if (localStorage.getItem("meta_session") && !address) {
    setTimeout(() => {
      if (!localStorage.getItem("addressholder")) {
        localStorage.removeItem("meta_session");
        forceUpdate();
      }
    }, 1500);

    return (
      <div className="flex flex-col justify-center items-center min-h-screen min-w-screen max-w-screen animate-pulse">
        <div className="relative h-32 w-32 md:h-48 md:w-48">
          <Image
            src="/icon-512x512.png"
            alt="logo"
            priority
            layout="fill"
            objectFit="contain"
          />
        </div>
        <p className="text-white mt-2">Loading your dododata...</p>
      </div>
    );
  }

  if (address) {
    return <div className="min-w-screen max-w-screen pb-2">{children}</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen min-w-screen max-w-screen">
      <MetaFox className="mb-6" />
      <Button
        className="from-dodo-mainsky to-dodo-mainspace shadow-dodo-mainsky/40 hover:shadow-dodo-mainsky/60 flex items-center"
        onClick={async () => {
          const metaLogin = await connectWithMetamask();
          if (metaLogin.error) return;
          localStorage.setItem("meta_session", Date.now().toString());
        }}
      >
        <>
          <LoginIcon className="h-5 w-5 mr-2" />
          <span>Login to Metamask</span>
        </>
      </Button>
    </div>
  );
};

export const getStaticProps = () => {
  return {
    props: {},
  };
};

export default dynamic(() => Promise.resolve(React.memo(index)), {
  ssr: false,
});
