# MCP_Automation_CuradentAI

Playwright test automation framework for CuradentAI.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env` and adjust values as needed:

```bash
cp .env.example .env
# or edit .env directly
```

## Available environment variables

- `BROWSER` — browser to run tests (`chromium`, `firefox`, `webkit`).
- `BASE_URL` — base URL for tests.
- `PLAYWRIGHT_HEADLESS` — `true` or `false`.
- `RETRIES` — number of retries for failing tests.
- `TIMEOUT` — global timeout in ms.

## Running tests

Run the test suite:

```bash
npx playwright test
```

Run a single spec:

```bash
npx playwright test tests/example.spec.js
```

To run headed:

```bash
PLAYWRIGHT_HEADLESS=false npx playwright test
```

## Notes

- Keep secrets out of the `.env` file and use secure vaults for CI.
- Add `.env` to `.gitignore` if needed.
