const BingAdsClient = require("../index");

// Example configuration using the new BingAdsClient
const config = {
    clientId: "your-client-id",
    clientSecret: "your-client-secret",
    redirectUri: "http://localhost/myapp/",
    developerToken: "your-developer-token",
    customerId: 300001,
    customerAccountId: 1000001
};

(async () => {
    try {
        console.log("============================================");
        console.log("Bing Ads Node SDK - Package Usage Example");
        console.log("============================================\n");

        // Initialize the client
        const client = new BingAdsClient(config);

        // Authenticate (this will handle OAuth flow if needed)
        console.log("Authenticating...");
        await client.authenticate();
        console.log("Authentication successful!\n");

        // Get all campaigns
        console.log("==== 1. Get Campaigns by Account ID ====");
        const campaigns = await client.campaigns.getByAccountId({
            campaignTypes: "Search"
        });
        console.log("Response:", JSON.stringify(campaigns, null, 2), "\n");

        // Example: Add a new campaign
        console.log("==== 2. Add New Campaign ====");
        const newCampaign = await client.campaigns.add({
            campaigns: [
                {
                    Name: "Test Campaign from SDK " + Date.now(),
                    Status: "Paused",
                    DailyBudget: 20,
                    BudgetType: "DailyBudgetStandard",
                    TimeZone: "PacificTimeUSCanadaTijuana",
                    Languages: ["English"],
                    CampaignType: "Search"
                }
            ]
        });
        console.log("Response:", JSON.stringify(newCampaign, null, 2), "\n");

        const newCampaignId = newCampaign?.CampaignIds?.long?.[0];

        // Example: Update campaign
        if (newCampaignId) {
            console.log("==== 3. Update Campaign ====");
            const updateResponse = await client.campaigns.update({
                campaigns: [
                    {
                        Id: Number(newCampaignId),
                        Name: "Updated Campaign " + Date.now(),
                        Status: "Active"
                    }
                ]
            });
            console.log("Response:", JSON.stringify(updateResponse, null, 2), "\n");
        }

        // Example: Get ad groups
        if (newCampaignId) {
            console.log("==== 4. Get Ad Groups ====");
            const adGroups = await client.campaigns.getAdGroups({
                campaignId: newCampaignId
            });
            console.log("Response:", JSON.stringify(adGroups, null, 2), "\n");
        }

        // Example: Delete campaign
        if (newCampaignId) {
            console.log("==== 5. Delete Campaign ====");
            const deleteResponse = await client.campaigns.delete({
                campaignIds: [newCampaignId]
            });
            console.log("Response:", JSON.stringify(deleteResponse, null, 2), "\n");
        }

        console.log("============================================");
        console.log("          All Examples Completed");
        console.log("============================================");

    } catch (error) {
        console.error("\n************** ERROR **************");
        console.error("MESSAGE:", error.message || error);
        if (error.response) {
            console.error("STATUS:", error.response.status);
            console.error("DATA:", JSON.stringify(error.response.data, null, 2));
        }
        console.error("***********************************\n");
    }
})();
