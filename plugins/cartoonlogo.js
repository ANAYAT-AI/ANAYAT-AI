const axios = require("axios");
const { cmd } = require("../command");

cmd({
    pattern: "cartoonlogo",
    desc: "Create cartoon style text logo",
    category: "logo",
    react: "🎨",
    filename: __filename
},
async (conn, mek, m, { from, args, reply }) => {

    try {

        if (!args.length) return reply("❌ Please provide text\n\nExample:\n.cartoon ANAYAT");

        let textInput = encodeURIComponent(args.join(" "));

        let api = `https://api.princetechn.com/api/ephoto360/cartoonstyle?apikey=prince&text=${textInput}`;

        let res = await axios.get(api);

        if (!res.data.success) return reply("❌ Failed to create logo");

        let imageUrl = res.data.result.image_url;

        let caption = `╭━━〔 🎨 CARTOON STYLE LOGO 〕━━⬣\n`;
        caption += `┃ ✏️ Text : ${args.join(" ")}\n`;
        caption += `╰━━━━━━━━━━━━━━━⬣\n\n`;
        caption += `> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸*`;

        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: caption
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("❌ Error generating logo");
    }

});
