import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import {
  useNetwork,
  useAddress,
  useDisconnect,
  useGnosis,
} from "@thirdweb-dev/react";
import {
  Dispatch,
  FormEvent,
  LegacyRef,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ethers } from "ethers";
import { Button, Input } from "../components";
import {
  ArrowSmLeftIcon,
  ArrowSmRightIcon,
  CubeIcon,
  DocumentSearchIcon,
  LogoutIcon,
} from "@heroicons/react/outline";
import { getTransactions } from "../axios";
import { Transaction } from "../types/Transaction";
import {
  restoreTransactions,
  storageTransactions,
  validateTransaction,
} from "../utils/Transaction";
import { useRouter } from "next/router";
import React from "react";

const Home = ({
  transactions,
  makePayment,
  address,
}: {
  balance: string;
  setBalance: React.Dispatch<React.SetStateAction<string>>;
  transactions: Transaction[];
  setTransactions: Dispatch<SetStateAction<Transaction[]>>;
  makePayment: (form: FormEvent<HTMLFormElement>) => Promise<void>;
  address: string | undefined;
}) => {
  const router = useRouter();

  return (
    <>
      <div className="my-3 px-3 sm:px-8 flex">
        <p
          onClick={() => router.push("gnosis")}
          className="w-full cursor-pointer bg-gradient-to-br from-dodo-strawberry-clear to-dodo-strawberry-end shadow-dodo-strawberry-end/40 hover:shadow-dodo-strawberry-end/60 rounded-lg py-2 px-4 font-medium text-white transform-gpu transition ease-in-out duration-200 shadow-lg hover:scale-y-105"
        >
          New in CriptoDodo: Connect with Gnosis Safe
        </p>
      </div>
      <form
        id="send_eth_transaction"
        onSubmit={(form) => makePayment(form)}
        action="/"
      >
        <div className="my-3 flex px-3 sm:px-8 justify-between">
          <div className="w-full flex">
            <div className="w-1/2">
              <Input
                type="text"
                placeholder="ETH transaction amount"
                name="eth_amount"
              />
            </div>
            <div className="w-1/2">
              <Input
                type="text"
                className="ml-2"
                placeholder="To address"
                name="eth_destiny"
              />
            </div>
          </div>
          <Button className="ml-4 from-dodo-mint-clear to-dodo-mint-end shadow-dodo-mint-end/40 hover:shadow-dodo-mint-end/60 flex items-center min-w-max">
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                width="64"
                height="102.4"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 320 512"
                className="h-5 w-5 xmd:mr-2"
              >
                <defs>
                  <linearGradient
                    id="ethereumicogradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      style={{ stopColor: "#c165dd", stopOpacity: 1 }}
                    />
                    <stop
                      offset="100%"
                      style={{ stopColor: "#5c27fe", stopOpacity: 1 }}
                    />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#ethereumicogradient)"
                  d="M311.9 260.8L160 353.6L8 260.8L160 0l151.9 260.8zM160 383.4L8 290.6L160 512l152-221.4l-152 92.8z"
                />
              </svg>
              <span className="hidden xmd:block antialiased text-transparent bg-clip-text bg-gradient-to-br from-dodo-barney-clear to-dodo-barney-end">
                Send payment
              </span>
            </>
          </Button>
        </div>
      </form>
      <div className="px-3 sm:px-8 mt-5">
        {transactions.map((transaction) => (
          <div
            key={transaction.hash}
            className="flex w-full h-10 rounded-lg bg-gradient-to-br from-dodo-void-dark to-dodo-void-black my-3 items-center justify-between pr-2.5"
          >
            <div className="flex items-center">
              <div className="w-10 h-full flex justify-center items-center">
                {transaction.to === address!.toLowerCase() ? (
                  <ArrowSmRightIcon className="text-dodo-greenflow-end h-7 w-7" />
                ) : (
                  <ArrowSmLeftIcon className="text-red-500 h-7 w-7" />
                )}
              </div>
              <a
                className={`hidden md:block font-semibold font-mono text-transparent bg-clip-text bg-gradient-to-br hover:underline ${
                  transaction.to === address!.toLowerCase()
                    ? "from-dodo-greenflow-clear to-dodo-greenflow-end decoration-dodo-greenflow-end"
                    : "from-dodo-blueelectric-clear to-dodo-blueelectric-end decoration-dodo-blueelectric-end"
                }`}
                href={`https://rinkeby.etherscan.io/address/${
                  transaction.from === address!.toLowerCase()
                    ? transaction.to
                    : transaction.from
                }`}
                target="_blank"
                rel="noreferrer"
              >
                {transaction.from === address!.toLowerCase()
                  ? transaction.to
                  : transaction.from}
              </a>
              <p
                className={`ml-3 font-bold text-transparent bg-clip-text bg-gradient-to-br from-dodo-mainsky to-dodo-mainspace`}
              >
                {transaction.to === address!.toLowerCase() ? "+" : "-"}
                {ethers.utils.formatEther(transaction.value)} ETH
              </p>
            </div>
            <div className="flex items-center">
              <p
                className={`font-mono text-sm text-transparent bg-clip-text bg-gradient-to-br from-dodo-mainsky to-dodo-mainspace`}
              >
                {new Date(
                  parseInt(transaction.timeStamp) * 1000
                ).toLocaleString()}
              </p>
              <a
                className={`${
                  transaction.blockNumber === "waiting..."
                    ? "pointer-events-none"
                    : ""
                } hidden md:flex ml-3 font-bold text-transparent bg-clip-text bg-gradient-to-br from-dodo-peach-clear to-dodo-peach-end items-center hover:underline decoration-dodo-peach-end`}
                href={`https://rinkeby.etherscan.io/block/${transaction.blockNumber}`}
                target="_blank"
                rel="noreferrer"
              >
                <CubeIcon className="h-5 w-5 text-gray-300 mr-0.5" />
                {transaction.blockNumber}
              </a>
              <a
                className={`ml-3 font-bold text-transparent flex items-center`}
                href={`https://rinkeby.etherscan.io/tx/${transaction.hash}`}
                target="_blank"
                rel="noreferrer"
              >
                <DocumentSearchIcon className="h-5 w-5 text-gray-300 hover:text-white" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default React.memo(Home);
