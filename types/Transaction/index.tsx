export type Transaction = {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
};

export type EtherscanTransactionListResponse = {
  status: string;
  message: string;
  result: Transaction[];
};
