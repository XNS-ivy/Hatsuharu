const reply = require("./replyData.json");
const fs = require("fs");
const axios = require("axios");

function msgProcess(msg) {
    // if(Object.keys(msg.message)[0] == undefined || Object.keys(msg.message)[2] == undefined) return undefined;
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
async function initialQuery(query, args, id, name) {
    let text = undefined;
    let media = undefined;
    let audio = undefined;
    switch (query) {
        case global.config.infoMenu[0]:
            if (args) break;
            text = reply.info;
            break;
        case global.config.interactMenu[0]:
        case global.config.interactMenu[1]:
        case global.config.interactMenu[2]:
            if (args) break;
            const index = query == global.config.interactMenu[0] ? "./src/audio/hatsu.ogg" :
                query == global.config.interactMenu[1] ? "./src/audio/detail.ogg" : "./src/audio/talk.ogg";
            audio = index;
            break;
        case "sfw":
            if (!args) break;
                const getRandomAnime = await fetchWaifuData(query, args);
                text = getRandomAnime.text;
                media = getRandomAnime.url;
            break;
        default:
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
async function fetchWaifuData(type, category) {
    try {
      // Mengatur URL berdasarkan tipe dan kategori
      const url = `https://api.waifu.pics/${type}/${category}`;
      
      // Mengambil data dari API menggunakan axios
      const response = await axios.get(url);
      
      // Menampilkan hasilnya
      console.log('Response Data:', response.data);
      
      // Mengembalikan data
      return {
        url: response.data,
        text: ">-<",
    };
    } catch (error) {
      // Menangani error jika ada masalah saat pengambilan data
      console.error('Error fetching data:', error);
    }
  }
module.exports = { msgProcess, styleLogging, initialQuery }