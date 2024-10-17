const fs = require("fs").promises;
const axios = require("axios");

async function loadConfig() {
    try {
        if (!global.botConfig) {
            throw new Error("Path to botConfig is not defined");
        }

        const data = await fs.readFile(global.botConfig, "utf-8"); 
        global.config = JSON.parse(data);
    } catch (error) {
        console.error("Error loading config:", error);
    }
}
async function fetchWaifuData(type, category) {
    try {
        const url = `https://api.waifu.pics/${type}/${category}`;
        const response = await axios.get(url);
        return {
            url: response.data.url,
            text: ">-<",
        };
    } catch (error) {
        console.log(error);
        return {
            text: "Category not found"
        }
    }
}

module.exports = { loadConfig, fetchWaifuData };