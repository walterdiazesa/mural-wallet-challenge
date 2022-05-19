import { LogoutIcon } from "@heroicons/react/outline";
import { useAddress, useDisconnect } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import React, {
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getTransactions } from "../../axios";
import { Transaction } from "../../types/Transaction";
import {
  restoreTransactions,
  storageTransactions,
  validateTransaction,
} from "../../utils/Transaction";
import { Button } from "..";

const index = ({ children }: { children: JSX.Element }) => {
  const router = useRouter();

  const address = useAddress();
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
            router.push("/");
          }}
          className="from-dodo-barney-clear to-dodo-barney-end shadow-dodo-barney-end/40 hover:shadow-dodo-barney-end/60 flex items-center text-sm xl:text-base h-12 justify-self-end ml-auto"
        >
          <>
            <LogoutIcon className="h-5 w-5 xmd:mr-2" />
            <span className="hidden xmd:block">Disconnect</span>
          </>
        </Button>
      </div>
      {{
        ...children,
        props: {
          ...children.props,
          balance,
          setBalance,
          transactions,
          setTransactions,
          makePayment,
          address,
        },
      }}
    </>
  );
};

export default React.memo(index);
