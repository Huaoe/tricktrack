// Type test file to verify @tricktrack/types imports work correctly
import {
  type User,
  WalletType,
  UserRole,
  type Validation,
  ValidationStatus,
  TrickType,
  type TokenBalance,
  type NFTBadge,
  BadgeType,
  type ApiResponse,
  BlockchainNetwork
} from '@tricktrack/types';

// Test User type
const testUser: User = {
  id: '1',
  walletAddress: '0x1234567890123456789012345678901234567890',
  walletType: WalletType.IN_APP,
  username: 'testskater',
  role: UserRole.SKATER,
  createdAt: new Date(),
  suspended: false,
};

// Test Validation type
const testValidation: Validation = {
  id: '1',
  skaterId: '1',
  trickType: TrickType.KICKFLIP,
  videoUrl: 'https://example.com/video.mp4',
  status: ValidationStatus.PENDING,
  scores: [],
  createdAt: new Date(),
};

// Test TokenBalance type
const testBalance: TokenBalance = {
  userId: '1',
  balance: 100,
  pendingBalance: 50,
  lastUpdated: new Date(),
};

// Test NFTBadge type
const testBadge: NFTBadge = {
  id: '1',
  userId: '1',
  badgeType: BadgeType.BRONZE,
  tokenId: 1,
  metadataUri: 'https://example.com/metadata.json',
  mintedAt: new Date(),
};

// Test ApiResponse type
const testApiResponse: ApiResponse<User> = {
  success: true,
  data: testUser,
  timestamp: new Date().toISOString(),
};

// Test enum usage
const network: BlockchainNetwork = BlockchainNetwork.POLYGON_MAINNET;

// Export to prevent unused variable warnings
export { testUser, testValidation, testBalance, testBadge, testApiResponse, network };
