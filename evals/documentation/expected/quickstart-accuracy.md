# Documentation golden: quickstart-accuracy

```bash
npm install @package/sdk
```

```typescript
import { Client } from '@package/sdk';

// Key from environment — never hardcode.
const client = new Client({ apiKey: process.env.PACKAGE_API_KEY! });
const users = await client.users.list({ perPage: 20 });
// => { data: [{ id, name, email }], pagination: { nextCursor } }
```

Troubleshooting: `401 Unauthorized` → the key is missing or revoked;
regenerate it in dashboard Settings and export it again. Verified by running
each block verbatim; all links resolve.

Gates demonstrated: **accuracy**, **completeness**, **clarity**.
