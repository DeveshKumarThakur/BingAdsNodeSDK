const axios = require("axios");
const TokenManager = require("../auth/tokenManager");

/**
 * POST wrapper for Bing Ads endpoints
 */
async function bingPost(url, body, headers) {

    // Debug logging removed for production cleanup, or keep if desired
    // console.log("BING POST:", url);

    try {
        const resp = await axios.post(url, body, { headers });
        return resp.data;
    } catch (err) {
        if (err.response) {
            const e = new Error("Bing Ads API request failed");
            e.status = err.response.status;
            e.headers = err.response.headers;
            e.data = err.response.data;
            throw e;
        }
        throw err;
    }
}


/**
 * Campaign Management API Endpoints
 */
class CampaignManagement {

    /**
     * Build request headers
     */
    static async buildHeaders(customerAccountId, customerId, developerToken, config) {
        if (!config) {
            throw new Error("Config object is required for token management");
        }

        const accessToken = await TokenManager.getValidAccessToken(config);

        if (!developerToken) {
            throw new Error(
                "Developer Token missing! Pass developerToken manually."
            );
        }

        return {
            "authorization": `Bearer ${accessToken}`,
            "content-type": "application/json",
            "customeraccountid": String(customerAccountId),
            "customerid": String(customerId),
            "developertoken": developerToken
        };
    }

    /**
    * QueryByAccountId – Get all campaigns for an account
    */
    static async getCampaignByAccountId({
        customerAccountId,
        customerId,
        developerToken,
        campaignTypes = "Search",
        config
    }) {
        const headers = await this.buildHeaders(
            customerAccountId,
            customerId,
            developerToken,
            config
        );

        const body = {
            AccountId: Number(customerAccountId),
            CampaignType: campaignTypes.includes(" ")
                ? campaignTypes.split(" ")
                : campaignTypes
        };

        const url =
            "https://campaign.api.bingads.microsoft.com/CampaignManagement/v13/Campaigns/QueryByAccountId";

        return await bingPost(url, body, headers);
    }

    /**
    * GetCampaignsByIds – Requires correct Advertiser API URL
    */
    static async getCampaignsByIds({
        customerAccountId,
        customerId,
        campaignIds = [],
        developerToken,
        config
    }) {
        const headers = await this.buildHeaders(
            customerAccountId,
            customerId,
            developerToken,
            config
        );

        const body = {
            AccountId: Number(customerAccountId),
            CampaignIds: campaignIds
        };

        const url =
            "https://campaign.api.bingads.microsoft.com/CampaignManagement/v13/Campaigns/QueryByIds";

        return await bingPost(url, body, headers);
    }



    /**
     *  AddCampaigns – REST-compliant JSON format
     */
    static async addCampaigns({
        customerAccountId,
        customerId,
        campaigns = [],
        developerToken,
        config
    }) {
        const headers = await this.buildHeaders(
            customerAccountId,
            customerId,
            developerToken,
            config
        );

        const body = {
            AccountId: Number(customerAccountId),
            Campaigns: campaigns
        };

        const url =
            "https://campaign.api.bingads.microsoft.com/CampaignManagement/v13/Campaigns";

        return await bingPost(url, body, headers);
    }

    /**
     * UpdateCampaigns
     */
    static async updateCampaigns({
        customerAccountId,
        customerId,
        campaigns = [],
        developerToken,
        config
    }) {
        const headers = await this.buildHeaders(
            customerAccountId,
            customerId,
            developerToken,
            config
        );

        const body = {
            AccountId: Number(customerAccountId),
            Campaigns: campaigns
        };

        const url =
            "https://campaign.api.bingads.microsoft.com/CampaignManagement/v13/Campaigns";

        return await bingPost(url, body, headers);
    }

    /**
        * DeleteCampaigns
        */
    static async deleteCampaigns({
        customerAccountId,
        customerId,
        campaignIds = [],
        developerToken,
        config
    }) {
        const headers = await this.buildHeaders(
            customerAccountId,
            customerId,
            developerToken,
            config
        );

        const body = {
            AccountId: Number(customerAccountId),
            CampaignIds: { long: campaignIds }
        };

        const url =
            "https://campaign.api.bingads.microsoft.com/CampaignManagement/v13/Campaigns";

        return await bingPost(url, body, headers);
    }

    /**
        * GetAdGroupsByCampaignId
        */
    static async getAdGroupsByCampaignId({
        customerAccountId,
        customerId,
        campaignId,
        developerToken,
        config
    }) {
        const headers = await this.buildHeaders(
            customerAccountId,
            customerId,
            developerToken,
            config
        );

        const body = {
            CampaignId: Number(campaignId)
        };

        const url =
            "https://campaign.api.bingads.microsoft.com/CampaignManagement/v13/AdGroups/QueryByCampaignId";

        return await bingPost(url, body, headers);
    }
}

module.exports = CampaignManagement;
