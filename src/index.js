const TokenManager = require("./auth/tokenManager");
const CampaignManagement = require("./campaignManagement/campaignManagement");

/**
 * BingAdsClient - Main client for Microsoft Advertising API
 * 
 * @example
 * const BingAdsClient = require('bingads-node-sdk');
 * 
 * const client = new BingAdsClient({
 *   clientId: 'your-client-id',
 *   clientSecret: 'your-client-secret',
 *   redirectUri: 'http://localhost/myapp/',
 *   developerToken: 'your-developer-token',
 *   customerId: 123456,
 *   customerAccountId: 987654
 * });
 * 
 * // Initialize authentication
 * await client.authenticate();
 * 
 * // Use campaign management
 * const campaigns = await client.campaigns.getByAccountId({ campaignTypes: 'Search' });
 */
class BingAdsClient {
    /**
     * Create a new BingAdsClient instance
     * @param {Object} config - Configuration object
     * @param {string} config.clientId - Azure AD application client ID
     * @param {string} config.clientSecret - Azure AD application client secret
     * @param {string} config.redirectUri - OAuth redirect URI
     * @param {string} config.developerToken - Microsoft Advertising developer token
     * @param {number} [config.customerId] - Default customer ID
     * @param {number} [config.customerAccountId] - Default customer account ID
     */
    constructor(config) {
        if (!config) {
            throw new Error("Configuration object is required");
        }

        if (!config.clientId || !config.clientSecret || !config.redirectUri || !config.developerToken) {
            throw new Error("clientId, clientSecret, redirectUri, and developerToken are required");
        }

        // Store configuration in format expected by TokenManager
        this.config = {
            CLIENT_ID: config.clientId,
            CLIENT_SECRET: config.clientSecret,
            REDIRECT_URI: config.redirectUri,
            DEVELOPER_TOKEN: config.developerToken
        };

        // Store optional defaults
        this.defaultCustomerId = config.customerId;
        this.defaultCustomerAccountId = config.customerAccountId;

        // Create campaign management interface
        this.campaigns = {
            /**
             * Get campaigns by account ID
             */
            getByAccountId: async (options = {}) => {
                return await CampaignManagement.getCampaignByAccountId({
                    customerAccountId: options.customerAccountId || this.defaultCustomerAccountId,
                    customerId: options.customerId || this.defaultCustomerId,
                    developerToken: this.config.DEVELOPER_TOKEN,
                    campaignTypes: options.campaignTypes || "Search",
                    config: this.config
                });
            },

            /**
             * Get campaigns by IDs
             */
            getByIds: async (options = {}) => {
                return await CampaignManagement.getCampaignsByIds({
                    customerAccountId: options.customerAccountId || this.defaultCustomerAccountId,
                    customerId: options.customerId || this.defaultCustomerId,
                    developerToken: this.config.DEVELOPER_TOKEN,
                    campaignIds: options.campaignIds,
                    config: this.config
                });
            },

            /**
             * Add new campaigns
             */
            add: async (options = {}) => {
                return await CampaignManagement.addCampaigns({
                    customerAccountId: options.customerAccountId || this.defaultCustomerAccountId,
                    customerId: options.customerId || this.defaultCustomerId,
                    developerToken: this.config.DEVELOPER_TOKEN,
                    campaigns: options.campaigns,
                    config: this.config
                });
            },

            /**
             * Update existing campaigns
             */
            update: async (options = {}) => {
                return await CampaignManagement.updateCampaigns({
                    customerAccountId: options.customerAccountId || this.defaultCustomerAccountId,
                    customerId: options.customerId || this.defaultCustomerId,
                    developerToken: this.config.DEVELOPER_TOKEN,
                    campaigns: options.campaigns,
                    config: this.config
                });
            },

            /**
             * Delete campaigns
             */
            delete: async (options = {}) => {
                return await CampaignManagement.deleteCampaigns({
                    customerAccountId: options.customerAccountId || this.defaultCustomerAccountId,
                    customerId: options.customerId || this.defaultCustomerId,
                    developerToken: this.config.DEVELOPER_TOKEN,
                    campaignIds: options.campaignIds,
                    config: this.config
                });
            },

            /**
             * Get ad groups by campaign ID
             */
            getAdGroups: async (options = {}) => {
                return await CampaignManagement.getAdGroupsByCampaignId({
                    customerAccountId: options.customerAccountId || this.defaultCustomerAccountId,
                    customerId: options.customerId || this.defaultCustomerId,
                    developerToken: this.config.DEVELOPER_TOKEN,
                    campaignId: options.campaignId,
                    config: this.config
                });
            }
        };

        // Expose token management methods
        this.auth = {
            /**
             * Get valid access token (handles refresh automatically)
             */
            getAccessToken: async () => {
                return await TokenManager.getValidAccessToken(this.config);
            },

            /**
             * Start OAuth consent flow
             */
            startConsentFlow: async () => {
                return await TokenManager.getConsentAndAccessCode(this.config);
            },

            /**
             * Refresh access token
             */
            refresh: async () => {
                return await TokenManager.getRefreshToken(this.config);
            }
        };
    }

    /**
     * Initialize authentication (call this first)
     * @returns {Promise<string>} Access token
     */
    async authenticate() {
        return await TokenManager.getValidAccessToken(this.config);
    }
}

module.exports = BingAdsClient;
