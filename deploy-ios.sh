#!/bin/bash

# 🚀 Chravel iOS Deployment Script
# Automates: Install deps → Build web app → Sync Capacitor → Open Xcode

set -e  # Exit on any error

echo "🚀 Starting Chravel iOS deployment workflow..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Verify we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

if [ ! -f "capacitor.config.ts" ]; then
    echo "❌ Error: capacitor.config.ts not found. Are you in the Chravel project?"
    exit 1
fi

echo "${BLUE}Step 1/5: Checking dependencies...${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npx is available
if ! command -v npx &> /dev/null; then
    echo "❌ npx not found. Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ npm and npx found"
echo ""

# Step 2: Install dependencies
echo "${BLUE}Step 2/5: Installing dependencies...${NC}"
echo "Running: npm ci"
npm ci

echo "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Step 3: Build web app
echo "${BLUE}Step 3/5: Building production web app...${NC}"
echo "Running: npm run build"
npm run build

# Verify dist folder was created
if [ ! -d "dist" ]; then
    echo "❌ Error: dist/ folder not created. Build may have failed."
    exit 1
fi

echo "${GREEN}✅ Web app built successfully${NC}"
echo ""

# Step 4: Sync Capacitor
echo "${BLUE}Step 4/5: Syncing Capacitor with iOS project...${NC}"
echo "Running: npx cap sync ios"
npx cap sync ios

echo "${GREEN}✅ Capacitor synced${NC}"
echo ""

# Step 5: Open Xcode
echo "${BLUE}Step 5/5: Opening Xcode...${NC}"
echo "Running: npx cap open ios"

# Check if we're on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "${YELLOW}⚠️  Warning: Not running on macOS. Xcode cannot be opened.${NC}"
    echo "${YELLOW}   You'll need to open Xcode manually on a Mac.${NC}"
    echo ""
    echo "${GREEN}✅ Build complete! iOS project ready at: ios/App/App.xcodeproj${NC}"
    exit 0
fi

npx cap open ios

echo ""
echo "${GREEN}🎉 Success! Xcode should now be opening...${NC}"
echo ""
echo "Next steps in Xcode:"
echo "1. Select target: App (Release scheme, Any iOS Device)"
echo "2. Product → Clean Build Folder"
echo "3. Signing & Capabilities: Pick your team, set Bundle ID to com.chravel.app"
echo "4. Bump Build number (increment by 1 each upload)"
echo "5. Product → Archive"
echo "6. Organizer → Distribute App → Upload to App Store Connect"
echo ""
echo "For detailed instructions, see: TESTFLIGHT_DEPLOY.md"
echo ""
