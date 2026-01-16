# Story 1.4: Set Up Hardhat for Smart Contract Development

Status: ready-for-dev

## Story

As a **developer**,
I want **Hardhat configured in `packages/contracts/`**,
So that **I can develop, test, and deploy Solidity smart contracts for TrickTrack**.

## Acceptance Criteria

1. **Given** the monorepo is initialized
   **When** I run `pnpm test` in `packages/contracts/`
   **Then** Hardhat test suite runs successfully
   **And** the setup includes Hardhat 3, TypeScript support, OpenZeppelin contracts, testing framework, deployment scripts, and network configurations for Polygon

## Tasks / Subtasks

- [ ] Initialize Hardhat project (AC: 1)
  - [ ] Navigate to `packages/contracts/` directory
  - [ ] Run `pnpm init` to create package.json
  - [ ] Install Hardhat and toolbox: `pnpm add -D hardhat @nomicfoundation/hardhat-toolbox`
  - [ ] Run `npx hardhat init` and select "Create a TypeScript project"
- [ ] Install OpenZeppelin contracts (AC: 1)
  - [ ] Install `@openzeppelin/contracts` v5.x
  - [ ] Install `@openzeppelin/contracts-upgradeable` for proxy patterns
  - [ ] Verify OpenZeppelin imports work
- [ ] Configure Hardhat for Polygon (AC: 1)
  - [ ] Update `hardhat.config.ts` with Polygon networks
  - [ ] Add Mumbai testnet configuration
  - [ ] Add Polygon mainnet configuration
  - [ ] Configure Alchemy/Infura RPC URLs
- [ ] Set up testing framework (AC: 1)
  - [ ] Verify Hardhat Chai Matchers installed
  - [ ] Install `ethers` v6 for testing
  - [ ] Create test utilities and fixtures
  - [ ] Set up gas reporting with `hardhat-gas-reporter`
- [ ] Configure TypeScript (AC: 1)
  - [ ] Set up `tsconfig.json` with strict mode
  - [ ] Configure typechain for contract types
  - [ ] Add path aliases for imports
  - [ ] Verify TypeScript compilation
- [ ] Create contract directory structure (AC: 1)
  - [ ] Create `contracts/` directory
  - [ ] Create `test/` directory with unit and integration folders
  - [ ] Create `scripts/` directory for deployment
  - [ ] Create `ignition/` directory for Hardhat Ignition
- [ ] Set up deployment infrastructure (AC: 1)
  - [ ] Install Hardhat Ignition
  - [ ] Create deployment modules structure
  - [ ] Add deployment scripts for local, testnet, mainnet
  - [ ] Configure verification with Etherscan plugin
- [ ] Configure environment variables (AC: 1)
  - [ ] Create `.env.example` file
  - [ ] Add RPC URLs, private keys, API keys
  - [ ] Install `dotenv` for environment loading
  - [ ] Document required environment variables
- [ ] Add sample contract and test (AC: 1)
  - [ ] Create sample `Lock.sol` contract (from Hardhat template)
  - [ ] Create corresponding test file
  - [ ] Run tests to verify setup
  - [ ] Remove sample files after verification
- [ ] Verify Hardhat functionality
  - [ ] Run `pnpm test` - tests pass
  - [ ] Run `pnpm compile` - contracts compile
  - [ ] Test local node: `npx hardhat node`
  - [ ] Test deployment to local network

## Dev Notes

### Architecture Requirements

**Smart Contract Framework:** Hardhat 3 with TypeScript (from `@architecture.md`)

**Key Features:**
- **Solidity:** v0.8.20+ with optimizer enabled
- **Testing:** Hardhat Chai Matchers + ethers.js v6
- **Deployment:** Hardhat Ignition for deployment management
- **Verification:** Etherscan plugin for contract verification
- **Security:** OpenZeppelin Contracts v5 for battle-tested patterns

**Blockchain Requirements:**
- **Network:** Polygon mainnet (Mumbai testnet for staging)
- **Gas Cost Target:** < $0.01 per validation (requires batch processing)
- **Transaction Finality:** 2-3 seconds on Polygon
- **Smart Contract Upgradeability:** Transparent proxy pattern for key contracts

### Hardhat Configuration

**hardhat.config.ts:**
```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ignition-ethers";
import "hardhat-gas-reporter";
import "solidity-coverage";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    polygonMumbai: {
      url: process.env.ALCHEMY_POLYGON_MUMBAI_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 80001,
    },
    polygon: {
      url: process.env.ALCHEMY_POLYGON_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 137,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    token: "MATIC",
  },
  etherscan: {
    apiKey: {
      polygon: process.env.POLYGONSCAN_API_KEY || "",
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || "",
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
```

