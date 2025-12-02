const axios = require("axios");
const qs = require("qs");
const fs = require("fs");
const path = require("path");

// -------------------- Configuration --------------------
// Tokens will be saved in user's project directory under .bingads folder
const TOKENS_DIR = path.join(process.cwd(), ".bingads");
const ACCESS_CODE_FILE = path.join(TOKENS_DIR, "access_code.txt");
const ACCESS_TOKEN_FILE = path.join(TOKENS_DIR, "accessToken.txt");
const REFRESH_TOKEN_FILE = path.join(TOKENS_DIR, "refreshToken.txt");

// Ensure .bingads directory exists
if (!fs.existsSync(TOKENS_DIR)) {
    fs.mkdirSync(TOKENS_DIR, { recursive: true });
}

// -------------------- Utility Functions --------------------

// Safely read text file
function readFile(filePath) {
    try {
        if (!fs.existsSync(filePath)) return null;
        const content = fs.readFileSync(filePath, "utf8").trim();
        return content.length ? content : null;
    } catch {
        return null;
    }
}

// Safely write text file
function writeFile(filePath, content) {
    fs.writeFileSync(filePath, content.trim(), "utf8");
}

class TokenManager {

    // ----------------------------------------------------------
    // STEP 1: Generate OAuth Consent URL & Save Access Code
    // ----------------------------------------------------------
    static async getConsentAndAccessCode(config) {
        if (!config || !config.CLIENT_ID || !config.REDIRECT_URI) {
            throw new Error("Config with CLIENT_ID and REDIRECT_URI is required");
        }

        const scope = encodeURIComponent(
            "openid offline_access https://ads.microsoft.com/msads.manage"
        );

        const url =
            `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${config.CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(config.REDIRECT_URI)}&response_mode=query&scope=${scope}&state=12345`;

        console.log("\n=== MICROSOFT AUTHORIZATION URL ===");
        console.log(url);
        console.log("\nOpen this URL in your browser and sign in.");
        console.log("After signing in, Microsoft will redirect you to your redirect URI with ?code=xxxx\n");

        const readline = require("readline").createInterface({
            input: process.stdin,
            output: process.stdout
        });

        return new Promise(resolve => {
            readline.question("Paste ACCESS CODE here: ", (code) => {
                writeFile(ACCESS_CODE_FILE, code);
                console.log("Access code saved → .bingads/access_code.txt\n");
                readline.close();
                resolve(code);
            });
        });
    }

    // ----------------------------------------------------------
    // STEP 2: Exchange ACCESS CODE → ACCESS TOKEN + REFRESH TOKEN
    // ----------------------------------------------------------
    static async getAccessToken(config) {
        if (!config || !config.CLIENT_ID || !config.CLIENT_SECRET || !config.REDIRECT_URI) {
            throw new Error("Config with CLIENT_ID, CLIENT_SECRET, and REDIRECT_URI is required");
        }

        const accessCode = readFile(ACCESS_CODE_FILE);
        if (!accessCode) {
            throw new Error("ACCESS CODE not found. Run getConsentAndAccessCode() first.");
        }

        const data = {
            client_id: config.CLIENT_ID,
            scope: "https://ads.microsoft.com/msads.manage",
            code: accessCode,
            redirect_uri: config.REDIRECT_URI,
            grant_type: "authorization_code",
            client_secret: config.CLIENT_SECRET
        };

        const res = await axios.post(
            "https://login.microsoftonline.com/common/oauth2/v2.0/token",
            qs.stringify(data),
            { headers: { "content-type": "application/x-www-form-urlencoded" } }
        );

        const json = res.data;

        if (!json.access_token) {
            throw new Error("API did NOT return access_token. Full response: " + JSON.stringify(json));
        }

        // Save tokens
        writeFile(ACCESS_TOKEN_FILE, json.access_token);
        writeFile(REFRESH_TOKEN_FILE, json.refresh_token);

        console.log("Access Token saved → .bingads/accessToken.txt");
        console.log("Refresh Token saved → .bingads/refreshToken.txt\n");

        return json.access_token;
    }

    // ----------------------------------------------------------
    // STEP 3: Use refresh_token → Get NEW access_token
    // ----------------------------------------------------------
    static async getRefreshToken(config) {
        if (!config || !config.CLIENT_ID || !config.CLIENT_SECRET) {
            throw new Error("Config with CLIENT_ID and CLIENT_SECRET is required");
        }

        const refreshToken = readFile(REFRESH_TOKEN_FILE);
        if (!refreshToken) {
            throw new Error("REFRESH TOKEN missing! Generate a new ACCESS CODE first.");
        }

        const data = {
            client_id: config.CLIENT_ID,
            scope: "https://ads.microsoft.com/msads.manage",
            refresh_token: refreshToken,
            grant_type: "refresh_token",
            client_secret: config.CLIENT_SECRET
        };

        const res = await axios.post(
            "https://login.microsoftonline.com/common/oauth2/v2.0/token",
            qs.stringify(data),
            { headers: { "content-type": "application/x-www-form-urlencoded" } }
        );

        const json = res.data;

        writeFile(ACCESS_TOKEN_FILE, json.access_token);
        writeFile(REFRESH_TOKEN_FILE, json.refresh_token);

        console.log("New Access Token saved → .bingads/accessToken.txt");
        console.log("New Refresh Token saved → .bingads/refreshToken.txt\n");

        return json.access_token;
    }

    // ----------------------------------------------------------
    // STEP 4: Load cached access_token if available
    // ----------------------------------------------------------
    static async getStoredAccessToken() {
        return readFile(ACCESS_TOKEN_FILE);
    }

    // ----------------------------------------------------------
    // STEP 5: Main function — always returns a valid access token
    // ----------------------------------------------------------
    static async getValidAccessToken(config) {
        if (!config) {
            throw new Error("Config object is required");
        }

        // Step A: Return existing token if available
        const token = readFile(ACCESS_TOKEN_FILE);
        if (token) return token;

        // Step B: No stored token → Check if we have access code
        const accessCode = readFile(ACCESS_CODE_FILE);

        if (!accessCode) {
            console.log("No ACCESS CODE found → Starting OAuth Consent Flow...\n");
            await this.getConsentAndAccessCode(config);
        } else {
            console.log("Using saved ACCESS CODE from .bingads/access_code.txt...\n");
        }

        // Step C: Exchange access code → token
        return await this.getAccessToken(config);
    }
}

module.exports = TokenManager;
