#!/bin/bash

# Setup script for odontoa project git configuration
# This ensures all git operations use the odontoa GitHub account

echo "🔧 Setting up git configuration for odontoa project..."

# Set local git configuration
git config --local user.name "Odontoa Team"
git config --local user.email "odontoa.com@gmail.com"

# Ensure remote is set to odontoa repository
git remote set-url origin git@github.com-odontoa:odontoa/odontoa-website.git

# Set up push configuration
git config --local push.default simple

# Make pre-push hook executable
chmod +x .git/hooks/pre-push

echo "✅ Git configuration set up successfully!"
echo ""
echo "Current configuration:"
echo "  User: $(git config --get user.name)"
echo "  Email: $(git config --get user.email)"
echo "  Remote: $(git config --get remote.origin.url)"
echo ""
echo "🚀 You can now safely push to the odontoa repository!"
echo "   Use: git push origin <branch-name>"
