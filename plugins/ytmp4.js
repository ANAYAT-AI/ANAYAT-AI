const axios = require("axios");
const config = require("../config");
const { cmd } = require("../command");

cmd({
  pattern: "play4",
  alias: ["mp4", "ytmp4"],
  react: "🎬",
  desc: "Download YouTube MP4",
  category: "download",
  use: ".play4 <YouTube URL>",
  filename: __filename
}, async (conn, m, msg, { from, q, reply }) => {
  try {
    if (!q) return reply("❌ YouTube link do bhai!");

    const apiUrl = `https://arslan-apis.vercel.app/download/ytmp4?url=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    if (!data?.status || !data?.result?.download?.url) {
      return reply("❌ Video generate nahi ho saki!");
    }

    const meta = data.result.metadata;
    const videoUrl = data.result.download.url;

    const caption = `
*ANAYAT-AI WHATSAPP BOT* 🤖

🎵 *Title:* ${meta.title}
🎥 *Quality:* ${data.result.download.quality}
📁 *Type:* Video

${config.FOOTER || "> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸*"}
`;

    // Send thumbnail + info
    await conn.sendMessage(from, {
      image: { url: meta.thumbnail },
      caption
    }, { quoted: m });

    // Send video
    await conn.sendMessage(from, {
      video: { url: videoUrl },
      mimetype: "video/mp4",
      fileName: `${meta.title}.mp4`
    }, { quoted: m });

    await reply("✅ Video successfully sent!");

  } catch (err) {
    console.error("PLAY4 ERROR:", err);
    reply("❌ Error a gaya bhai, baad mein try karo!");
  }
});
