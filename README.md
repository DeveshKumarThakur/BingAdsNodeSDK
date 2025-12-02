# Bing Ads Node.js SDK

A lightweight, production-ready Node.js SDK for **Microsoft Advertising (Bing Ads) REST APIs** with OAuth2 authentication and Campaign Management v13 support.

[![npm version](https://badge.fury.io/js/bingads-node-sdk.svg)](https://www.npmjs.com/package/bingads-node-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Features

- ✅ **Easy Setup** - Install via npm and start in minutes
- ✅ **OAuth2 Authentication** - Complete token management with automatic refresh
- ✅ **Campaign Management API v13** - Full CRUD operations for campaigns and ad groups
- ✅ **Token Persistence** - Automatic token storage in your project directory
- ✅ **Clean API** - Simple, intuitive interface with sensible defaults
- ✅ **TypeScript Ready** - Works seamlessly with both CommonJS and ES modules

## 📦 Installation

```bash
npm install bingads-node-sdk
```

## 🔑 Prerequisites

Before using this SDK, you'll need:

1. **Microsoft Advertising Account** - [Sign up here](https://ads.microsoft.com/)
2. **Developer Token** - [Get one here](https://developers.ads.microsoft.com/Account)
3. **Azure AD Application** - [Register here](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade)
   - You'll need the **Client ID** and **Client Secret**
   - Configure a **Redirect URI** (e.g., `http://localhost/myapp/`)

### Quick Setup Guide for Azure AD App

1. Go to [Azure Portal - App Registrations](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade)
2. Click **"New registration"**
3. Set name and redirect URI (`http://localhost/myapp/`)
4. After creation, copy the **Application (client) ID**
5. Go to **Certificates & secrets** → Create new client secret → Copy the **Value**

## 🎯 Quick Start

```javascript
const BingAdsClient = require('bingads-node-sdk');

// Initialize the client
const client = new BingAdsClient({
    clientId: 'your-azure-client-id',
    clientSecret: 'your-azure-client-secret',
    redirectUri: 'http://localhost/myapp/',
    developerToken: 'your-developer-token',
    customerId: 123456789,              // Optional: set default customer ID
    customerAccountId: 987654321        // Optional: set default account ID
});

(async () => {
    // Authenticate (handles OAuth flow automatically)
    await client.authenticate();

    // Get all campaigns
    const campaigns = await client.campaigns.getByAccountId({
        campaignTypes: 'Search'
    });

    console.log('Campaigns:', campaigns);
})();
```

### First Time Authentication

When you run your code for the first time, the SDK will:

1. Generate an OAuth authorization URL
2. Open it in your default browser (or display it in the console)
3. Ask you to sign in with your Microsoft Advertising account
4. Prompt you to paste the authorization code
5. Exchange it for access and refresh tokens
6. Save tokens to `.bingads/` folder in your project

**Subsequent runs will use the saved tokens automatically.**

## 📚 API Reference

### Constructor

```javascript
const client = new BingAdsClient(config);
```

**Config Options:**
- `clientId` (required) - Azure AD application client ID
- `clientSecret` (required) - Azure AD application client secret  
- `redirectUri` (required) - OAuth redirect URI
- `developerToken` (required) - Microsoft Advertising developer token
- `customerId` (optional) - Default customer ID for all requests
- `customerAccountId` (optional) - Default account ID for all requests

### Authentication

#### `client.authenticate()`
Initialize authentication. Call this before making any API requests.

```javascript
await client.authenticate();
```

#### `client.auth.getAccessToken()`
Get current access token (handles refresh automatically).

```javascript
const token = await client.auth.getAccessToken();
```

#### `client.auth.refresh()`
Manually refresh the access token.

```javascript
const newToken = await client.auth.refresh();
```

### Campaign Management

All campaign methods support optional parameters that override defaults:
- `customerId` - Customer ID for this request
- `customerAccountId` - Account ID for this request

#### `client.campaigns.getByAccountId(options)`
Get all campaigns for an account.

```javascript
const campaigns = await client.campaigns.getByAccountId({
    campaignTypes: 'Search',           // Optional: 'Search', 'Shopping', 'DynamicSearchAds', etc.
    customerAccountId: 987654321,      // Optional: override default
    customerId: 123456789              // Optional: override default
});
```

#### `client.campaigns.getByIds(options)`
Get specific campaigns by their IDs.

```javascript
const campaigns = await client.campaigns.getByIds({
    campaignIds: [123, 456, 789]
});
```

#### `client.campaigns.add(options)`
Create new campaigns.

```javascript
const response = await client.campaigns.add({
    campaigns: [
        {
            Name: 'My Campaign',
            Status: 'Paused',
            DailyBudget: 50,
            BudgetType: 'DailyBudgetStandard',
            TimeZone: 'PacificTimeUSCanadaTijuana',
            Languages: ['English'],
            CampaignType: 'Search'
        }
    ]
});

const newCampaignId = response.CampaignIds.long[0];
```

#### `client.campaigns.update(options)`
Update existing campaigns.

```javascript
await client.campaigns.update({
    campaigns: [
        {
            Id: 123456,
            Name: 'Updated Campaign Name',
            Status: 'Active',
            DailyBudget: 100
        }
    ]
});
```

#### `client.campaigns.delete(options)`
Delete campaigns.

```javascript
await client.campaigns.delete({
    campaignIds: [123, 456, 789]
});
```

#### `client.campaigns.getAdGroups(options)`
Get ad groups for a specific campaign.

```javascript
const adGroups = await client.campaigns.getAdGroups({
    campaignId: 123456
});
```

## 💡 Usage Examples

### Creating and Managing a Campaign

```javascript
const BingAdsClient = require('bingads-node-sdk');

const client = new BingAdsClient({
    clientId: process.env.BING_CLIENT_ID,
    clientSecret: process.env.BING_CLIENT_SECRET,
    redirectUri: process.env.BING_REDIRECT_URI,
    developerToken: process.env.BING_DEVELOPER_TOKEN,
    customerId: parseInt(process.env.BING_CUSTOMER_ID),
    customerAccountId: parseInt(process.env.BING_ACCOUNT_ID)
});

(async () => {
    // Authenticate
    await client.authenticate();

    // Create a new campaign
    const newCampaign = await client.campaigns.add({
        campaigns: [{
            Name: 'Holiday Sale 2024',
            Status: 'Paused',
            DailyBudget: 100,
            BudgetType: 'DailyBudgetStandard',
            TimeZone: 'PacificTimeUSCanadaTijuana',
            Languages: ['English'],
            CampaignType: 'Search'
        }]
    });

    const campaignId = newCampaign.CampaignIds.long[0];
    console.log('Created campaign:', campaignId);

    // Update the campaign
    await client.campaigns.update({
        campaigns: [{
            Id: campaignId,
            Status: 'Active',
            DailyBudget: 150
        }]
    });

    console.log('Campaign activated with new budget');

    // Get campaign details
    const details = await client.campaigns.getByIds({
        campaignIds: [campaignId]
    });

    console.log('Campaign details:', details);
})();
```

### Working with Multiple Accounts

```javascript
// Initialize with one account
const client = new BingAdsClient({
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
    redirectUri: 'http://localhost/myapp/',
    developerToken: 'your-developer-token',
    // No default customer/account set
});

await client.authenticate();

// Work with Account A
const campaignsA = await client.campaigns.getByAccountId({
    customerId: 111111,
    customerAccountId: 222222,
    campaignTypes: 'Search'
});

// Work with Account B
const campaignsB = await client.campaigns.getByAccountId({
    customerId: 333333,
    customerAccountId: 444444,
    campaignTypes: 'Search'
});
```

### Using Environment Variables

Create a `.env` file:

```env
BING_CLIENT_ID=your-azure-client-id
BING_CLIENT_SECRET=your-azure-client-secret
BING_REDIRECT_URI=http://localhost/myapp/
BING_DEVELOPER_TOKEN=your-developer-token
BING_CUSTOMER_ID=123456789
BING_ACCOUNT_ID=987654321
```

Then in your code:

```javascript
require('dotenv').config();
const BingAdsClient = require('bingads-node-sdk');

const client = new BingAdsClient({
    clientId: process.env.BING_CLIENT_ID,
    clientSecret: process.env.BING_CLIENT_SECRET,
    redirectUri: process.env.BING_REDIRECT_URI,
    developerToken: process.env.BING_DEVELOPER_TOKEN,
    customerId: parseInt(process.env.BING_CUSTOMER_ID),
    customerAccountId: parseInt(process.env.BING_ACCOUNT_ID)
});
```

## 🔐 Token Storage

The SDK automatically manages OAuth tokens for you:

- Tokens are saved in a `.bingads/` folder in your project root
- The folder contains:
  - `access_code.txt` - Authorization code from Microsoft
  - `accessToken.txt` - Current access token  
  - `refreshToken.txt` - Refresh token for renewal

**Important:** Add `.bingads/` to your `.gitignore` to avoid committing credentials:

```gitignore
# Bing Ads tokens
.bingads/
```

## 🛠️ Error Handling

```javascript
try {
    await client.authenticate();
    const campaigns = await client.campaigns.getByAccountId({
        campaignTypes: 'Search'
    });
} catch (error) {
    if (error.response) {
        // API error
        console.error('API Error:', error.response.status);
        console.error('Details:', error.response.data);
    } else if (error.request) {
        // Network error
        console.error('Network Error:', error.message);
    } else {
        // Other error
        console.error('Error:', error.message);
    }
}
```

## 📝 Campaign Object Reference

### Campaign Properties

```javascript
{
    Id: number,                    // Campaign ID (required for update/delete)
    Name: string,                  // Campaign name
    Status: string,                // 'Active', 'Paused', 'Deleted', 'Suspended'
    DailyBudget: number,          // Daily budget amount
    BudgetType: string,           // 'DailyBudgetStandard' or 'DailyBudgetAccelerated'
    TimeZone: string,             // e.g., 'PacificTimeUSCanadaTijuana'
    Languages: [string],          // e.g., ['English', 'Spanish']
    CampaignType: string,         // 'Search', 'Shopping', 'DynamicSearchAds', etc.
    TrackingUrlTemplate: string   // Optional tracking template
}
```

## 🔧 Development

### Clone and Setup

```bash
git clone https://github.com/DeveshKumarThakur/BingAdsNodeSDK.git
cd BingAdsNodeSDK
npm install
```

### Run Examples

The `src/examples/` directory contains working examples:

```bash
# Token management example
node src/examples/tokenManagerExample.js

# Campaign management example
node src/examples/campaignManagementExample.js
```

## 🧪 Testing

```bash
npm test
```

## 📋 Requirements

- **Node.js** >= 14.0.0
- Microsoft Advertising account with API access
- Azure AD application credentials

## 🛠️ Troubleshooting

### "Config object is required"
Make sure you're passing a config object to the BingAdsClient constructor.

### "ACCESS CODE not found"
Run your script - it will automatically start the OAuth flow the first time.

### "REFRESH TOKEN missing"
Your refresh token expired. Delete the `.bingads/` folder and re-authenticate:
```bash
rm -rf .bingads
node your-script.js
```

### HTTP 401 Unauthorized
- Verify your `developerToken` is correct
- Check that `customerId` and `customerAccountId` are correct
- Token may have expired - the SDK will automatically refresh it

### HTTP 403 Forbidden  
- Ensure you have permissions to access the customer account
- Verify your developer token is approved (not in sandbox mode)

## 📦 Publishing to NPM

To publish this package to npm:

```bash
# Login to npm
npm login

# Publish the package
npm publish
```

The `.npmignore` file ensures that only necessary files are published.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🔗 Resources

- [Microsoft Advertising API Documentation](https://docs.microsoft.com/en-us/advertising/guides/)
- [Campaign Management API Reference](https://docs.microsoft.com/en-us/advertising/campaign-management-service/)
- [OAuth 2.0 Authentication Guide](https://docs.microsoft.com/en-us/advertising/guides/authentication-oauth)
- [Developer Portal](https://developers.ads.microsoft.com/)

## 💬 Support

- **Issues:** [GitHub Issues](https://github.com/DeveshKumarThakur/BingAdsNodeSDK/issues)
- **Discussions:** [Microsoft Advertising API Forums](https://social.msdn.microsoft.com/Forums/en-US/home?forum=BingAds)

## 🙏 Acknowledgments

Built with ❤️ for the Microsoft Advertising developer community.

---

**Made by [Devesh Kumar Thakur](https://github.com/DeveshKumarThakur)**
