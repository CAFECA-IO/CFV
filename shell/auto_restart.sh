#!/bin/bash
echo "Installing dependencies..."
rm -rf node_modules
npm install
echo "Running build..."
npm run build
echo "Restarting application..."
pm2 start ecosystem.config.js
