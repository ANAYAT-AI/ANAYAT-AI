const axios = require("axios");
const { cmd } = require("../command");

cmd({
    pattern: "checkapi",
    desc: "Check PrinceTech API Key Info",
    category: "tools",
    react: "🔑",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {

    try {

        let api = `https://api.princetechn.com/checkapikey?apikey=prince`;

        let res = await axios.get(api);
        let data = res.data.result;

        let text = `╭━━〔 🔑 API KEY INFO 〕━━⬣\n`;
        text += `┃ 👤 Username : ${data.username}\n`;
        text += `┃ 📦 Plan : ${data.plan}\n`;
        text += `┃ 📊 Limit : ${data.limit}\n`;
        text += `┃ ✅ Used : ${data.used}\n`;
        text += `┃ ♻ Remaining : ${data.remainingLimit}\n`;
        text += `┃ 📅 Registered : ${data.registeredDate}\n`;
        text += `┃ ⏳ Expiry : ${data.expiryDate}\n`;
        text += `┃\n`;
        text += `┃ 💬 Message :\n${data.customMessage}\n`;
        text += `╰━━━━━━━━━━━━━━━⬣\n\n`;
        text += `> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸*`;

        await conn.sendMessage(from, { text }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("❌ Error fetching API key info");
    }

});
