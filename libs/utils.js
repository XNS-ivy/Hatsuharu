const fs = require("fs").promises;

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

module.exports = { loadConfig };