const { hatsuWASocket } = require("./libs/wa");
const { loadConfig } = require("./libs/utils");
const now = new Date();
const time = [
    now.getDate(),
    now.getMonth() + 1,
    now.getFullYear(),
    now.getHours(),
    now.getMinutes()
];

global.botConfig = "./config/config.json";
global.date = time.join(":");

async function startApp() {
    try {
        await loadConfig();
        await hatsuWASocket();
    } catch (err) {
        console.error(err);
    }
}

startApp();