const axios = require("axios");
const config = require("../config");
const { cmd } = require("../command");

cmd({
  pattern: "animedetail",
  alias: ["animeupdates", "animeinfo"],
  react: "🎬",
  desc: "Get Anime / Movie detailed info",
  category: "search",
  use: ".animexdetail <Anime / Movie URL>",
  filename: __filename
}, async (conn, m, msg, { from, q, reply }) => {
  try {
    if (!q) return reply("❌ Anime / Movie ka link do bhai!");

    const apiUrl = `https://arslan-apis.vercel.app/movie/animexinDetail?url=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    if (!data?.status || !data?.result) {
      return reply("❌ Details fetch nahi ho saki!");
    }

    const res = data.result;

    let genres = res.genres?.join(", ") || "N/A";

    const caption = `
*ANAYAT-AI WHATSAPP BOT* 🤖

🎬 *Title:* ${res.title}
📺 *Episode Title:* ${res.episodeTitle || "N/A"}
⭐ *Rating:* ${res.rating || "N/A"}
🎞️ *Status:* ${res.status || "N/A"}
🏢 *Studio:* ${res.studio || "N/A"}
📅 *Released:* ${res.released || "N/A"}
⏱️ *Duration:* ${res.duration || "N/A"}
🌍 *Country:* ${res.country || "N/A"}
🎭 *Type:* ${res.type || "N/A"}
🎬 *Episodes:* ${res.episodes || "N/A"}
👥 *Fansub:* ${res.fansub || "N/A"}
🧩 *Genres:* ${genres}
📖 *Description:* ${res.description || "N/A"}

> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸*
`;

    // Send thumbnail + info
    await conn.sendMessage(from, {
      image: { url: res.image },
      caption
    }, { quoted: m });

    // Send download links grouped by subtitle
    for (let group of res.downloadLinks || []) {
      let text = `🔗 *${group.subtitleType}* Links:\n`;
      group.links.forEach((link, idx) => {
        text += `${idx + 1}. ${link.url}\n`;
      });

      // Footer for each link group
      text += `\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸*`;

      await conn.sendMessage(from, { text }, { quoted: m });
    }

    await reply("✅ Anime / Movie details sent successfully!");

  } catch (err) {
    console.error("ANIMEX DETAIL ERROR:", err);
    reply("❌ Error a gaya bhai, baad mein try karo!");
  }
});
