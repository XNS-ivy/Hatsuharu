
function waifuAPI(type, category) {
    const url = `https://api.waifu.pics/${type}/${category}`;
    return url;
}

module.exports = { waifuAPI }