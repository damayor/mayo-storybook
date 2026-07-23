# Deploy Automation — mayinteractive.io

## Current state
- Build: `pnpm build` → outputs to `/build` folder
- Deploy: manual via FileZilla → `/domains/mayinteractive.io/public_html`
- Goal: single command that builds and uploads automatically

---

## TASK 1 — Install FTP CLI client

We'll use **lftp** — the most robust CLI FTP tool. It mirrors directories and only uploads new or changed files.

```bash
# Linux/WSL
sudo apt install lftp

# macOS
brew install lftp

# Windows native → use WSL or fallback in TASK 1-B
```

**No-install fallback:** see TASK 1-B at the bottom (uses `curl`).

---

## TASK 2 — Store credentials securely

Create `.env.deploy` in the project root. **Do not commit this file.**

```bash
# .env.deploy
FTP_HOST=82.198.227.153
FTP_USER=u857179322
FTP_PASS=your_password_here
FTP_REMOTE_DIR=/domains/mayinteractive.io/public_html
FTP_LOCAL_DIR=./build
```

Add to `.gitignore`:
```
.env.deploy
```

---

## TASK 3 — Create the deploy script

Create `deploy.sh` in the project root:

```bash
#!/bin/bash
set -e

# Load env vars
source .env.deploy

echo "🔨 Building..."
pnpm build

echo "🚀 Uploading to $FTP_HOST..."
lftp -c "
  set ftp:ssl-allow yes;
  set ssl:verify-certificate no;
  open ftp://$FTP_USER:$FTP_PASS@$FTP_HOST;
  mirror --reverse --delete --verbose \
    $FTP_LOCAL_DIR \
    $FTP_REMOTE_DIR;
  bye
"

echo "✅ Deploy complete → https://mayinteractive.io"
```

Make it executable:
```bash
chmod +x deploy.sh
```

> `--reverse` uploads local → remote (instead of downloading).
> `--delete` removes files from the server that no longer exist in the local build.

---

## TASK 4 — Add npm script

```json
"scripts": {
  "build": "...",
  "deploy": "bash deploy.sh"
}
```

From now on, the full deploy is:

```bash
pnpm deploy
```

---

## TASK 5 — Verify

Run `pnpm deploy` and watch the file-by-file upload progress. Confirm at https://mayinteractive.io when done.

---

## TASK 6 (Optional) — Migrate to GitHub Pages with custom domain

If you want to ditch FTP hosting and get automatic deploys on every `git push`:

1. Push the repo to GitHub
2. Go to `Settings → Pages` → Source: **GitHub Actions**
3. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

4. In `Settings → Pages → Custom domain`: enter `mayinteractive.io`
5. In your domain registrar, add DNS records:
   - Type `CNAME`, name `www`, value `yourusername.github.io`
   - For the apex domain (`@`): 4 x `A` records pointing to GitHub Pages IPs

> Every `git push main` triggers an automatic deploy. No FileZilla, no FTP, free.

---
