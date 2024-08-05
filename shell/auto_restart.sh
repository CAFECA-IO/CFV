#!/bin/bash
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
pm2 start npx --name Crawler -- ts-node ./runtime/crawler.ts
pm2 start npx --name SEOBot -- ts-node ./runtime/seo.ts
