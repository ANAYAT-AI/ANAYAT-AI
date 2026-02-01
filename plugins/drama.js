const axios = require("axios");
const yts = require("yt-search");
const { cmd } = require("../command");

cmd({
  pattern: "drama",
  alias: ["ytdrama", "darama"],
  react: "📽️",
  desc: "Search YouTube & download video",
  category: "download",
  use: ".drama <search text>",
  filename: __filename
}, async (conn, m, msg, { from, q, reply }) => {
  try {
    if (!q) return reply("❌ Drama ka naam ya search text do bhai!");

    // 🔍 YouTube Search
    const search = await yts(q);
    const video = search.videos[0];

    if (!video) return reply("❌ Koi video nahi mila!");

    const infoMsg = `
*ANAYAT-AI WHATSAPP BOT* 🤖

🎬 *Title:* ${video.title}
👤 *Channel:* ${video.author.name}
⏱️ *Duration:* ${video.timestamp}
👁️ *Views:* ${video.views}
📅 *Uploaded:* ${video.ago}

⏳ Download ho raha hai... wait karo
    `;

    await conn.sendMessage(from, {
      image: { url: video.thumbnail },
      caption: infoMsg
    }, { quoted: m });

    // 📥 Download via API
    const apiUrl = `https://arslan-apis.vercel.app/download/ytmp4?url=https://youtu.be/2WmBa1CviYE?si=D0LWN3LAaE6nGFBo${encodeURIComponent(video.url)}`;
    const { data } = await axios.get(apiUrl);

    if (!data || data.status !== true) {
      return reply(`❌ Download error: ${data?.result || "API error"}`);
    }

    const result = data.result;

    await conn.sendMessage(from, {
      video: { url: result.url },
      caption: `
🎬 *${result.title || video.title}*
📦 *Quality:* ${result.quality || "MP4"}
⏱️ *Duration:* ${result.duration || video.timestamp}

> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸 ✅*
      `
    }, { quoted: m });

  } catch (err) {
    console.error("DRAMA PLUGIN ERROR:", err);
    reply("❌ Error aa gaya bhai, baad mein try karo!");
  }
});
