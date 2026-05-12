# ADR-0006: Network Deployment Strategy

## Status

Accepted

## Context

TaskForm needs to operate across two Sui networks:
- Move contract development and testing
- Walrus Site hosting for the frontend

## Decision

| Component | Network | Reason |
|-----------|---------|--------|
| Move contract | **Testnet** | Development, testing, iteration without real cost |
| Frontend interaction (default) | **Testnet** | All form creation, submission, dashboard queries |
| Walrus Site deployment | **Mainnet** | Production hosting at taskform.wall.app |
| Walrus blob storage | **Mainnet** | Form schemas, submissions, attachments |

### Rules

1. All Move contract development, publishing, and testing happens on **testnet**.
2. The frontend defaults to **testnet** for all Sui transactions and queries.
3. Walrus Site (`taskform.wall.app`) is deployed on **mainnet Walrus**.
4. Walrus blob storage (form schemas, submissions, files) uses **mainnet Walrus**.
5. Environment config must clearly separate network settings.

### Environment Variables

```env
# Sui network (for Move contract interaction)
VITE_SUI_NETWORK=testnet

# Walrus (mainnet for blob storage and site hosting)
VITE_WALRUS_AGGREGATOR=https://aggregator.walrus.site
VITE_WALRUS_PUBLISHER=https://publisher.walrus.site

# Contract addresses (testnet)
VITE_PACKAGE_ID=<testnet_package_id>
VITE_REGISTRY_ID=<testnet_registry_object_id>
```

## Consequences

- Developers use testnet SUI (free faucet) for contract interaction.
- Form data is stored on mainnet Walrus for persistence and public access.
- The Walrus Site itself lives on mainnet for production availability.
- No mainnet SUI is needed for form creation/submission (only testnet).
- Walrus mainnet storage requires WAL tokens for epoch-based storage.
