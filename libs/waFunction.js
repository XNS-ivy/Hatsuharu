const reply = require("./replyData.json");

function msgProcess(msg) {
    const getObjectMsg = Object.keys(msg.message)[0] == "senderKeyDistributionMessage" ? Object.keys(msg.message)[2] :
        Object.keys(msg.message)[0];

    const getTextMsg = getObjectMsg == "conversation" ? msg.message.conversation :
        getObjectMsg == "extendedTextMessage" ? msg.message.extendedTextMessage.text :
            getObjectMsg == "imageMessage" ? "*Image*" :
                getObjectMsg == "stickerMessage" ? "*Sticker*" :
                    getObjectMsg == "videoMessage" ? "*Video*" :
                        undefined;
    const stringMsg = String(getTextMsg);
    const getName = msg.pushName;
    const getPhonenumber = msg.key.participant == undefined ? msg.key.remoteJid.split("@")[0] : msg.key.participant.split("@")[0];
    const isHitPrevix = stringMsg.startsWith(global.config.prefix) ? true : false;
    const textOrCommand = stringMsg.startsWith(global.config.prefix) ? stringMsg.split(global.config.prefix)[1] : stringMsg;
    const isDissapear = getObjectMsg === "extendedTextMessage" ? 604800 : false;
    const isOnGroup = msg.key.participant == undefined ? false : true;
    const [command, ...args] = textOrCommand.split(/\s+/);
    const argument = args.join(" ");

    return {
        typeMesage: getObjectMsg,
        message: textOrCommand,
        name: getName,
        phoneNumber: getPhonenumber,
        idNumber: msg.key.remoteJid,
        isOnGroup: isOnGroup,
        hitPrefix: isHitPrevix,
        isDissapearChat: isDissapear,
        command: command,
        argument: argument,
    }
}
function styleLogging(bodyMsg, select) {
    if (select == "log") {
        console.log(`\t\t--- NEW MESSAGE ---
            NAME \t: ${bodyMsg.name}
            P.NUMBER \t: ${bodyMsg.phoneNumber}
            ON GROUP \t: ${bodyMsg.isOnGroup}
            DATE \t: ${global.date}
            MSG TYPE \t: ${bodyMsg.typeMesage}
            MESSAGE \t: ${bodyMsg.message}
            \t--- >>>>>>>>>>> ---\n`);
    } else if (select == "query") {
        console.log(`\t\t--- USED QUERY ---
            NAME \t: ${bodyMsg.name}
            P.NUMBER \t: ${bodyMsg.phoneNumber}
            ON GROUP \t: ${bodyMsg.isOnGroup}
            QUERY \t: ${bodyMsg.command}
            ARGUMENT \t: ${bodyMsg.argument}
            DATE \t: ${global.date}
            \t--- >>>>>>>>>> ---\n`);
    }
}
async function initialQuery(query, args) {
    let text;
    let media;
    let audio;
    switch (query) {
        case global.config.infoMenu[0]:
            if (args) break;
            text = reply.info;
            break;
        default:
            text = undefined;
            media = undefined;
            audio = undefined;
            break;
    }
    if (text !== undefined) {
        const Image = "https://raw.githubusercontent.com/XNS-ivy/Hatsuharu/refs/heads/main/src/image/profile.jpg";
        text = {
            text: text,
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: false,
                    renderLargerThumbnail: true,
                    title: `Hatsuharu`,
                    body: `Hatsuharu desu >-<`,
                    previewType: 2,
                    mediaType: 1,
                    thumbnailUrl: Image,
                    mediaUrl: `https://github.com/XNS-ivy`,
                    sourceUrl: `https://github.com/XNS-ivy`,
                },
            }
        };
    }
    return {
        text: text,
        urlMedia: media,
        urlAudio: audio,
    }
}
module.exports = { msgProcess, styleLogging, initialQuery }