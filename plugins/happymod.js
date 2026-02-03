const axios = require("axios");
const { cmd } = require("../command");

cmd({
    pattern: "happymod",
    desc: "Search apps from HappyMod / F-Droid",
    category: "search",
    react: "📥",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {

    try {

        if (!q) return reply("❌ Please give app name\n\nExample: .happymod whatsapp");

        let api = `https://api.princetechn.com/api/search/happymod?apikey=prince&query=${q}`;
        
        let res = await axios.get(api);
        let results = res.data.results.data;

        if (!results || results.length === 0) {
            return reply("❌ No apps found");
        }

        let text = `╭━━〔 📥 HAPPYMOD SEARCH 〕━━⬣\n`;

        results.slice(0, 5).forEach((app, i) => {
            text += `┃ ${i+1}. 📛 ${app.name}\n`;
            text += `┃ 📝 ${app.summary}\n`;
            text += `┃ 🔗 ${app.url}\n`;
            text += `┃ 📦 Source : ${app.source}\n`;
            text += `┃\n`;
        });

        text += `╰━━━━━━━━━━━━━━━⬣\n\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸*`;

        await conn.sendMessage(from, {
            image: { url: results[0].icon },
            caption: text
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("❌ Error fetching HappyMod data");
    }

});
