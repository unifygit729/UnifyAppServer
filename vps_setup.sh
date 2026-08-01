#!/bin/bash
# UnifyServer VPS Setup & Launch Script for Ubuntu/Debian

set -e

echo "=== 1. Updating package list & installing system dependencies ==="
sudo apt update
sudo apt install -y curl build-essential pandoc ufw

echo "=== 2. Checking / Installing Node.js (v18+) ==="
if ! command -v node &> /dev/null || [ $(node -v | cut -d'.' -f1 | tr -d 'v') -lt 18 ]; then
    echo "Installing Node.js 20.x LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi

echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

echo "=== 3. Navigating to server directory ==="
CDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$CDIR"

echo "=== 4. Re-installing Node.js dependencies ==="
rm -rf node_modules package-lock.json
npm install

echo "=== 5. Ensuring required directories exist ==="
mkdir -p logs uploads .userdata

echo "=== 6. Configuring Firewall ==="
sudo ufw allow 3000/tcp || true
sudo ufw allow 80/tcp || true
sudo ufw allow 443/tcp || true

echo "=== 7. Installing PM2 Process Manager ==="
sudo npm install -g pm2

echo "=== 8. Starting server with PM2 ==="
pm2 delete unify-server 2>/dev/null || true
pm2 start server.js --name "unify-server"
pm2 save
pm2 startup | tail -n 1 | bash || true

echo "=== VPS Setup Complete! ==="
echo "Server Status:"
pm2 status
