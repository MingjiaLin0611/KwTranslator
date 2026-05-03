# AI Coding Entry

All large KW Translator tasks must use four separated roles: planner, executor, tester, and overseer.

## Role Rules

- `planner` maintains specs, breaks work into tasks, defines acceptance criteria, and identifies test direction.
- `executor` reviews the planner output before implementation, challenges unreasonable or risky steps, records accepted and rejected objections, then implements.
- `tester` validates against specs and test plans. The executor cannot be the final tester for its own work.
- `overseer` runs at milestone completion and checks whether docs, tests, and code stayed synchronized.

## Separation Rule

The same agent must not both implement production code and declare final acceptance for that code.

## Overseer Log Requirements

The overseer must record:

- Missing or stale specs.
- Missing or stale tests.
- Implementation that drifted from project goals.
- Excessive agent retry loops.
- Missing skills or tools that blocked a feature.
- Failed commands and recovery actions.

## Required Development Flow

1. Update or confirm the relevant spec.
2. Write failing tests.
3. Implement the minimum code required.
4. Run unit tests, coverage, build or compile checks, and relevant E2E tests.
5. Have tester and overseer reviews recorded before closing a major milestone.
