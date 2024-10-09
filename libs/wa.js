const { default: hatsuharu, useMultiFileAuthState, Mimetype } = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require("fs");
const { msgProcess, styleLogging, initialQuery } = require("./waFunction")

async function hatsuWASocket() {
    const { state, saveCreds } = await useMultiFileAuthState("session");
    const socketConfig = {
        printQRInTerminal: true,
        auth: state,
        emitOwnEvents: false,
        logger: pino({ level: "silent" }),
        browser: ["Hatsuharu", "Chrome", "1.0.0"],
        generateHighQualityLinkPreview: true,
    };
    const hatsu = await hatsuharu(socketConfig);
    hatsu.ev.on("creds.update", saveCreds);
    hatsu.ev.on("messages.upsert", async (m) => {
        const msg = m.messages[0];
        if (!m.messages[0] || msg.pushName == undefined) return;
        // console.log(msg);
        const bodyMsg = await msgProcess(msg);
        if (bodyMsg == undefined) return;
        // console.log(bodyMsg);
        if (bodyMsg.hitPrefix == false) {
            styleLogging(bodyMsg, "log");
        } else {
            const query = bodyMsg.command;
            const args = bodyMsg.argument;

            const selectMenu = global.config.infoMenu.includes(bodyMsg.command) ? "info" :
                global.config.memberMenu.includes(bodyMsg.command) ? "regular" :
                    global.config.premiumMenu.includes(bodyMsg.command) ? "premium" :
                        global.config.adminMenu.includes(bodyMsg.command) ? "admin" :
                            global.config.interactMenu.includes(bodyMsg.command) ? "interact" : undefined;

            if (selectMenu) {
                styleLogging(bodyMsg, "query");
                const executeQuery = await initialQuery(query, args, bodyMsg.phoneNumber, bodyMsg.name);
                if (executeQuery.urlAudio == undefined && executeQuery.urlMedia == undefined && executeQuery.text !== undefined) {
                    await hatsu.sendMessage(bodyMsg.idNumber, executeQuery.text, { quoted: msg, ephemeralExpiration: bodyMsg.isDissapearChat }).catch((err) => {
                        console.error(err);
                    });
                } else if (executeQuery.urlAudio && executeQuery.urlMedia == undefined && executeQuery.text == undefined) {
                    await hatsu.sendMessage(bodyMsg.idNumber, { audio: { url: executeQuery.urlAudio }, mimetype: "audio/mp4", ptt: true}, { quoted: msg, ephemeralExpiration: bodyMsg.isDissapearChat}).catch((err) => {
                        console.error(err);
                    });
                }
            }
            else {
                console.log("error execute query :", bodyMsg.command, bodyMsg.argument, selectMenu);
            }
        }
    });
    hatsu.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update;
        const connStatus = connection === "close" ? "close" :
            connection === "open" ? "connection open" :
                connection === "connecting" ? "connecting to user" : "";

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
            console.log(`\t\t${global.textProp}
                ${connStatus}
                ${global.textProp}\n`);
        }
    });
}

module.exports = { hatsuWASocket };