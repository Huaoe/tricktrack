# Smart Contract Deployment Guide

This guide covers deploying TrickTrack smart contracts to Polygon networks.

## Prerequisites

1. **Environment Variables**: Configure `.env` file
   ```env
   ALCHEMY_POLYGON_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY
   ALCHEMY_POLYGON_MUMBAI_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY
   PRIVATE_KEY=your_wallet_private_key
   POLYGONSCAN_API_KEY=your_polygonscan_api_key
   ```

2. **Wallet Balance**: Ensure deployer wallet has sufficient MATIC
   - Mumbai testnet: Get free MATIC from [Mumbai Faucet](https://faucet.polygon.technology/)
   - Polygon mainnet: Minimum 0.1 MATIC recommended

3. **Compiled Contracts**: Run `pnpm compile` before deployment

## Deployment Commands

### Local Development
```bash
# Start local Hardhat node
pnpm node

# Deploy to local network (in another terminal)
pnpm deploy:local
```

### Mumbai Testnet (Testing)
```bash
# Deploy all contracts to Mumbai
pnpm deploy:mumbai

# Expected output:
# - TRKTRKToken address
# - ValidationManager address
# - NFTBadgeFactory address
```

### Polygon Mainnet (Production)
```bash
# ⚠️ PRODUCTION DEPLOYMENT - Double-check everything
pnpm deploy:polygon

# Wait for confirmations (5 blocks)
# Save all contract addresses
```

## Contract Verification

After deployment, verify contracts on Polygonscan:

```bash
# Set contract addresses in .env
export TOKEN_ADDRESS=0x...
export VALIDATION_MANAGER_ADDRESS=0x...
export NFT_BADGE_FACTORY_ADDRESS=0x...

# Run verification script
pnpm verify:contracts

# Or verify individually
pnpm verify --network polygon <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

## Post-Deployment Checklist

- [ ] Save all contract addresses
- [ ] Verify all contracts on Polygonscan
- [ ] Update `.env.example` files in apps/web and apps/api
- [ ] Update environment variables in Vercel
- [ ] Update environment variables in Railway
- [ ] Test contract interactions from frontend
- [ ] Test contract interactions from backend
- [ ] Monitor transactions for 24 hours
- [ ] Back up deployer private key securely
- [ ] Document deployment in project records

## Troubleshooting

### Deployment Failed
- Check wallet balance
- Verify RPC endpoint is accessible
- Ensure contracts compile without errors
- Check network connection

### Verification Failed
- Ensure contract is deployed (check address on Polygonscan)
- Verify constructor arguments match deployment
- Check Polygonscan API key is valid
- Wait a few minutes and retry

### Gas Estimation Failed
- Increase gas limit in hardhat.config.cjs
- Check contract logic for infinite loops
- Ensure all contract dependencies are deployed

## Network Configuration

### Mumbai Testnet
- Chain ID: 80002
- RPC URL: https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY
- Block Explorer: https://mumbai.polygonscan.com/
- Faucet: https://faucet.polygon.technology/

### Polygon Mainnet
- Chain ID: 137
- RPC URL: https://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY
- Block Explorer: https://polygonscan.com/
- Bridge: https://wallet.polygon.technology/

## Security Best Practices

1. **Never commit private keys**: Use environment variables
2. **Test on Mumbai first**: Always test before mainnet deployment
3. **Verify contracts**: Make source code public on Polygonscan
4. **Use multi-sig wallets**: For contract ownership on mainnet
5. **Audit contracts**: Get professional audit before mainnet launch
6. **Monitor transactions**: Set up alerts for unusual activity
7. **Have rollback plan**: Prepare for emergency scenarios

## Estimated Gas Costs

### Mumbai Testnet (Free)
- Token deployment: ~2,000,000 gas
- ValidationManager: ~1,500,000 gas
- NFTBadgeFactory: ~1,800,000 gas

### Polygon Mainnet (Approximate)
- Token deployment: ~$0.05 USD
- ValidationManager: ~$0.04 USD
- NFTBadgeFactory: ~$0.04 USD
- Total: ~$0.13 USD (varies with gas price)

## References

- [Hardhat Documentation](https://hardhat.org/docs)
- [Polygon Documentation](https://docs.polygon.technology/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Ethers.js Documentation](https://docs.ethers.org/v6/)
