# TaskForm — Storage & Privacy

## Walrus Storage Model

Walrus storage is epoch-based. TaskForm tracks expiry per resource.

### Default Durations (epochs)

| Resource | Duration |
|----------|----------|
| Form schema | 26 |
| Submission text | 13 |
| Screenshot | 13 |
| Video | 4 |

### Storage Health States

| State | Meaning |
|-------|---------|
| Active | Well within expiry |
| Expiring soon | Approaching epoch deadline |
| Expired | Past expiry epoch |
| Unknown | Cannot determine status |

## Privacy (Seal Encryption)

### Sensitive Field Types

- Email
- Phone
- Wallet address
- Private bug details
- Security report
- Internal note
- Private attachment

### Rules

- Encrypt before Walrus upload
- Do not store raw sensitive data on-chain
- Do not emit sensitive data in events
- Decrypt only for creator/approved admin

## Sponsored Submission

Creator can enable:
- Sponsor submissions toggle
- Sponsor budget (SUI)
- Max sponsored submissions
- Max file size
- Default storage duration

Message: "Web2 UX, Web3 ownership."
