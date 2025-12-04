const BingAdsClient = require('../index.js');

// ------------------------------------------------------------------
// CONFIGURATION
// ------------------------------------------------------------------
// Replace these with your actual values from Microsoft Advertising
const config = {
    clientId: 'YOUR_CLIENT_ID',           // Application (client) ID
    clientSecret: 'YOUR_CLIENT_SECRET',   // Client secret
    redirectUri: 'YOUR_REDIRECT_URI',     // e.g., http://localhost:3000/callback
    developerToken: 'YOUR_DEVELOPER_TOKEN', // Developer token
    customerId: 123456789,                // (Optional) Default Customer ID
    customerAccountId: 987654321          // (Optional) Default Account ID
};

async function main() {
    try {
        console.log("Initializing Bing Ads Client...");
        const client = new BingAdsClient(config);

        // ------------------------------------------------------------------
        // 1. AUTHENTICATION
        // ------------------------------------------------------------------
        // This will automatically:
        // - Check for existing tokens in .bingads/
        // - If no tokens, prompt you to visit a URL and paste the code
        // - Refresh expired tokens automatically
        console.log("Authenticating...");
        const accessToken = await client.authenticate();
        console.log("Authentication successful!");

        // ------------------------------------------------------------------
        // 2. CAMPAIGN MANAGEMENT
        // ------------------------------------------------------------------
        console.log("\nFetching Campaigns...");

        // Example: Get all Search campaigns
        const campaigns = await client.campaigns.getByAccountId({
            campaignTypes: 'Search'
        });

        const campaignList = campaigns.Campaigns || [];
        console.log(`Found ${campaignList.length} campaigns.`);

        if (campaignList.length > 0) {
            campaignList.forEach(c => {
                console.log(`- [${c.Id}] ${c.Name} (${c.Status})`);
            });
        }

    } catch (error) {
        console.error("\n❌ Error occurred:");
        console.error("Message:", error.message);

        if (error.response) {
            console.error("\nAPI Response Status:", error.response.status);
            console.error("API Response Data:", JSON.stringify(error.response.data, null, 2));
        }

        if (error.stack) {
            console.error("\nStack trace:");
            console.error(error.stack);
        }

        process.exit(1);
    }
}

main();
