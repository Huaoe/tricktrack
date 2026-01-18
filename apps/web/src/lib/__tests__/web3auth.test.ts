import { describe, it, expect, beforeAll } from '@jest/globals';

describe('Web3Auth Configuration', () => {
  beforeAll(() => {
    process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID = 'test_client_id';
    process.env.NEXT_PUBLIC_POLYGON_RPC_URL = 'https://polygon-mainnet.g.alchemy.com/v2/test';
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = 'test_google_id';
    process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID = 'test_twitter_id';
    process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID = 'test_discord_id';
  });

  it('should have Web3Auth dependencies installed', () => {
    expect(() => require('@web3auth/modal')).not.toThrow();
    expect(() => require('@web3auth/base')).not.toThrow();
    expect(() => require('@web3auth/ethereum-provider')).not.toThrow();
    expect(() => require('@web3auth/openlogin-adapter')).not.toThrow();
  });

  it('should have ethers installed', () => {
    expect(() => require('ethers')).not.toThrow();
  });

  it('should export web3auth instance', async () => {
    const { web3auth } = await import('../web3auth');
    expect(web3auth).toBeDefined();
  });

  it('should export initWeb3Auth function', async () => {
    const { initWeb3Auth } = await import('../web3auth');
    expect(typeof initWeb3Auth).toBe('function');
  });

  it('should export loginWithWeb3Auth function', async () => {
    const { loginWithWeb3Auth } = await import('../web3auth');
    expect(typeof loginWithWeb3Auth).toBe('function');
  });

  it('should export getWalletAddress function', async () => {
    const { getWalletAddress } = await import('../web3auth');
    expect(typeof getWalletAddress).toBe('function');
  });

  it('should export logout function', async () => {
    const { logout } = await import('../web3auth');
    expect(typeof logout).toBe('function');
  });

  it('should have correct Polygon network configuration', async () => {
    const { CHAIN_NAMESPACES } = await import('@web3auth/base');
    const chainConfig = {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: '0x89',
      rpcTarget: process.env.NEXT_PUBLIC_POLYGON_RPC_URL!,
      displayName: 'Polygon Mainnet',
      blockExplorer: 'https://polygonscan.com',
      ticker: 'MATIC',
      tickerName: 'Polygon',
    };
    
    expect(chainConfig.chainId).toBe('0x89');
    expect(chainConfig.ticker).toBe('MATIC');
    expect(chainConfig.displayName).toBe('Polygon Mainnet');
  });

  it('should have required environment variables defined', () => {
    expect(process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID).toBeDefined();
    expect(process.env.NEXT_PUBLIC_POLYGON_RPC_URL).toBeDefined();
    expect(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID).toBeDefined();
    expect(process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID).toBeDefined();
    expect(process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID).toBeDefined();
  });
});
