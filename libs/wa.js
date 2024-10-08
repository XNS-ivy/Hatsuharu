const { default: hatsuharu, useMultiFileAuthState } = require("@whiskeysockets/baileys");
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
        const bodyMsg = msgProcess(msg);
        // console.log(bodyMsg);
        if (bodyMsg.hitPrefix == false) {
            styleLogging(bodyMsg, "log");
        } else {
            const query = bodyMsg.command;
            const args = bodyMsg.argument;

            const selectMenu = global.config.infoMenu.includes(bodyMsg.command) ? "info" :
                global.config.memberMenu.includes(bodyMsg.command) ? "regular" :
                    global.config.premiumMenu.includes(bodyMsg.command) ? "premium" :
                        global.config.adminMenu.includes(bodyMsg.command) ? "admin" : undefined;
            if (selectMenu){
                styleLogging(bodyMsg, "query");
                const executeQuery = await initialQuery(query, args);
                const Image = "https://raw.githubusercontent.com/XNS-ivy/Hatsuharu/488421104ed9f12428052c052393ac226954e721/src/image/profile.jpg";
                const content = {
                    text: executeQuery.text,
                    contextInfo: {
                        externalAdReply: {
                            showAdAttribution: false,
                            renderLargerThumbnail: true,
                            title: `Title`,
                            body: `Description`,
                            previewType: 2, 
                            mediaType: 1,
                            thumbnailUrl: Image,
                            mediaUrl: `https://github.com`, 
                            sourceUrl: `https://github.com`,
                        },
                    }
                };
                if(executeQuery.urlAudio == undefined && executeQuery.urlMedia == undefined && executeQuery.text !== undefined){
                    await hatsu.sendMessage(bodyMsg.idNumber, content, {quoted : msg, ephemeralExpiration: bodyMsg.isDissapearChat});
                }
            }
            else {
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