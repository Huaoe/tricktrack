export enum TransactionType {
  TRICK_REWARD = 'trick-reward',
  VALIDATOR_BONUS = 'validator-bonus',
  CHALLENGE_REWARD = 'challenge-reward',
  TRANSFER = 'transfer',
}

export interface TokenTransaction {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  txHash?: string;
  createdAt: Date;
}

export interface TokenBalance {
  userId: string;
  balance: number;
  pendingBalance: number;
  lastUpdated: Date;
}
