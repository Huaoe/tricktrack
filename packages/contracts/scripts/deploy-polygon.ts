import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  console.log('===============================================');
  console.log('Deploying contracts to Polygon Mainnet...');
  console.log('⚠️  PRODUCTION DEPLOYMENT - USE WITH CAUTION');
  console.log('===============================================\n');

  const [deployer] = await ethers.getSigners();
  console.log('Deploying with account:', deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log('Account balance:', ethers.formatEther(balance), 'MATIC');

  // Safety check: ensure sufficient balance
  const minBalance = ethers.parseEther('0.1'); // 0.1 MATIC minimum
  if (balance < minBalance) {
    throw new Error(
      `Insufficient balance. Required: ${ethers.formatEther(minBalance)} MATIC, Available: ${ethers.formatEther(balance)} MATIC`
    );
  }

  console.log('\n⏳ Waiting 5 seconds before deployment...');
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // Deploy TRKTRKToken (placeholder - will be implemented in Story 4.1)
  console.log('\nNote: Smart contracts will be developed in Epic 4');
  console.log('This script is a template for future deployments\n');

  // Example deployment structure for future use:
  /*
  console.log('Deploying TRKTRKToken...');
  const TRKTRKToken = await ethers.getContractFactory('TRKTRKToken');
  const token = await TRKTRKToken.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log('✅ TRKTRKToken deployed to:', tokenAddress);

  console.log('\nWaiting for 5 confirmations...');
  await token.deploymentTransaction()?.wait(5);

  console.log('\nDeploying ValidationManager...');
  const ValidationManager = await ethers.getContractFactory('ValidationManager');
  const validationManager = await ValidationManager.deploy(tokenAddress);
  await validationManager.waitForDeployment();
  const validationManagerAddress = await validationManager.getAddress();
  console.log('✅ ValidationManager deployed to:', validationManagerAddress);

  console.log('\nWaiting for 5 confirmations...');
  await validationManager.deploymentTransaction()?.wait(5);

  console.log('\nDeploying NFTBadgeFactory...');
  const NFTBadgeFactory = await ethers.getContractFactory('NFTBadgeFactory');
  const nftFactory = await NFTBadgeFactory.deploy();
  await nftFactory.waitForDeployment();
  const nftFactoryAddress = await nftFactory.getAddress();
  console.log('✅ NFTBadgeFactory deployed to:', nftFactoryAddress);

  console.log('\nWaiting for 5 confirmations...');
  await nftFactory.deploymentTransaction()?.wait(5);

  console.log('\n===============================================');
  console.log('🎉 PRODUCTION DEPLOYMENT COMPLETE!');
  console.log('===============================================');
  console.log('\n📋 Contract Addresses:');
  console.log(`TOKEN_ADDRESS=${tokenAddress}`);
  console.log(`VALIDATION_MANAGER_ADDRESS=${validationManagerAddress}`);
  console.log(`NFT_BADGE_FACTORY_ADDRESS=${nftFactoryAddress}`);
  console.log('\n🔍 Verify contracts:');
  console.log(`npx hardhat verify --network polygon ${tokenAddress}`);
  console.log(`npx hardhat verify --network polygon ${validationManagerAddress} ${tokenAddress}`);
  console.log(`npx hardhat verify --network polygon ${nftFactoryAddress}`);
  console.log('\n⚠️  CRITICAL NEXT STEPS:');
  console.log('1. Verify all contracts on Polygonscan');
  console.log('2. Update production environment variables (Vercel + Railway)');
  console.log('3. Test all contract functions on mainnet');
  console.log('4. Monitor transactions for 24 hours');
  console.log('5. Back up private keys securely');
  */

  console.log('Production deployment script ready for Epic 4 implementation ✅');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  });
