export function verifyWeb3AuthConfiguration() {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID) {
    errors.push('NEXT_PUBLIC_WEB3AUTH_CLIENT_ID is not set');
  }

  if (!process.env.NEXT_PUBLIC_POLYGON_RPC_URL) {
    errors.push('NEXT_PUBLIC_POLYGON_RPC_URL is not set');
  }

  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    warnings.push('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set');
  }

  if (!process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID) {
    warnings.push('NEXT_PUBLIC_TWITTER_CLIENT_ID is not set');
  }

  if (!process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID) {
    warnings.push('NEXT_PUBLIC_DISCORD_CLIENT_ID is not set');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export async function testWeb3AuthImports() {
  try {
    const { web3auth, initWeb3Auth, loginWithWeb3Auth, getWalletAddress, logout } = await import('../web3auth');
    
    const results = {
      web3authInstance: !!web3auth,
      initWeb3AuthFunction: typeof initWeb3Auth === 'function',
      loginWithWeb3AuthFunction: typeof loginWithWeb3Auth === 'function',
      getWalletAddressFunction: typeof getWalletAddress === 'function',
      logoutFunction: typeof logout === 'function',
    };

    const allPassed = Object.values(results).every(v => v === true);

    return {
      success: allPassed,
      results,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