**package.json:**
```json
{
  "name": "@tricktrack/contracts",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "compile": "hardhat compile",
    "test": "hardhat test",
    "test:coverage": "hardhat coverage",
    "test:gas": "REPORT_GAS=true hardhat test",
    "node": "hardhat node",
    "deploy:local": "hardhat ignition deploy ignition/modules/Deploy.ts --network localhost",
    "deploy:mumbai": "hardhat ignition deploy ignition/modules/Deploy.ts --network polygonMumbai --verify",
    "deploy:polygon": "hardhat ignition deploy ignition/modules/Deploy.ts --network polygon --verify",
    "verify": "hardhat verify",
    "clean": "hardhat clean"
  },
  "devDependencies": {
    "@nomicfoundation/hardhat-toolbox": "^4.0.0",
    "@nomicfoundation/hardhat-ignition-ethers": "^0.15.0",
    "@openzeppelin/contracts": "^5.0.0",
    "@openzeppelin/contracts-upgradeable": "^5.0.0",
    "hardhat": "^2.19.0",
    "hardhat-gas-reporter": "^2.0.0",
    "solidity-coverage": "^0.8.5",
    "dotenv": "^16.3.1"
  }
}
```

### Directory Structure

```
packages/contracts/
├── contracts/
│   ├── TRKTRKToken.sol           # ERC-20 token (future)
│   ├── ValidationManager.sol     # Validation logic (future)
│   ├── NFTBadgeFactory.sol       # ERC-721 badges (future)
│   ├── DAOIntegration.sol        # Aragon DAO interface (future)
│   └── TreasuryManager.sol       # Treasury management (future)
├── test/
│   ├── unit/
│   │   └── Lock.test.ts          # Sample test
│   ├── integration/
│   └── fixtures/
│       └── deploy.ts
├── scripts/
│   └── deploy.ts                 # Deployment scripts
├── ignition/
│   └── modules/
│       └── Deploy.ts             # Hardhat Ignition modules
├── .env.example
├── hardhat.config.ts
├── tsconfig.json
└── package.json
```

### Environment Configuration

**.env.example:**
```env
# RPC Providers
ALCHEMY_POLYGON_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY
ALCHEMY_POLYGON_MUMBAI_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY
INFURA_POLYGON_URL=https://polygon-mainnet.infura.io/v3/YOUR_PROJECT_ID

# Deployment
PRIVATE_KEY=your_private_key_here

# Verification
POLYGONSCAN_API_KEY=your_polygonscan_api_key

# Gas Reporting
REPORT_GAS=false
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key
```

### Smart Contracts to Develop (Future Stories)

**From `@architecture.md` and `@epics.md`:**

1. **TRKTRKToken.sol** - ERC-20 token contract
2. **ValidationManager.sol** - Validation and reward distribution
3. **NFTBadgeFactory.sol** - ERC-721 badge minting
4. **DAOIntegration.sol** - Aragon DAO interface
5. **TreasuryManager.sol** - Multi-sig treasury management

### Testing Requirements

**Test Structure:**
```typescript
// test/unit/Lock.test.ts
import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("Lock", function () {
  it("Should set the right unlockTime", async function () {
    const lockedAmount = ethers.parseEther("1");
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

    const Lock = await ethers.getContractFactory("Lock");
    const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

    expect(await lock.unlockTime()).to.equal(unlockTime);
  });
});
```

**Verification Steps:**
1. Run `pnpm compile` - contracts compile successfully
2. Run `pnpm test` - all tests pass
3. Run `pnpm test:gas` - gas report generates
4. Run `pnpm node` - local Hardhat node starts
5. Deploy to local network - deployment succeeds
6. Verify TypeScript types generated in `typechain-types/`

**Success Criteria:**
- Hardhat compiles contracts without errors
- Test suite runs and passes
- Gas reporter works correctly
- Deployment scripts execute successfully
- TypeScript types are generated
- OpenZeppelin contracts import correctly

### Security Considerations

**From `@architecture.md` - NFR Requirements:**
- Zero critical vulnerabilities in smart contract audit (NFR10)
- Gas costs < $0.01 per validation at 10x volume (NFR19)
- 100% token distribution accuracy (NFR25)
- Multi-sig treasury (2-of-3 for > 10,000 TRKTRK) (NFR12)

**Best Practices:**
- Use OpenZeppelin contracts for security patterns
- Enable optimizer for gas efficiency
- Write comprehensive test coverage (aim for 100%)
- Use Hardhat Ignition for deterministic deployments
- Verify contracts on Polygonscan after deployment

### Dependencies

**Story 1.1** - Monorepo must be initialized

### References

- [Source: `@architecture.md` - Smart Contracts (Hardhat 3)]
- [Source: `@architecture.md` - Smart Contract Testing]
- [Source: `@stories-epic-01-foundation.md` - Story 1.4]
- [Source: `@epics.md` - Epic 4: Smart Contract Deployment]
- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Polygon Documentation](https://docs.polygon.technology/)

## Dev Agent Record

### Agent Model Used

Cascade (Windsurf IDE)

### Debug Log References

### Completion Notes List

### File List

