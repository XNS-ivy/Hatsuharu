const { hatsuWASocket } = require("./libs/wa");
const { loadConfig } = require("./libs/utils");
const now = new Date();
const day = [
    now.getDate(),
    now.getMonth() + 1,
    now.getFullYear(),
];
const time = [
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
];
const combineDate = day.join("-")+" "+time.join(":");

global.botConfig = "./config/config.json";
global.date = combineDate;
global.textProp = "----- >>>>> -----";
async function startApp() {
    try {
        await loadConfig();
        await hatsuWASocket();
    } catch (err) {
        console.error(err);
    }
}

startApp();