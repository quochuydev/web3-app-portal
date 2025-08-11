# Flow

## Requirement

- Important: Add new components in Home page, less components, simple code
- Update @README.md Pre-setting up services, what will be used, what keys for the environment.
- Application starts with login from Metamask
- Get history betting, get current balance (available balance)
- Betting
- Trigger when the event finishes, what application will do when win/loss.

## Tech Stack

- Node.js 20 - Next.js 15 app router
- Services:
  - `alchemy.com`
  - use only eth main: `https://eth-mainnet.g.alchemy.com/v2/1W6x3iKS3c2IMj-MbgWxw`
- FE libs:
  - `@tanstack/react-query`
  - `fetch` - default
- Web3 libs:

  | Purpose                   | Library                                                | Why use it?               |
  | ------------------------- | ------------------------------------------------------ | ------------------------- |
  | Wallet connect (MetaMask) | `wagmi` + `@rainbow-me/rainbowkit`                     | Easiest, hooks ready      |
  | Blockchain calls          | `viem` (bundled in `wagmi`)                            | Fast, typed               |
  | Contract interaction      | `wagmi` hooks (`useContractRead` / `useContractWrite`) | Simple EVM contract calls |

- Important: Don't use `walletconnect` `axios` `ethers.js`

## Example

1. Wallet Connection

- `wagmi` + `viem`: (modern, typesafe, supports MetaMask & many wallets)
  - Wagmi handles connection state, hooks for UI, and wallet events.
  - Viem is the underlying EVM interaction library (faster than `ethers.js`).
- `@rainbow-me/rainbowkit` (optional, for polished wallet connection UI)

2. Balance Retrieval

```typescript
import { useBalance } from "wagmi";

const { data, isLoading } = useBalance({
  address: walletAddress,
  chainId: 137, // Polygon for Polymarket-style
});
```

3. Placing a Bet

```typescript
import { useContractWrite } from "wagmi";
import BettingAbi from "./abi/Betting.json";

const { write } = useContractWrite({
  address: "0xBettingContract",
  abi: BettingAbi,
  functionName: "placeBet",
  args: [marketId, amount],
});
```
