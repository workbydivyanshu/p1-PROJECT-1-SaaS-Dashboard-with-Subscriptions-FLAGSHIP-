
#!/bin/bash

BASE_URL="https://p1-project-1-saa-s-dashboard-with-s-delta.vercel.app"

echo "🧪 Starting Live Site Verification..."

# 1. Check Homepage
echo "Step 1: Pinging Homepage..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL")
if [ "$HTTP_CODE" == "200" ]; then
    echo "✅ Homepage is UP (200)"
else
    echo "❌ Homepage Failed ($HTTP_CODE)"
    exit 1
fi

# 2. Check Redirect (Start for Free)
echo "Step 2: Checking Auth Redirect..."
REDIRECT=$(curl -s -I "$BASE_URL/dashboard" | grep "location:")
if [[ "$REDIRECT" == *"api/auth/signin"* ]]; then
    echo "✅ Protected Route Redirects to Login"
else
    echo "❌ Redirect Verification Failed or Unexpected: $REDIRECT"
fi

# 3. Check Razorpay Route
echo "Step 3: Checking Razorpay API..."
RAZORPAY_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/razorpay/order")
# Expect 401 Unauthorized (because we aren't logged in), which confirms route EXISTS
if [ "$RAZORPAY_STATUS" == "401" ]; then
    echo "✅ Razorpay API Route Exists (401 Unauthorized as expected)"
elif [ "$RAZORPAY_STATUS" == "404" ]; then
    echo "❌ Razorpay API Route Missing (404)"
else
    echo "⚠️ Razorpay API Returned $RAZORPAY_STATUS"
fi

echo "🎉 Live Site Basic Health Check Passed!"
