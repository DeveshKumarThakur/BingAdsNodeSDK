const axios = require("axios");
const TokenManager = require("../auth/tokenManager");

async function httpPost(url, data, headers = {}) {
    const token = await TokenManager.getValidAccessToken();
    const finalHeaders = {
        "authorization": `Bearer ${token}`,
        "content-type": "application/json",
        ...headers
    };
    const response = await axios.post(url, data, { headers: finalHeaders });
    return response.data;
}

module.exports = { httpPost };