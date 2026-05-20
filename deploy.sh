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
  mirror --reverse --verbose \
    $FTP_LOCAL_DIR \
    $FTP_REMOTE_DIR;
  bye
"

echo "✅ Deploy complete → https://mayinteractive.io"