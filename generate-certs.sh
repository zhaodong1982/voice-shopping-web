#!/bin/bash

# Create certificates directory
mkdir -p certs

# Generate self-signed certificate
openssl req -x509 -newkey rsa:4096 -keyout certs/key.pem -out certs/cert.pem -days 365 -nodes -subj "/C=CN/ST=State/L=City/O=Dev/CN=localhost"

echo "✅ SSL certificates generated in ./certs/"
echo "📝 Next steps:"
echo "1. Run: npm install --save-dev https"
echo "2. Create server.js with HTTPS configuration"
echo "3. Run: node server.js"
