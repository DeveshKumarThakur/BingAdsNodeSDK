# Bing Ads Node SDK  
*A clean, modern Node.js SDK for Microsoft Advertising (Bing Ads) REST APIs.*

Developed and maintained by **[Devesh Kumar Thakur](https://github.com/DeveshKumarThakur)**  
⭐ If this project helps you, please star the repo and follow me for more developer tools.

---

## 🚀 Overview

`bingads-node-sdk` is a lightweight and easy-to-use Node.js SDK that simplifies working with the Microsoft Advertising (Bing Ads) REST APIs.

This SDK currently supports:

- OAuth2 Authentication  
  - Access Token  
  - Refresh Token  
  - Consent URL  
- Campaign Management API (v13)
  - QueryByAccountId  
  - GetCampaignsByIds  
  - AddCampaigns  
  - UpdateCampaigns  
  - DeleteCampaigns  
  - GetAdGroupsByCampaignId  

More API groups will be added soon:
- Customer Management  
- Billing  
- Reporting  
- Ad Insights  

---

## 📦 Installation

```
npm install bingads-node-sdk
```

---

## 🧩 SDK Usage

### Import

```js
const { CampaignManagement, TokenManager } = require("bingads-node-sdk");
```

---

## 🔐 Authentication Flow (OAuth2)

### 1. Generate consent URL

```js
const url = await TokenManager.getConsentUrl();
console.log("Open this URL in a browser:", url);
```

### 2. Paste your access code into `access_code.txt`

### 3. Generate access & refresh tokens

```js
await TokenManager.getAccessToken();
```

---

## 📊 Campaign Management Example

```js
const response = await CampaignManagement.getCampaignByAccountId({
  customerAccountId: 123456,
  customerId: 7891011,
  developerToken: "YOUR_DEVELOPER_TOKEN",
  campaignTypes: "Search"
});

console.log(response);
```

---

## 📁 Project Structure

```
bingads-node-sdk/
│
├── src/
│   ├── auth/
│   ├── campaignManagement/
│   └── examples/
│
├── package.json
├── README.md
└── LICENSE
```

---

## 🤝 Contributing

Pull requests are welcome.  
Submit issues here: https://github.com/DeveshKumarThakur/BingAdsNodeSDK/issues

---

## ⭐ Support the Project

Star the repository  
Follow me on GitHub: https://github.com/DeveshKumarThakur

---

## 📄 License

MIT License
