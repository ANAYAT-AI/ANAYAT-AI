const { cmd } = require('../command');
const axios = require('axios');
const config = require('../config');

cmd({
    pattern: "tt",
    alias: ["tiktok", "ttdl"],
    react: "🎵",
    desc: "Download TikTok video without watermark",
    category: "download",
    use: ".tt <tiktok url>",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q || !q.includes("tiktok")) {
            return reply("❌ TikTok link do\nExample:\n.tt https://vm.tiktok.com/xxxx");
        }

        await reply("⏳ *𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸 downloading TikTok...*");

        const apiUrl = `https://arslanmd-api.vercel.app/api/ttdl?url=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data.status || !data.result?.video) {
            return reply("❌ TikTok download failed\nLink private ya expired ho sakta hai.");
        }

        const caption = `
🎵 *TikTok Downloaded*
👤 Author: ${data.result.author || "Unknown"}

> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸*
        `.trim();

        await conn.sendMessage(from, {
            video: { url: data.result.video },
            caption: caption,
            mimetype: "video/mp4"
        }, { quoted: mek });

    } catch (e) {
        console.error("TikTok Error:", e);
        reply("❌ Error while downloading TikTok");
    }
});
  
