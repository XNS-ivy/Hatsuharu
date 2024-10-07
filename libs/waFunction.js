function msgProcess(msg) {
    const getObjectMsg = Object.keys(msg.message)[0] == "senderKeyDistributionMessage" ? Object.keys(msg.message)[2] :
        Object.keys(msg.message)[0];

    const getTextMsg = getObjectMsg == "conversation" ? msg.message.conversation :
        getObjectMsg == "extendedTextMessage" ? msg.message.extendedTextMessage.text :
            getObjectMsg == "imageMessage" ? "*Image*" :
                getObjectMsg == "stickerMessage" ? "*Sticker*" :
                    getObjectMsg == "videoMessage" ? "*Video*" :
                        undefined;
    const getName = msg.pushName;
    const getPhonenumber = msg.key.participant == undefined ? msg.key.remoteJid.split("@")[0] : msg.key.participant.split("@")[0];
    const isHitPrevix = getTextMsg.startsWith(global.config.prefix) ? true : false;
    const textOrCommand = getTextMsg.startsWith(global.config.prefix) ? getTextMsg.split(global.config.prefix)[1] : getTextMsg;
    const isDissapear = getObjectMsg === "extendedTextMessage" ? true : false;
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
            TYPE MESSAGE : ${bodyMsg.typeMesage}
            MESSAGE \t: ${bodyMsg.message}
            \t--- >>>>>>>>>>> ---\n`);
    }else if(select == "query"){
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

module.exports = { msgProcess, styleLogging }