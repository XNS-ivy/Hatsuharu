const { hatsuWASocket } = require("./libs/wa");

hatsuWASocket().catch((err) =>{
    console.error(err)
});