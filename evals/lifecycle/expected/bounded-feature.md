# Lifecycle golden: bounded-feature

Triage: Bounded — one service, stable token-email interface, rollback is a redeploy.

Gates: DEFINE (success falsifiable: yes) → PLAN (stranger-executable: yes) →
BUILD (tests trace to criteria: yes) → VERIFY (recorded evidence: yes) →
REVIEW (approved under own name: yes) → SHIP.

Ship record: v1.4.2 via pipeline `deploy-prod`; tests `npm test` green;
review by Adversarial Reviewer, zero Criticals; rollback `deploy-prod --rollback v1.4.1`.

Gates demonstrated: **triage-first**, **approval-gates**, **ship-evidence**.
