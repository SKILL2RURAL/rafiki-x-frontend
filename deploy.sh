#!/bin/bash

# Rafiki X Frontend - Deployment Script
# Run this script on your EC2 instance after initial setup

set -e  # Exit on error

echo "🚀 Starting deployment..."

# Navigate to project directory
cd /home/ec2-user/rafiki-x-frontend

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
pm2 restart rafiki-x-frontend || pm2 start .output/server/index.js --name rafiki-x-frontend

# Save PM2 configuration
pm2 save

echo "✅ Deployment complete!"
echo "📊 Application status:"
pm2 status

echo "📝 View logs with: pm2 logs rafiki-x-frontend"

