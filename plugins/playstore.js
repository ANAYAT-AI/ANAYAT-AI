const axios = require("axios");
const { cmd } = require("../command");

cmd({
    pattern: "playstore",
    desc: "Search apps from PlayStore",
    category: "search",
    react: "📱",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {

    try {

        if (!q) return reply("❌ Please give app name\n\nExample: .playstore whatsapp");

        let api = `https://api.princetechn.com/api/search/playstore?apikey=prince&query=${q}`;
        
        let res = await axios.get(api);
        let data = res.data.results;

        if (!data || data.length === 0) {
            return reply("❌ No apps found");
        }

        let app = data[0];

        let msg = `╭━━〔 📱 PLAYSTORE SEARCH 〕━━⬣
┃ 📛 Name : ${app.name}
┃ 👨‍💻 Developer : ${app.developer}
┃ ⭐ Rating : ${app.rating}
┃ 💰 Price : ${app.price}
┃ 📥 Installs : ${app.installs}
┃ 📝 About : ${app.summary}
┃ 🔗 Link : ${app.link}
╰━━━━━━━━━━━━━━━⬣

> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸*

        await conn.sendMessage(from, {
            image: { url: app.img },
            caption: msg
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("❌ Error fetching PlayStore data");
    }

});
