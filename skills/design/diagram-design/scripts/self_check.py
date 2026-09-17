#!/usr/bin/env python3
"""Loom diagram self-check.

Static checks for Mermaid blocks inside a markdown file, mirroring the
complexity budgets in references/output-dials.md and the pitfalls in
references/mermaid-patterns.md.

Usage:
    python scripts/self_check.py path/to/diagram.md

Exit code 0 = pass, 1 = fail (prints each violation).
"""

import re
import sys
from pathlib import Path

FLOWCHART_RE = re.compile(r"```mermaid\s*\n(.*?)```", re.DOTALL)
DECISION_NODE_RE = re.compile(r"\{[^}]*\}")
LABELED_EDGE_RE = re.compile(r"-->\|[^|]+\|")


def check_flowchart_direction(block: str, idx: int) -> list[str]:
    issues = []
    stripped = block.strip()
    if stripped.startswith("flowchart") or stripped.startswith("graph"):
        first_line = stripped.splitlines()[0]
        if not re.search(r"\b(TD|LR|TB|RL|BT)\b", first_line):
            issues.append(
                f"block {idx}: flowchart missing explicit direction "
                f"(add TD/LR, got: {first_line!r})"
            )
    return issues


def block_kind(block: str) -> str:
    first = block.strip().splitlines()[0] if block.strip() else ''
    if first.startswith(('flowchart', 'graph')):
        return 'flowchart'
    if 'sequenceDiagram' in block:
        return 'sequence'
    return 'other'


def check_decision_edges(block: str, idx: int) -> list[str]:
    issues = []
    # Only flowchart decision diamonds count: classDiagram attribute blocks
    # ({...} after a class name) and state names are not decisions.
    if block_kind(block) != 'flowchart':
        return issues
    if DECISION_NODE_RE.search(block) and "-->" in block:
        # Heuristic: every decision node should have at least one labeled edge.
        if not LABELED_EDGE_RE.search(block):
            issues.append(
                f"block {idx}: decision node present but no labeled edges "
                "(label each outgoing edge: -->|Yes| / -->|No|)"
            )
    return issues


def check_sequence_budgets(block: str, idx: int) -> list[str]:
    issues = []
    if "sequenceDiagram" not in block:
        return issues
    participants = set(re.findall(r"participant\s+(\S+)", block))
    messages = re.findall(r"[-]+>>?", block)
    if len(participants) > 6:
        issues.append(
            f"block {idx}: sequence diagram has {len(participants)} participants "
            f"(budget: 6) — split the diagram"
        )
    if len(messages) > 20:
        issues.append(
            f"block {idx}: sequence diagram has {len(messages)} messages "
            f"(budget: 20) — split the diagram"
        )
    return issues


def main(path: str) -> int:
    text = Path(path).read_text(encoding="utf-8")
    blocks = FLOWCHART_RE.findall(text)
    if not blocks:
        print("self_check: no mermaid blocks found — nothing to check")
        return 0
    issues: list[str] = []
    for i, block in enumerate(blocks, 1):
        issues += check_flowchart_direction(block, i)
        issues += check_decision_edges(block, i)
        issues += check_sequence_budgets(block, i)
    if issues:
        print(f"self_check: FAIL ({len(issues)} issue(s))")
        for issue in issues:
            print(f"  - {issue}")
        return 1
    print(f"self_check: PASS ({len(blocks)} mermaid block(s))")
    return 0


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(2)
    sys.exit(main(sys.argv[1]))
