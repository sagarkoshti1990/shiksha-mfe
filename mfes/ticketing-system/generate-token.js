#!/usr/bin/env node

const https = require("https");
const fs = require("fs");
const path = require("path");

// Zoho OAuth Configuration
const ZOHO_CONFIG = {
  clientId: "1000.INCDKRWKFELMVX9JHAGSVBX1ENINTG",
  clientSecret: "b9fc446c6ba98d25b9f3c8afcbea06c604a8265f3d",
  redirectUri: "https://www.google.com",
  scopes: [
    "Desk.tickets.CREATE",
    "Desk.tickets.READ",
    "Desk.contacts.CREATE",
    "Desk.contacts.READ",
  ],
};

console.log("🔐 Zoho Desk API Token Generator\n");

// Get command line arguments
const args = process.argv.slice(2);
const authCode = args[0];

if (!authCode) {
  // Step 1: Show authorization URL
  console.log("📋 Step 1: Get Authorization Code\n");

  const authUrl =
    `https://accounts.zoho.com/oauth/v2/auth?` +
    `scope=${encodeURIComponent(ZOHO_CONFIG.scopes.join(","))}` +
    `&client_id=${ZOHO_CONFIG.clientId}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(ZOHO_CONFIG.redirectUri)}` +
    `&access_type=offline`;

  console.log("🌐 Visit this URL in your browser:");
  console.log("\x1b[36m%s\x1b[0m", authUrl);
  console.log("\n📝 After granting permissions, you'll be redirected to:");
  console.log("https://www.google.com/?code=1000.abc123def456...");
  console.log("\n🔄 Then run this script again with the code:");
  console.log("\x1b[33m%s\x1b[0m", `node generate-token.js YOUR_CODE_HERE`);
  console.log("\n💡 Example:");
  console.log(
    "\x1b[33m%s\x1b[0m",
    "node generate-token.js 1000.abc123def456ghi789jkl012"
  );
} else {
  // Step 2: Exchange code for access token
  console.log("🔄 Step 2: Exchanging authorization code for access token...\n");

  const postData = new URLSearchParams({
    client_id: ZOHO_CONFIG.clientId,
    client_secret: ZOHO_CONFIG.clientSecret,
    grant_type: "authorization_code",
    code: authCode,
    redirect_uri: ZOHO_CONFIG.redirectUri,
  }).toString();

  const options = {
    hostname: "accounts.zoho.com",
    path: "/oauth/v2/token",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  const req = https.request(options, (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      try {
        const response = JSON.parse(data);

        if (response.access_token) {
          console.log("✅ Success! Access token generated:\n");
          console.log("📋 Token Details:");
          console.log(`Access Token: ${response.access_token}`);
          console.log(`Refresh Token: ${response.refresh_token || "N/A"}`);
          console.log(
            `API Domain: ${response.api_domain || "https://www.zohoapis.com"}`
          );
          console.log(`Expires In: ${response.expires_in || 3600} seconds\n`);

          // Update .env.local file
          updateEnvFile(response.access_token, response.refresh_token);
        } else {
          console.error("❌ Error getting access token:");
          console.error(JSON.stringify(response, null, 2));

          if (response.error === "invalid_code") {
            console.log(
              "\n💡 The authorization code may have expired or been used already."
            );
            console.log(
              "Please run the script without arguments to get a new authorization URL."
            );
          }
        }
      } catch (error) {
        console.error("❌ Error parsing response:", error.message);
        console.error("Raw response:", data);
      }
    });
  });

  req.on("error", (error) => {
    console.error("❌ Request error:", error.message);
  });

  req.write(postData);
  req.end();
}

function updateEnvFile(accessToken, refreshToken) {
  const envPath = path.join(__dirname, ".env.local");

  try {
    let envContent = fs.readFileSync(envPath, "utf8");

    // Update access token
    envContent = envContent.replace(
      /ZOHO_ACCESS_TOKEN=.*/,
      `ZOHO_ACCESS_TOKEN=${accessToken}`
    );

    // Update refresh token if provided
    if (refreshToken) {
      envContent = envContent.replace(
        /ZOHO_REFRESH_TOKEN=.*/,
        `ZOHO_REFRESH_TOKEN=${refreshToken}`
      );
    }

    fs.writeFileSync(envPath, envContent);

    console.log("✅ Updated .env.local file with new tokens\n");
    console.log("🚀 Your Zoho Desk API is now configured!");
    console.log(
      "🎯 You can now create real tickets through the demo interface."
    );
    console.log("\n📝 Next steps:");
    console.log("1. Restart your development server (npm run dev)");
    console.log("2. Visit the demo page");
    console.log(
      "3. Try creating a ticket - it should now work with real Zoho API!"
    );
  } catch (error) {
    console.error("❌ Error updating .env.local file:", error.message);
    console.log("\n📝 Please manually update your .env.local file:");
    console.log(`ZOHO_ACCESS_TOKEN=${accessToken}`);
    if (refreshToken) {
      console.log(`ZOHO_REFRESH_TOKEN=${refreshToken}`);
    }
  }
}
