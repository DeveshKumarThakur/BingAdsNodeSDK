
const TokenManager = require("../auth/tokenManager");

(async () => {
    console.log("Starting OAuth Flow...");
    const code = await TokenManager.getConsentAndAccessCode();
    console.log("Access Code Saved:", code);

    const token = await TokenManager.getAccessToken();
    console.log("Access Token:", token);
})();
