import { Web3Auth } from '@web3auth/modal';
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from '@web3auth/base';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { ethers } from 'ethers';

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!;

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: '0x89',
  rpcTarget: process.env.NEXT_PUBLIC_POLYGON_RPC_URL!,
  displayName: 'Polygon Mainnet',
  blockExplorer: 'https://polygonscan.com',
  ticker: 'MATIC',
  tickerName: 'Polygon',
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

export const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  chainConfig,
  privateKeyProvider,
  uiConfig: {
    appName: 'TrickTrack',
    mode: 'dark',
    loginMethodsOrder: ['google', 'twitter', 'discord'],
    defaultLanguage: 'en',
  },
});

const openloginAdapter = new OpenloginAdapter({
  adapterSettings: {
    loginConfig: {
      google: {
        verifier: 'tricktrack-google',
        typeOfLogin: 'google',
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      },
      twitter: {
        verifier: 'tricktrack-twitter',
        typeOfLogin: 'twitter',
        clientId: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID!,
      },
      discord: {
        verifier: 'tricktrack-discord',
        typeOfLogin: 'discord',
        clientId: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!,
      },
    },
  },
});

web3auth.configureAdapter(openloginAdapter);

export async function initWeb3Auth() {
  await web3auth.initModal();
}

export async function loginWithWeb3Auth() {
  const provider = await web3auth.connect();
  return provider;
}

export async function getWalletAddress(): Promise<string> {
  const provider = web3auth.provider;
  if (!provider) throw new Error('Not connected');
  
  const ethersProvider = new ethers.BrowserProvider(provider);
  const signer = await ethersProvider.getSigner();
  return await signer.getAddress();
}

export async function logout() {
  await web3auth.logout();
}
