const TokenManager = require("../auth/tokenManager");

// Example configuration
const config = {
    CLIENT_ID: "your-client-id",
    CLIENT_SECRET: "your-client-secret",
    REDIRECT_URI: "http://localhost/myapp/"
};

(async () => {
    console.log("Starting OAuth Flow...");
    const code = await TokenManager.getConsentAndAccessCode(config);
    console.log("Access Code Saved:", code);

    const token = await TokenManager.getAccessToken(config);
    console.log("Access Token:", token);
})();
