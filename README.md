# Bing Ads Node.js SDK

A lightweight Node.js SDK for **Microsoft Advertising (Bing Ads) REST APIs** with OAuth2 authentication and Campaign Management v13 support.

## 🚀 Features

- ✅ **OAuth2 Authentication** - Complete token management with automatic refresh
- ✅ **Campaign Management API v13** - Full CRUD operations for campaigns and ad groups
- ✅ **REST API Support** - Direct access to Microsoft Advertising endpoints
- ✅ **Token Persistence** - Automatic token storage and refresh handling
- ✅ **Easy Setup** - Simple configuration with environment variables
- ✅ **TypeScript Ready** - Works seamlessly with both CommonJS and ES modules

## 📋 Prerequisites

- **Node.js** v14 or higher
- **Microsoft Advertising Account** ([Sign up here](https://ads.microsoft.com/))
- **Developer Token** ([Get one here](https://developers.ads.microsoft.com/Account))
- **Registered Application** with Microsoft Azure ([Register here](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade))

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/DeveshKumarThakur/BingAdsNodeSDK.git
cd BingAdsNodeSDK
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Your Application

#### Option A: Using `config.js` (Recommended for local development)

Edit the `config.js` file in the root directory:

```javascript
module.exports = {
    CLIENT_ID: "your-azure-app-client-id",
    CLIENT_SECRET: "your-azure-app-client-secret",
    REDIRECT_URI: "http://localhost/myapp/",
    DEVELOPER_TOKEN: "your-microsoft-ads-developer-token"
};
```

#### Option B: Using Environment Variables (Recommended for production)

Create a `.env` file in the root directory:

```env
CLIENT_ID=your-azure-app-client-id
CLIENT_SECRET=your-azure-app-client-secret
REDIRECT_URI=http://localhost/myapp/
DEVELOPER_TOKEN=your-microsoft-ads-developer-token
```

## 🔑 Getting Your Credentials

### 1. Register an Application in Azure AD

1. Go to [Azure Portal - App Registrations](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade)
2. Click **"New registration"**
3. Fill in the details:
   - **Name**: Your app name (e.g., "Bing Ads Node SDK")
   - **Supported account types**: Select appropriate option
   - **Redirect URI**: Set to `http://localhost/myapp/` (or your custom URI)
4. Click **"Register"**

### 2. Get Client ID and Client Secret

- **Client ID**: Found on the app's **Overview** page (Application (client) ID)
- **Client Secret**: 
  1. Go to **Certificates & secrets** → **Client secrets**
  2. Click **"New client secret"**
  3. Copy the **Value** (not the Secret ID)

### 3. Get Developer Token

1. Go to [Microsoft Advertising Developer Account](https://developers.ads.microsoft.com/Account)
2. Sign in with your Microsoft Advertising credentials
3. Navigate to **"Account Details"**
4. Copy your **Developer Token**

### 4. Configure Redirect URI

In your Azure app registration:
1. Go to **Authentication**
2. Add platform → **Web**
3. Set redirect URI to `http://localhost/myapp/` (must match your config)

## 🔐 Authentication Setup

### First Time Authentication

Run the authentication flow to get your access token:

```bash
node src/examples/tokenManagerExample.js
```

This will:
1. Generate an OAuth authorization URL
2. Prompt you to open it in your browser
3. Ask you to sign in with your Microsoft Advertising account
4. Redirect you to the redirect URI with an authorization code
5. Ask you to paste the code back into the terminal
6. Exchange the code for access and refresh tokens
7. Save tokens to `src/auth/` directory

**Example Output:**
```
=== MICROSOFT AUTHORIZATION URL ===
https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=...

Open this URL in your browser and sign in.

Paste ACCESS CODE here: <paste-code-here>
```

### Token Files

After successful authentication, the following files are created:
- `src/auth/access_code.txt` - Authorization code from Microsoft
- `src/auth/accessToken.txt` - Current access token
- `src/auth/refreshToken.txt` - Refresh token for automatic renewal

**⚠️ Security Note**: These files contain sensitive credentials. They are already included in `.gitignore` and should never be committed to version control.

## 🎯 Usage Examples

### Campaign Management

```javascript
const CampaignManagement = require("./src/campaignManagement/campaignManagement");
const TokenManager = require("./src/auth/tokenManager");

(async () => {
    // Ensure valid access token
    await TokenManager.getValidAccessToken();

    // Your Microsoft Advertising credentials
    const customerAccountId = 123456789;
    const customerId = 987654321;
    const developerToken = "YOUR_DEVELOPER_TOKEN";

    // Get all campaigns
    const campaigns = await CampaignManagement.getCampaignByAccountId({
        customerAccountId,
        customerId,
        developerToken,
        campaignTypes: "Search"
    });

    console.log("Campaigns:", campaigns);
})();
```

### Create a Campaign

```javascript
const newCampaign = await CampaignManagement.addCampaigns({
    customerAccountId: 123456789,
    customerId: 987654321,
    developerToken: "YOUR_DEVELOPER_TOKEN",
    campaigns: [
        {
            Name: "My New Campaign",
            Status: "Paused",
            DailyBudget: 50,
            BudgetType: "DailyBudgetStandard",
            TimeZone: "PacificTimeUSCanadaTijuana",
            Languages: ["English"],
            CampaignType: "Search"
        }
    ]
});

console.log("New Campaign ID:", newCampaign.CampaignIds.long[0]);
```

### Update a Campaign

```javascript
const updateResponse = await CampaignManagement.updateCampaigns({
    customerAccountId: 123456789,
    customerId: 987654321,
    developerToken: "YOUR_DEVELOPER_TOKEN",
    campaigns: [
        {
            Id: 456789123,
            Name: "Updated Campaign Name",
            Status: "Active"
        }
    ]
});

console.log("Update Response:", updateResponse);
```

### Get Ad Groups

```javascript
const adGroups = await CampaignManagement.getAdGroupsByCampaignId({
    customerAccountId: 123456789,
    customerId: 987654321,
    developerToken: "YOUR_DEVELOPER_TOKEN",
    campaignId: 456789123
});

console.log("Ad Groups:", adGroups);
```

## 🧪 Running Examples

### Full Campaign Management Example

```bash
node src/examples/campaignManagementExample.js
```

This example demonstrates:
- ✅ Getting campaigns by account ID
- ✅ Getting campaigns by IDs
- ✅ Creating new campaigns
- ✅ Updating campaigns
- ✅ Deleting campaigns
- ✅ Getting ad groups by campaign ID

**Before running**, update the credentials in `src/examples/campaignManagementExample.js`:

```javascript
const customerAccountId = 1000001;  // Your account ID
const customerId = 300001;          // Your customer ID
const developerToken = "YOUR_TOKEN"; // Your developer token
```

## 📚 API Reference

### TokenManager

#### `getConsentAndAccessCode()`
Generates OAuth URL and prompts for authorization code.

#### `getAccessToken()`
Exchanges authorization code for access and refresh tokens.

#### `getRefreshToken()`
Uses refresh token to get a new access token.

#### `getValidAccessToken()`
Returns a valid access token (handles refresh automatically).

### CampaignManagement

#### `getCampaignByAccountId(options)`
Query campaigns by account ID.
- **Parameters**: `{ customerAccountId, customerId, developerToken, campaignTypes }`
- **Returns**: Array of campaigns

#### `getCampaignsByIds(options)`
Get specific campaigns by their IDs.
- **Parameters**: `{ customerAccountId, customerId, developerToken, campaignIds }`
- **Returns**: Campaign details

#### `addCampaigns(options)`
Create new campaigns.
- **Parameters**: `{ customerAccountId, customerId, developerToken, campaigns }`
- **Returns**: Campaign IDs

#### `updateCampaigns(options)`
Update existing campaigns.
- **Parameters**: `{ customerAccountId, customerId, developerToken, campaigns }`
- **Returns**: Update response

#### `deleteCampaigns(options)`
Delete campaigns.
- **Parameters**: `{ customerAccountId, customerId, developerToken, campaignIds }`
- **Returns**: Delete response

#### `getAdGroupsByCampaignId(options)`
Get ad groups for a specific campaign.
- **Parameters**: `{ customerAccountId, customerId, developerToken, campaignId }`
- **Returns**: Array of ad groups

## 🔧 Project Structure

```
BingAdsNodeSDK/
├── src/
│   ├── auth/
│   │   ├── tokenManager.js          # OAuth2 token management
│   │   ├── access_code.txt          # Stored authorization code
│   │   ├── accessToken.txt          # Current access token
│   │   └── refreshToken.txt         # Refresh token
│   ├── campaignManagement/
│   │   └── campaignManagement.js    # Campaign Management API wrapper
│   ├── utils/
│   │   └── httpClient.js            # HTTP client utilities
│   ├── examples/
│   │   ├── tokenManagerExample.js   # Authentication example
│   │   └── campaignManagementExample.js  # Campaign management example
│   └── index.js                     # Main export file
├── config.js                        # Configuration file
├── package.json                     # Dependencies and scripts
├── .gitignore                       # Git ignore rules
└── README.md                        # This file
```

## 🛠️ Troubleshooting

### "ACCESS CODE not found"
Run `node src/examples/tokenManagerExample.js` to complete the OAuth flow.

### "REFRESH TOKEN missing"
Your refresh token has expired. Delete token files and re-authenticate:
```bash
rm src/auth/*.txt
node src/examples/tokenManagerExample.js
```

### "remote: Write access to repository not granted"
Your access token expired. The SDK will automatically refresh it when you call `getValidAccessToken()`.

### HTTP 401 Unauthorized
- Verify your `developerToken` is correct
- Ensure your access token is valid
- Check that `customerAccountId` and `customerId` are correct

### HTTP 403 Forbidden
- Verify you have permissions to access the customer account
- Ensure your developer token is approved (not in sandbox)

## 📝 Notes

- Access tokens expire after **1 hour**
- Refresh tokens are valid for **90 days**
- Always use `getValidAccessToken()` before making API calls
- Token files are automatically managed by the SDK
- The SDK supports both sandbox and production environments

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Resources

- [Microsoft Advertising API Documentation](https://docs.microsoft.com/en-us/advertising/guides/)
- [Campaign Management API Reference](https://docs.microsoft.com/en-us/advertising/campaign-management-service/)
- [OAuth 2.0 Authentication](https://docs.microsoft.com/en-us/advertising/guides/authentication-oauth)
- [Developer Portal](https://developers.ads.microsoft.com/)

## 💬 Support

For issues and questions:
- Open an issue on [GitHub Issues](https://github.com/DeveshKumarThakur/BingAdsNodeSDK/issues)
- Check [Microsoft Advertising API Forums](https://social.msdn.microsoft.com/Forums/en-US/home?forum=BingAds)

---

**Made with ❤️ by [Devesh Kumar Thakur](https://github.com/DeveshKumarThakur)**
