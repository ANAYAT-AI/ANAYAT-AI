const axios = require("axios");
const { cmd } = require("../command");

cmd({
    pattern: "github",
    desc: "Download GitHub repository as ZIP",
    category: "download",
    react: "🐙",
    filename: __filename
},
async (conn, mek, m, { from, args, reply }) => {

    try {

        if (!args[0]) return reply("❌ Please provide GitHub repository URL\n\nExample:\n.github https://github.com/user/repo");

        let repoUrl = args[0];

        // Extract owner/repo from URL
        let match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/i);
        if (!match) return reply("❌ Invalid GitHub URL");

        let owner = match[1];
        let repo = match[2];

        let api = `https://api.github.com/repos/${owner}/${repo}/zipball`;

        let fileName = `${repo}.zip`;

        let caption = `╭━━〔 🐙 GITHUB REPO DOWNLOADER 〕━━⬣\n`;
        caption += `┃ 📦 Repo : ${repo}\n`;
        caption += `┃ 👤 Owner: ${owner}\n`;
        caption += `╰━━━━━━━━━━━━━━━━━━⬣\n\n`;
        caption += `> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸*`;

        await conn.sendMessage(from, {
            document: { url: api },
            fileName: fileName,
            mimetype: "application/zip",
            caption: caption
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("❌ Error downloading GitHub repo");
    }

});
