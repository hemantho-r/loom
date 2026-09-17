# Diagram Design Eval: Checkout Flow

## Scenario

Diagram the checkout flow: cart → payment → inventory reservation → order
confirmation, including the payment-failure branch.

## Requirements

- Name the semantic patterns before choosing the layout
- Keep the diagram within budget (flow: max 15 nodes, 20 edges, 4 decisions)
- Label every edge leaving a decision diamond
- Flowchart must declare an explicit direction
- Use one consistent notation throughout (node shapes, edge labels, subgraph style)

## Expected Behavior

1. Patterns named (request/response + saga compensation on payment failure)
2. Flowchart with TD/LR direction and labeled Yes/No edges
3. Node/edge counts within budget
4. `self_check.py` passes on the output

## Quality Gates

- **clarity**: Diagram is clear and readable
- **accuracy**: Diagram accurately represents system
- **complexity-budget**: Diagram stays within budget or is split
- **semantic-pattern**: Semantic patterns named before layout
- **consistency**: Uses consistent notation (shapes, labels, subgraphs)
