#!/bin/bash

# 設定工作目錄
cd /workspace/CFV/

# 檢查是否有更新
git fetch

# 比較本地和遠端分支
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse @{u})

if [ "$LOCAL" != "$REMOTE" ]; then
  echo "New commits detected. Pulling latest changes..."
  git pull
  echo "Installing dependencies..."
  rm -rf node_modules
  npm install
  echo "Running build..."
  npm run build
  echo "Restarting application..."
  pm2 delete CFV
  pm2 delete Crawler
  pm2 delete SEOBot
  pm2 start npm --name CFV -- start
  pm2 start npm --name Crawler -- run crawler
  pm2 start npm --name SEOBot -- run seo
else
  echo "No new commits."
fi
