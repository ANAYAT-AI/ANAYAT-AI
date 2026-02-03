const axios = require("axios");
const { cmd } = require("../command");

cmd({
    pattern: "short",
    desc: "Short any URL using SSUR",
    category: "tools",
    react: "🔗",
    filename: __filename
},
async (conn, mek, m, { from, args, reply }) => {

    try {

        if (!args[0]) return reply("❌ Please provide a URL\n\nExample:\n.short https://google.com");

        let url = encodeURIComponent(args[0]);

        let api = `https://api.princetechn.com/api/tools/ssur?apikey=prince&url=${url}`;

        let res = await axios.get(api);

        if (!res.data.success) return reply("❌ Failed to shorten URL");

        let shortUrl = res.data.result;

        let text = `╭━━〔 🔗 URL SHORTENER 〕━━⬣\n`;
        text += `┃ 📥 Original : ${args[0]}\n`;
        text += `┃ 📤 Short URL : ${shortUrl}\n`;
        text += `╰━━━━━━━━━━━━━━━⬣\n\n`;
        text += `> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸*`;

        await conn.sendMessage(from, { text }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("❌ Error shortening URL");
    }

});
