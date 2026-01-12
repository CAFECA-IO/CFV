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
pm2 start npm --name Crawler -- run crawler
pm2 start npm --name SEOBot -- run seo
