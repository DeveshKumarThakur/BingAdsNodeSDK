const CampaignManagement = require("../campaignManagement/campaignManagement");
const TokenManager = require("../auth/tokenManager");

(async () => {
    try {
        console.log("============================================");
        console.log("Bing Ads → Campaign Management JavaScript");
        console.log("============================================\n");

        // Ensure Access Token
        console.log("Ensuring valid access token...");
        await TokenManager.getValidAccessToken();
        console.log("Access Token Ready\n");

        // -------------------------------------------------------------
        //  MODIFY THESE VALUES BEFORE RUNNING
        // -------------------------------------------------------------
        const customerAccountId = 1000001;
        const customerId = 300001;
        const developerToken = "Developertokn";

        // A sample campaignId for demonstration 
        const sampleCampaignId = 500001;

        // A sample campaignIds array (for update, delete, etc.)
        const campaignIdList = [sampleCampaignId];

        // A sample campaign definition for Add & Update
        const sampleCampaigns = [
            {
                Id: null,
                Name: "Test Campaign by Node " + Date.now(),
                Status: "Paused",
                DailyBudget: 20,
                BudgetType: "DailyBudgetStandard",
                TimeZone: "PacificTimeUSCanadaTijuana",
                Languages: ["English"],
                TrackingUrlTemplate: null,
                CampaignType: "Search"
            }
        ];

        // =============================================================
        // QueryByAccountId
        // =============================================================
        console.log("==== 1. QueryByAccountId ====");

        const campaigns = await CampaignManagement.getCampaignByAccountId({
            customerAccountId,
            customerId,
            developerToken,
            campaignTypes: "Search"
        });

        console.log("Response:", JSON.stringify(campaigns, null, 2), "\n");

        // =============================================================
        // GetCampaignsByIds
        // =============================================================
        console.log("==== 2. GetCampaignsByIds ====");

        const campaignDetails = await CampaignManagement.getCampaignsByIds({
            customerAccountId,
            customerId,
            developerToken,
            campaignIds: campaignIdList
        });

        console.log("Response:", JSON.stringify(campaignDetails, null, 2), "\n");

        // =============================================================
        // AddCampaigns
        // =============================================================
        console.log("==== 3. AddCampaigns ====");

        const addCampaignResponse = await CampaignManagement.addCampaigns({
            customerAccountId,
            customerId,
            developerToken,
            campaigns: sampleCampaigns
        });

        console.log("Response:", JSON.stringify(addCampaignResponse, null, 2), "\n");

        // Extract newly created campaign ID
        const newCampaignId =
            addCampaignResponse?.CampaignIds?.long?.[0] ||
            addCampaignResponse?.CampaignIds?.long;

        // =============================================================
        // UpdateCampaigns
        // =============================================================
        if (newCampaignId) {
            console.log("==== 4. UpdateCampaigns ====");

            const updatedCampaigns = [
                {
                    Id: Number(newCampaignId),
                    Name: "Updated Campaign " + Date.now(),
                    Status: "Paused"
                }
            ];

            const updateResponse = await CampaignManagement.updateCampaigns({
                customerAccountId,
                customerId,
                developerToken,
                campaigns: updatedCampaigns
            });

            console.log("Response:", JSON.stringify(updateResponse, null, 2), "\n");
        }

        // =============================================================
        // DeleteCampaigns
        // =============================================================
        if (newCampaignId) {
            console.log("==== 5. DeleteCampaigns ====");

            const deleteResponse = await CampaignManagement.deleteCampaigns({
                customerAccountId,
                customerId,
                developerToken,
                campaignIds: [newCampaignId]
            });

            console.log("Response:", JSON.stringify(deleteResponse, null, 2), "\n");
        }

        // =============================================================
        // GetAdGroupsByCampaignId
        // =============================================================
        console.log("==== 6. GetAdGroupsByCampaignId ====");

        const adGroups = await CampaignManagement.getAdGroupsByCampaignId({
            customerAccountId,
            customerId,
            developerToken,
            campaignId: sampleCampaignId // or newCampaignId if you want
        });

        console.log("Response:", JSON.stringify(adGroups, null, 2), "\n");

        console.log("============================================");
        console.log("              Examples Completed");
        console.log("============================================");

    } catch (error) {
        console.error("\n************** API ERROR **************");

        if (error.status) console.error("STATUS:", error.status);
        if (error.headers) console.error("HEADERS:", error.headers);
        if (error.data)
            console.error("ERROR BODY:", JSON.stringify(error.data, null, 2));

        console.error("MESSAGE:", error.message || error);
        console.error("***************************************\n");
    }
})();
