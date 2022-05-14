import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useNetwork, useAddress, useDisconnect } from "@thirdweb-dev/react";
import {
  FormEvent,
  LegacyRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ethers } from "ethers";
import Button from "../components/Button";
import {
  ArrowSmLeftIcon,
  ArrowSmRightIcon,
  CubeIcon,
  DocumentSearchIcon,
  LogoutIcon,
} from "@heroicons/react/outline";
import Input from "../components/Input";
import { getTransactions } from "../axios";
import { Transaction } from "../types/Transaction";
import {
  restoreTransactions,
  storageTransactions,
  validateTransaction,
} from "../utils/Transaction";

const Home: NextPage = () => {
  const address = useAddress();
  const network = useNetwork();
  const disconnectWallet = useDisconnect();
  const [balance, setBalance] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const getAndSetBalance = useCallback(async () => {
    if (!address) return;
    const provider = new ethers.providers.Web3Provider(
      window.ethereum as ethers.providers.ExternalProvider
    );
    const _balance = await provider.getBalance(address);
    const _balanceFormatted = ethers.utils.formatEther(_balance);
    setBalance(`${_balanceFormatted} ETH`);
  }, [address]);

  const getTransactionList = useCallback(async () => {
    if (!address) return;
    const cacheTransactions = restoreTransactions(address);
    const _transactions = await getTransactions(address);
    if (!_transactions) return;
    if (
      _transactions.status === "1" &&
      _transactions.result.length >= cacheTransactions.length
    ) {
      setTransactions(_transactions.result);
    } else if (cacheTransactions.length > 0) setTransactions(cacheTransactions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  useEffect(() => {
    if (!address) return;
    let timeout: NodeJS.Timeout;
    (async () => {
      Promise.allSettled([getTransactionList(), getAndSetBalance()]);
      timeout = setInterval(() => {
        console.log("timeout!");
        Promise.allSettled([getTransactionList(), getAndSetBalance()]);
      }, 15000);
    })();

    return () => {
      if (timeout) clearInterval(timeout);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  useEffect(() => {
    if (!address) return;
    storageTransactions(transactions, address);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions]);

  const makePayment = async (form: FormEvent<HTMLFormElement>) => {
    form.preventDefault();
    if (!address || !balance) return;

    const formElement = form.target as HTMLFormElement;
    const formData = new FormData(formElement);

    if (
      !formData.has("eth_amount") ||
      !formData.get("eth_amount") ||
      !formData.has("eth_destiny") ||
      !formData.get("eth_destiny")
    ) {
      alert("Can't leave empty fields for making a transaction");
      return;
    }

    if (
      !validateTransaction(
        formData.get("eth_amount")!.toString(),
        formData.get("eth_destiny")!.toString(),
        balance
      )
    )
      return;

    const destinyAddress = formData.get("eth_destiny")!.toString();

    const provider = new ethers.providers.Web3Provider(
      window.ethereum as ethers.providers.ExternalProvider
    );
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    try {
      const sendTransaction = await signer.sendTransaction({
        to: destinyAddress,
        value: ethers.utils.parseEther(formData.get("eth_amount")!.toString()),
      });
      setTransactions((_transactions) => {
        const timestamp = Date.now() / 1000;
        const transactionList = [..._transactions];
        transactionList.unshift({
          hash: sendTransaction.hash,
          blockNumber: "waiting...",
          from: destinyAddress,
          to: address,
          value: sendTransaction.value.toString(),
          timeStamp: timestamp.toString(),
        });
        return transactionList;
      });
      formElement.reset();
      const amountElement = document.getElementById("eth_amount");
      if (amountElement)
        setBalance(
          (_balance) =>
            `${ethers.utils.formatEther(
              ethers.utils
                .parseEther(_balance.replace(" ETH", ""))
                .sub(sendTransaction.value)
            )} ETH`
        );
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    }
  };

  return (
    <>
      <div className="flex bg-dodo-void-dark min-w-screen max-w-screen h-16 items-center px-3 sm:px-8">
        <div className="sm:flex">
          <p className="font-black antialiased font-mono text-transparent bg-clip-text bg-gradient-to-br from-dodo-pineapple-clear to-dodo-pineapple-end">
            <span className="hidden md:block">ADDRESS: </span>
            <span
              className={`${
                !address ? "animate-pulse " : ""
              }font-semibold text-xs sm:text-sm md:text-base font-mono antialiased text-transparent bg-clip-text bg-gradient-to-br from-dodo-strawberry-clear to-dodo-strawberry-end`}
            >
              {address || "Loading..."}
            </span>
          </p>
          <p className="sm:mx-6 font-black antialiased font-mono text-transparent bg-clip-text bg-gradient-to-br from-dodo-pineapple-clear to-dodo-pineapple-end">
            <span className="hidden md:block">BALANCE: </span>
            <span
              className={`${
                !balance ? "animate-pulse " : ""
              }font-semibold text-sm md:text-base font-mono antialiased text-transparent bg-clip-text bg-gradient-to-br from-dodo-strawberry-clear to-dodo-strawberry-end`}
            >
              {balance || "Loading..."}
            </span>
          </p>
        </div>
        <Button
          onClick={async () => {
            await disconnectWallet();
            localStorage.removeItem("meta_session");
          }}
          className="from-dodo-barney-clear to-dodo-barney-end shadow-dodo-barney-end/40 hover:shadow-dodo-barney-end/60 flex items-center text-sm xl:text-base h-12 justify-self-end ml-auto"
        >
          <>
            <LogoutIcon className="h-5 w-5 xmd:mr-2" />
            <span className="hidden xmd:block">Disconnect from Metamask</span>
          </>
        </Button>
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

export default Home;
