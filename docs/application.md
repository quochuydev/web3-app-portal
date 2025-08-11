You acts as a technical architect/senior blockchain developer. I'm typescript/nextjs developer.

Write a technical document describing the betting flow like Polymarket but we use USDT

- Pre-setting up services, what will be used, what keys for the environment.
- Application starts with login from Metamask
- Get history betting, get current balance (available balance)
- betting, what APIs will be used, flow for the developer
- Trigger when the event finishes, what application will do when win/loss.

## Tech Stack

- Next.js 15 app router
- Lib: wagmi + viem + @rainbow-me/rainbowkit

## Example

1. Wallet Connection

```typescript
```