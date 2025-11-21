#!/bin/bash

# Rafiki X Frontend - Deployment Script
# Run this script on your EC2 instance after initial setup

set -e  # Exit on error

echo "🚀 Starting deployment..."

# Navigate to project directory
cd /home/ec2-user/rafiki-x-frontend

# Discard any local changes to lock files (they should match the repo)
echo "🧹 Cleaning up local lock file changes..."
git restore pnpm-lock.yaml 2>/dev/null || git checkout HEAD -- pnpm-lock.yaml 2>/dev/null || true

# Pull latest changes
echo "📥 Pulling latest changes from repository..."
git pull origin main || git pull origin master

# Install/update dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build the application
echo "🔨 Building application..."
pnpm build

# Restart the application with PM2
echo "🔄 Restarting application..."
pm2 restart rafiki-x-frontend || pm2 start build/index.js --name rafiki-x-frontend

# Save PM2 configuration
pm2 save

echo "✅ Deployment complete!"
echo "📊 Application status:"
pm2 status

echo "📝 View logs with: pm2 logs rafiki-x-frontend"

