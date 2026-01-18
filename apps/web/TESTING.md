# Testing Guide for TrickTrack Web App

## Current Status

The web app does not yet have a testing framework configured. Tests have been prepared but require Jest setup to run.

## Setting Up Jest (Future Task)

To enable testing, install the following dependencies:

```bash
pnpm add -D jest @jest/globals @types/jest ts-jest @testing-library/react @testing-library/jest-dom
```

Then create `jest.config.js`:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

## Web3Auth Configuration Tests

Location: `src/lib/__tests__/web3auth.test.ts`

These tests verify:
- All Web3Auth dependencies are installed
- Configuration exports all required functions
- Polygon network is configured correctly
- Environment variables are defined

## Manual Verification

Until Jest is set up, verify Web3Auth configuration manually:

1. Run `pnpm install` to install dependencies
2. Check that `src/lib/web3auth.ts` exists
3. Verify `.env.example` has all required variables
4. Use `src/lib/__tests__/web3auth-verify.ts` for runtime checks

## Running Tests (Once Jest is Configured)

```bash
pnpm test
```

For watch mode:
```bash
pnpm test --watch
```
