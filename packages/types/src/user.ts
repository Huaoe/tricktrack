export enum WalletType {
  IN_APP = 'in-app',
  EXTERNAL = 'external',
}

export enum UserRole {
  SKATER = 'skater',
  VALIDATOR = 'validator',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  walletAddress: string;
  walletType: WalletType;
  username?: string;
  role: UserRole;
  createdAt: Date;
  suspended: boolean;
}
