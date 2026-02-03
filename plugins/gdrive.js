const axios = require("axios");
const { cmd } = require("../command");

cmd({
    pattern: "gdrive",
    desc: "Download Google Drive files",
    category: "download",
    react: "☁️",
    filename: __filename
},
async (conn, mek, m, { from, args, reply }) => {

    try {

        if (!args[0]) return reply("❌ Please provide Google Drive link\n\nExample:\n.gdrive <url>");

        let url = encodeURIComponent(args[0]);

        let api = `https://api.princetechn.com/api/download/gdrivedl?apikey=prince&url=${url}`;

        let res = await axios.get(api);

        if (!res.data.success) return reply("❌ Failed to fetch file");

        let fileName = res.data.result.name;
        let dlUrl = res.data.result.download_url;

        let caption = `╭━━〔 ☁️ GOOGLE DRIVE DOWNLOADER 〕━━⬣\n`;
        caption += `┃ 📄 File : ${fileName}\n`;
        caption += `╰━━━━━━━━━━━━━━━━━━━━⬣\n\n`;
        caption += `> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸*`;

        await conn.sendMessage(from, {
            document: { url: dlUrl },
            fileName: fileName,
            mimetype: "application/octet-stream",
            caption: caption
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("❌ Error downloading file");
    }

});
