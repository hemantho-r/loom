# Planning golden: sprint-slice

Non-goals: accounts, gift cards, international tax.

## Task 1: Order persistence

- Depends on: none.
- Acceptance: Given a valid cart, When submitted, Then an order row exists
  with status `pending`.

## Task 2: Card charge

- Depends on: Task 1.
- Acceptance: Given a pending order, When charged, Then provider reports
  success and the order becomes `paid`.

## Task 3: Confirmation email

- Depends on: Task 2.
- Acceptance: Given a paid order, When finalized, Then exactly one
  confirmation email is queued within 60s.

Gates demonstrated: **task-scope**, **dependencies**, **acceptance-criteria**.
