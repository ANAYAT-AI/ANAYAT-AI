const axios = require("axios");
const config = require("../config");
const { cmd } = require("../command");

cmd({
  pattern: "anime",
  alias: ["animemovie", "animeupdate"],
  react: "🎬",
  desc: "Search Anime / Movies",
  category: "search",
  use: ".animex <movie name>",
  filename: __filename
}, async (conn, m, msg, { from, q, reply }) => {
  try {
    if (!q) return reply("❌ Movie / Anime ka naam do bhai!");

    const apiUrl = `https://arslan-apis.vercel.app/movie/animexinUpdate?text=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    if (!data?.status || !data?.result || data.result.length === 0) {
      return reply("❌ Koi movie / anime nahi mila!");
    }

    for (let item of data.result) {
      const caption = `
*ANAYAT-AI WHATSAPP BOT* 🤖

🎬 *Title:* ${item.title}
🔗 *Link:* ${item.url}
${item.episode ? `📺 Episode: ${item.episode}` : ""}

> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸*
`;

      await conn.sendMessage(from, {
        image: { url: item.image },
        caption
      }, { quoted: m });
    }

    await reply(`✅ Total ${data.result.length} results found!`);

  } catch (err) {
    console.error("ANIMEX ERROR:", err);
    reply("❌ Error a gaya bhai, baad mein try karo!");
  }
});
