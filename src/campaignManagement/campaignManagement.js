const axios = require("axios");
const fs = require("fs");
const path = require("path");
const TokenManager = require("../auth/tokenManager");
const config = require("../../config");

const ACCESS_TOKEN_FILE = path.join(__dirname, "../auth/accessToken.txt");

/**
 * Read file safely
 */
function readFileSafe(filePath) {
    try {
        if (!fs.existsSync(filePath)) return null;
        const content = fs.readFileSync(filePath, "utf8").trim();
        return content.length ? content : null;
    } catch {
        return null;
    }
}
/**
 * Ensure access token is available
 */
async function ensureAccessToken() {
    let token = readFileSafe(ACCESS_TOKEN_FILE);
    if (token) return token;

    token = await TokenManager.getValidAccessToken();

    const saved = readFileSafe(ACCESS_TOKEN_FILE);
    return saved || token;
}

/**
 * POST wrapper for Bing Ads endpoints
 */
async function bingPost(url, body, headers) {

    console.log("\n==============================");
    console.log("BING POST DEBUG INFO");
    console.log("==============================");

    console.log("URL:");
    console.log(url);

    console.log("\nHEADERS:");
    console.log(headers);

    console.log("\nBODY:");
    console.log(JSON.stringify(body, null, 2));
    console.log("==============================\n");

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
    static async buildHeaders(customerAccountId, customerId, developerToken) {
        const accessToken = await ensureAccessToken();

        const finalDevToken =
            developerToken || config.DEVELOPER_TOKEN;

        if (!finalDevToken) {
            throw new Error(
                "Developer Token missing! Set DEVELOPER_TOKEN in config.js or pass developerToken manually."
            );
        }

        return {
            "authorization": `Bearer ${accessToken}`,
            "content-type": "application/json",
            "customeraccountid": String(customerAccountId),
            "customerid": String(customerId),
            "developertoken": finalDevToken
        };
    }

    /**
    * QueryByAccountId – Get all campaigns for an account
    */
    static async getCampaignByAccountId({
        customerAccountId,
        customerId,
        developerToken,
        campaignTypes = "Search"
    }) {
        const headers = await this.buildHeaders(
            customerAccountId,
            customerId,
            developerToken
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
        developerToken
    }) {
        const headers = await this.buildHeaders(
            customerAccountId,
            customerId,
            developerToken
        );

        const body = {
            AccountId: Number(customerAccountId),
            CampaignIds: campaignIds   // FIXED FORMAT
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
        developerToken
    }) {
        const headers = await this.buildHeaders(
            customerAccountId,
            customerId,
            developerToken
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
        developerToken
    }) {
        const headers = await this.buildHeaders(
            customerAccountId,
            customerId,
            developerToken
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
        developerToken
    }) {
        const headers = await this.buildHeaders(
            customerAccountId,
            customerId,
            developerToken
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
        developerToken
    }) {
        const headers = await this.buildHeaders(
            customerAccountId,
            customerId,
            developerToken
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
