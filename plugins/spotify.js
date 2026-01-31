const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "spotify",
  alias: ["sp", "spdl"],
  react: "🎵",
  desc: "Download Spotify Track",
  category: "download",
  use: ".spotify <track link>",
  filename: __filename
}, async (conn, m, msg, { from, q, reply }) => {
  try {
    if (!q) return reply("❌ Spotify track ka link do bhai!");

    const apiUrl = `https://arslan-apis.vercel.app/download/spotidl?q=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    if (!data?.status || !data?.download) {
      return reply("❌ Track download nahi ho saki!");
    }

    const song = data.metadata;

    const caption = `
🎵 *Title:* ${song.title || "N/A"}
👤 *Artist:* ${song.artist || "N/A"}
⏱️ *Duration:* ${song.duration || "N/A"}
🔗 *Spotify Link:* ${song.url || "N/A"}

> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸*
`;

    await conn.sendMessage(from, {
      image: { url: song.thumbnail },
      caption
    }, { quoted: m });

    await conn.sendMessage(from, {
      audio: { url: data.download.url },
      mimetype: "audio/mpeg"
    }, { quoted: m });

  } catch (err) {
    console.error("SPOTIFY DOWNLOAD ERROR:", err);
    reply("❌ Error a gaya bhai, baad mein try karo!");
  }
});
