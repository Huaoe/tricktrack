// Type test file to verify @tricktrack/types imports work correctly
import {
  type User,
  WalletType,
  UserRole,
  type Validation,
  ValidationStatus,
  TrickType,
  type TokenTransaction,
  TransactionType,
  type ApiResponse,
  type ErrorResponse,
  type PaginatedResponse
} from '@tricktrack/types';

// Test User type
const testUser: User = {
  id: '1',
  walletAddress: '0x1234567890123456789012345678901234567890',
  walletType: WalletType.EXTERNAL,
  role: UserRole.VALIDATOR,
  createdAt: new Date(),
  suspended: false,
};

// Test Validation type
const testValidation: Validation = {
  id: '1',
  skaterId: '1',
  trickType: TrickType.HEELFLIP,
  videoUrl: 'https://example.com/video.mp4',
  status: ValidationStatus.IN_PROGRESS,
  scores: [
    {
      validatorId: '2',
      landing: 45,
      style: 25,
      difficulty: 18,
      feedback: 'Great execution!',
    }
  ],
  createdAt: new Date(),
};

// Test TokenTransaction type
const testTransaction: TokenTransaction = {
  id: '1',
  userId: '1',
  amount: 50,
  type: TransactionType.TRICK_REWARD,
  txHash: '0xabc123',
  createdAt: new Date(),
};

// Test ApiResponse type
const testSuccessResponse: ApiResponse<User> = {
  success: true,
  data: testUser,
  timestamp: new Date().toISOString(),
};

// Test ErrorResponse type
const testErrorResponse: ApiResponse<null> = {
  success: false,
  error: {
    code: 'VALIDATION_ERROR',
    message: 'Invalid input data',
    details: { field: 'email' }
  },
  timestamp: new Date().toISOString(),
};

// Test PaginatedResponse type
const testPaginatedResponse: PaginatedResponse<User> = {
  items: [testUser],
  total: 100,
  page: 1,
  pageSize: 20,
  hasMore: true,
};

// Export to prevent unused variable warnings
export {
  testUser,
  testValidation,
  testTransaction,
  testSuccessResponse,
  testErrorResponse,
  testPaginatedResponse
};
