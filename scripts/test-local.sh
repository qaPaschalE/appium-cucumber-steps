#!/bin/bash

# Script to test the package locally

set -e

echo "🔨 Building package..."
npm run build

echo "📦 Creating tarball..."
npm pack

echo "🧪 Setting up test project..."
cd ..
rm -rf test-local-install
mkdir test-local-install
cd test-local-install

echo "📥 Installing package from tarball..."
npm init -y
npm install ../appium-cucumber-steps/appium-cucumber-steps-*.tgz

echo "🚀 Initializing project..."
npx appium-cucumber-init

echo ""
echo "✅ Setup complete!"
echo ""
echo "To run tests:"
echo "  cd ../test-local-install"
echo "  npm run test:smoke"
echo ""