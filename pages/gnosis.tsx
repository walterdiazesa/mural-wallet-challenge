import React, { useEffect } from "react";
import { useAddress, useDisconnect, useGnosis } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import SafeProvider, { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { Loader } from "../components";

const gnosis = () => {
  const address = useAddress();
  const connectWithGnosis = useGnosis();
  const disconnectWallet = useDisconnect();
  const router = useRouter();
  const { sdk, connected, safe } = useSafeAppsSDK();

  return (
    <>
      <p
        onClick={async () => {
          const gnosisLogin = await connectWithGnosis({
            safeAddress: "0x43435fFCAf5BB3C302442FE2D341fC4BAbA129aB",
            safeChainId: 4,
          });
          if (gnosisLogin.error) return;
          console.log("GNOSIS", gnosisLogin.data);
        }}
      >
        wwwwwwwwwwwwwwwwwww
      </p>
    </>
  );
};

const SafeWrapper = () => {
  const router = useRouter();
  return (
    <div className="px-3 sm:px-8">
      <div className="my-3 flex">
        <p
          onClick={() => router.replace("/")}
          className="w-full cursor-pointer bg-gradient-to-br from-dodo-mint-clear to-dodo-mint-end shadow-dodo-mint-end/40 hover:shadow-dodo-mint-end/60 rounded-lg py-2 px-4 font-medium text-white transform-gpu transition ease-in-out duration-200 shadow-lg hover:scale-y-105"
        >
          Back to Main
        </p>
      </div>
      {/* @ts-ignore */}
      <SafeProvider
        loader={<Loader />}
        opts={{ allowedDomains: [/gnosis-safe.io/] }}
      >
        {gnosis}
      </SafeProvider>
    </div>
  );
};

export default React.memo(SafeWrapper);
