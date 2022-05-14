import axios, { AxiosResponse } from "axios";
import { EtherscanTransactionListResponse } from "../types/Transaction";

const etherscanrinkeby = "https://api-rinkeby.etherscan.io/api?";

export const getTransactions = async (address: string) => {
  try {
    const response = await axios.get(etherscanrinkeby, {
      params: {
        module: "account",
        action: "txlist",
        address,
        startblock: 0,
        endblock: 99999999,
        sort: "desc",
        apikey: process.env.ETHERSCAN_APIKEY,
      },
    });
    if (response.status !== 200) return null;
    return response.data as EtherscanTransactionListResponse;
  } catch (e) {
    return null;
  }
};
