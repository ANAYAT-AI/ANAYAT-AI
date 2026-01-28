const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "bili",
  alias: ["bilimovie", "bilivideo"],
  react: "📺",
  desc: "Search Bilibili Videos",
  category: "search",
  use: ".bili <search text>",
  filename: __filename
}, async (conn, m, msg, { from, q, reply }) => {
  try {
    if (!q) return reply("❌ Search text do bhai!");

    const apiUrl = `https://arslan-apis.vercel.app/download/blibli?text=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    if (!data?.status || !data?.result || data.result.length === 0) {
      return reply("❌ Koi Bilibili video nahi mila!");
    }

    for (let item of data.result) {
      const caption = `
*ANAYAT-AI WHATSAPP BOT* 🤖

🎬 *Title:* ${item.title || "N/A"}
👤 *Creator:* ${item.creatorName || "N/A"} 
👁️ *Views:* ${item.views || "N/A"}
⏱️ *Duration:* ${item.duration || "N/A"}
🔗 *Video Link:* ${item.videoLink || "N/A"}
🔗 *Creator Link:* ${item.creatorLink || "N/A"}

> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸*
`;

      await conn.sendMessage(from, {
        image: { url: item.thumbnail },
        caption
      }, { quoted: m });
    }

    await reply(`✅ Total ${data.result.length} Bilibili results found!`);

  } catch (err) {
    console.error("BILIBILI SEARCH ERROR:", err);
    reply("❌ Error a gaya bhai, baad mein try karo!");
  }
});
