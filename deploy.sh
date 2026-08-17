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
  set ftp:passive-mode true;
  set net:timeout 10;
  set net:max-retries 3;
  set net:persist-retries 3;
  set xfer:clobber yes;
  set mirror:dereference yes;
  open ftp://$FTP_USER:$FTP_PASS@$FTP_HOST;

  # Clean up orphaned .in.* temp files left by a previous interrupted transfer,
  # otherwise mirror fails with 'Temporary hidden file already exists'
  glob -a rm -f $FTP_REMOTE_DIR/.in.* $FTP_REMOTE_DIR/*/.in.* 2>/dev/null;

  mirror --reverse --verbose \
    $FTP_LOCAL_DIR \
    $FTP_REMOTE_DIR;
  bye
"

echo "✅ Deploy complete → https://mayinteractive.io"