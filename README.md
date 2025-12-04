# Bing Ads Node SDK

A lightweight Node.js SDK for Microsoft Advertising (Bing Ads) API with OAuth2 authentication and Campaign Management.

## Installation

```bash
npm install bingads-node-sdk
```

## Usage

```javascript
const BingAdsClient = require('bingads-node-sdk');

const client = new BingAdsClient({
    clientId: 'YOUR_CLIENT_ID',
    clientSecret: 'YOUR_CLIENT_SECRET',
    redirectUri: 'http://localhost:3000/callback',
    developerToken: 'YOUR_DEVELOPER_TOKEN',
    customerId: 123456789,
    customerAccountId: 987654321
});

async function getCampaigns() {
    // Authenticate (first time: OAuth flow, subsequent: uses cached token)
    await client.authenticate();
    
    // Get campaigns
    const result = await client.campaigns.getByAccountId({
        campaignTypes: 'Search'
    });
    
    console.log(result.Campaigns);
}

getCampaigns();
```

## First Run Authentication

On first run, the SDK will:
1. Print an authorization URL
2. Ask you to open it in your browser and sign in
3. Prompt you to paste the authorization code from the redirect URL
4. Save tokens in `.bingads/` folder for future use

## Available Methods

```javascript
// Get campaigns
await client.campaigns.getByAccountId({ campaignTypes: 'Search' });
await client.campaigns.getByIds({ campaignIds: [123, 456] });

// Manage campaigns
await client.campaigns.add({ campaigns: [...] });
await client.campaigns.update({ campaigns: [...] });
await client.campaigns.delete({ campaignIds: [123, 456] });

// Get ad groups
await client.campaigns.getAdGroups({ campaignId: 123 });
```

## Testing Locally

```bash
git clone https://github.com/DeveshKumarThakur/BingAdsNodeSDK.git
cd BingAdsNodeSDK
npm install
node src/examples/demo.js  # Edit demo.js with your credentials first
```

## License

MIT
