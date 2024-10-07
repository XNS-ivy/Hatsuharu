const { default: hatsuharu, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require("fs");
const { msgProcess } = require("./waFunction")

async function hatsuWASocket() {
    const { state, saveCreds } = await useMultiFileAuthState("session");
    const socketConfig = {
        printQRInTerminal: true,
        auth: state,
        emitOwnEvents: false,
        logger: pino({ level: "silent" }),
    };
    const hatsu = await hatsuharu(socketConfig);
    hatsu.ev.on("creds.update", saveCreds);
    hatsu.ev.on("messages.upsert",async (m) => {
        const msg = m.messages[0];
        if (!m.messages[0] || msg.pushName == undefined) return;
        console.log(msg);
        const isCommand = msgProcess(msg);
        isCommand;
    
    });
    hatsu.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update;
        const connStatus = connection === "close" ? "close" : connection === "open" ? "connection open" : connection === "connecting" ? "connecting to user" : "";
        if (connStatus === "close") {
            const disconnectReason = lastDisconnect?.error?.output?.payload?.error;
            if (disconnectReason === "Unauthorized") {
                if (fs.existsSync("./session")) {
                    fs.rmSync("./session", { recursive: true, force: true });
                }
                setTimeout(async () => {
                    await hatsuWASocket();
                }, 5000);
            } else {
                console.log(lastDisconnect?.date, "\n", lastDisconnect?.error?.message, "\n");
                setTimeout(async () => {
                    await hatsuWASocket();
                }, 5000);
            }
        } else if (connStatus === "connection open" || connStatus === "connecting to user") {
            console.log(connStatus);
        }
    });
}

module.exports = { hatsuWASocket };