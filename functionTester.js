const axios = require("axios");
const { waifuPics, wiki } = require("./libs/utils");

// Waifu API
async function waifu(){
    const testPics = await waifuPics("sfw","neko").catch((err) =>{
        console.error(err);
    });
    if(testPics) console.log("waifu pics: OK\n",testPics,"\n\n");
}
waifu();

// Wiki API
async function WikiSearch() {
    const testWiki = await wiki("nodejs", "en").catch((err) =>{
        console.error(err);
    });
    if(testWiki) console.log("Wikipedia: OK\n",testWiki,"\n\n");
}
WikiSearch();