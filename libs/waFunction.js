function msgProcess(msg) {
    const getObjectMsg = Object.keys(msg.message)[0];
    const getTextMsg = getObjectMsg == "conversation" ? msg.message.conversation :
        getObjectMsg == "extendedTextMessage" ? msg.message.extendedTextMessage.text :
            getObjectMsg == "imageMessage" ? "*Image*" :
                getObjectMsg == "stickerMessage" ? "*Sticker*" :
                    getObjectMsg == "videoMessage" ? "*Video*" : undefined;

    const getName = msg.pushName;
    return {

    }
}

module.exports = {
    msgProcess
}