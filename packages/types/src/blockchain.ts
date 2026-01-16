export enum BlockchainNetwork {
  POLYGON_MAINNET = 'polygon',
  POLYGON_MUMBAI = 'mumbai',
  LOCALHOST = 'localhost',
}

export enum TransactionStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
}

export type ContractAddress = `0x${string}`;

export interface BlockchainTransaction {
  hash: string;
  status: TransactionStatus;
  network: BlockchainNetwork;
  confirmations: number;
  gasUsed?: string;
  createdAt: Date;
}
