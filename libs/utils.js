const fs = require("fs").promises;
const axios = require("axios");

async function loadConfig() {
    try {
        if (!global.botConfig) {
            throw new Error("Path to botConfig is not defined");
        }

        const data = await fs.readFile(global.botConfig, "utf-8");
        global.config = JSON.parse(data);
    } catch (error) {
        console.error("Error loading config:", error);
    }
}
async function fetchWaifuData(type, category) {
    try {
        const url = `https://api.waifu.pics/${type}/${category}`;
        const response = await axios.get(url);
        return {
            url: response.data.url,
            text: ">-<",
        };
    } catch (error) {
        console.log(error);
        return {
            text: "Category not found"
        }
    }
}

async function wiki(argumen, region) {
    if (!argumen) return `Please add argument after query Ex: "${global.config.prefix}${global.config.memberMenu[2]} anime"`;
    try {
        const url = `https://${region}.wikipedia.org/w/api.php`;
        const responseUrl = await axios.get(url, {
            params: {
                format: 'json',
                action: 'query',
                list: 'search',
                srsearch: argumen,
                srprop: '',
                srlimit: 1,
                utf8: 1
            }
        });

        const searchResult = responseUrl.data.query.search;
        if (searchResult.length > 0) {
            const firstResult = searchResult[0];
            const title = firstResult.title;
            const articleResponse = await axios.get(url, {
                params: {
                    format: 'json',
                    action: 'query',
                    prop: 'extracts',
                    exintro: true,
                    explaintext: true,
                    redirects: 1,
                    titles: title
                }
            });

            const pages = articleResponse.data.query.pages;
            const pageIds = Object.keys(pages);
            if (pageIds.length > 0) {
                const extract = pages[pageIds[0]].extract;
                if (extract) {
                    return `Article: ${title}\n\n${extract}`;
                } else {
                    return `Sorry, article not found!`;
                }
            } else {
                return `Sorry, article not found!`;
            }
        } else {
            return `Sorry, result not found for : "${argumen}".`;
        }
    } catch (err) {
        console.error('Error While Collecting Data :', err);
        return `Error: ${err.message}`;
    }
}

module.exports = { loadConfig, fetchWaifuData, wiki };