#!/bin/bash

# Pull the latest changes from the remote repository
git pull origin main

# Build the TypeScript code
npm run build

# Restart the server
pm2 restart app.js
