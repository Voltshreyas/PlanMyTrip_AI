#!/bin/bash
# PlanMyTrip Quick Setup Script

echo "🚀 Welcome to PlanMyTrip Setup!"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed!"
    echo "📥 Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
    echo ""
    echo "🎯 Setup Complete! Next steps:"
    echo ""
    echo "1️⃣  Start the backend server:"
    echo "   npm start"
    echo ""
    echo "2️⃣  In another terminal, start a local server for the frontend:"
    echo "   python -m http.server 8000"
    echo ""
    echo "3️⃣  Open your browser:"
    echo "   http://localhost:8000"
    echo ""
    echo "💡 For development with auto-reload:"
    echo "   npm run dev"
    echo ""
else
    echo "❌ Failed to install dependencies"
    exit 1
fi
