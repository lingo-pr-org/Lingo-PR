# Lingo‑PR Action

GitHub Action that:

1. Takes a pull‑request **diff** as input (`patch`).
2. Asks OpenAI GPT‑4o‑mini to **summarise** the changes in ≤ 5 lines.
3. Appends **Arabic & Hebrew** translations of that summary.
4. Posts the result back to the PR as a comment.

## Quick start

```bash
# 1) fork / clone
git clone https://github.com/YOUR-ORG/lingo-pr-action.git
cd lingo-pr-action

# 2) install & build (dist/index.js will be generated)
npm install
npm run build
git add dist/index.js
git commit -m "build: first bundle"
git tag v1
git push --tags
```

## Example workflow

```yaml
name: Lingo-PR demo
on:
  pull_request:
    branches: [ main ]

jobs:
  lingo:
    permissions:
      pull-requests: write
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 2

      - name: Get PR diff
        id: diff
        run: |
          echo "patch<<EOF" >> $GITHUB_OUTPUT
          curl -L ${{ github.event.pull_request.diff_url }} >> $GITHUB_OUTPUT
          echo "EOF" >> $GITHUB_OUTPUT

      - uses: your-org/lingo-pr-action@v1
        with:
          patch: ${{ steps.diff.outputs.patch }}
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

## Marketplace

After you push the `v1` tag and verify your organisation,
draft a listing in **GitHub Marketplace** and add paid plans.