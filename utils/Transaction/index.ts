import { ethers } from "ethers";
import { Transaction } from "../../types/Transaction";
import { decrypt, encrypt } from "../Crypto";

export const validateTransaction = (
  ethAmount: string,
  ethDestiny: string,
  balance: string
) => {
  if (isNaN(Number(ethAmount))) {
    alert("ETH amount should be a number");
    return false;
  }
  const amount = ethers.utils.parseEther(ethAmount);
  if (amount.isNegative() || !amount._isBigNumber || amount.isZero()) {
    alert("ETH amount have to be in a good format");
    return false;
  }
  if (amount.gt(ethers.utils.parseEther(balance.replace(" ETH", "")))) {
    alert(
      `ETH amount to transfer should be less than your current balance (${balance})`
    );
    return false;
  }
  if (!ethers.utils.isAddress(ethDestiny)) {
    alert("Destiny address should be a valid address");
    return false;
  }
  return true;
};

export const storageTransactions = (
  transactions: Transaction[],
  address: string
) => {
  const digest = encrypt(JSON.stringify(transactions), address);
  const JSONdigest = Buffer.from(JSON.stringify(digest)).toString("base64");
  localStorage.setItem("transactions_tmp", JSONdigest);
};

export const restoreTransactions = (address: string) => {
  if (!localStorage.getItem("transactions_tmp")) return [];
  try {
    const JSONundigest = Buffer.from(
      localStorage.getItem("transactions_tmp")!,
      "base64"
    ).toString("utf-8");
    const undigest = decrypt(JSON.parse(JSONundigest), address);
    return JSON.parse(undigest) as Transaction[];
  } catch (e) {
    localStorage.removeItem("transactions_tmp");
    return [];
  }
};
