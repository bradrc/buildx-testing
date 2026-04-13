#!/bin/bash

# Configuration
API_URL="http://localhost:5023"
USERNAME="testuser"
PASSWORD="Password123!"

echo "=== Starting E2E Authentication Flow Test ==="

# 1. Test Login (Simulating Frontend Login)
echo "[1/3] Testing Login Endpoint..."
# Using a very simple JSON string to avoid any shell escaping issues
LOGIN_DATA='{"username":"testuser","password":"Password123!"}'

LOGIN_RESPONSE=$(curl -s -X POST $API_URL/login \
  -H "Content-Type: application/json" \
  -d "$LOGIN_DATA")

if [[ $LOGIN_RESPONSE == *"token"* ]]; then
    echo "✅ Login Successful!"
    TOKEN=$(echo $LOGIN_RESPONSE | grep -oP '(?<="token":")[^"]*')
    echo "Token retrieved: ${TOKEN:0:10}..."
else
    echo "❌ Login Failed!"
    echo "Response: $LOGIN_RESPONSE"
    exit 1
fi

# 2. Test Token Storage & Usage (Simulating subsequent request with token)
echo "[2/3] Testing Protected Endpoint with Token..."
PROTECTED_RESPONSE=$(curl -s -X GET $API_URL/protected \
  -H "Authorization: Bearer $TOKEN")

if [[ $PROTECTED_RESPONSE == *"You are authorized!"* ]]; then
    echo "✅ Protected Endpoint Access Successful!"
else
    echo "❌ Protected Endpoint Access Failed!"
    echo "Response: $PROTECTED_RESPONSE"
    exit 1
fi

# 3. Test CORS (Simulating a request from a different origin)
echo "[3/3] Testing CORS Preflight (OPTIONS)..."
CORS_RESPONSE=$(curl -s -X OPTIONS $API_URL/login \
  -H "Origin: http://localhost:5174" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -I)

if echo "$CORS_RESPONSE" | grep -q "Access-Control-Allow-Origin: http://localhost:5174"; then
    echo "✅ CORS Preflight Successful!"
else
    echo "❌ CORS Preflight Failed!"
    echo "Response headers did not contain expected Access-Control-Allow-Origin"
    exit 1
fi

echo "=== E2E Authentication Flow Test PASSED ==="
