const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios');

cmd({
    pattern: "play",
    alias: ["song", "audio"],
    react: "🎵",
    desc: "YouTube search & MP3 play",
    category: "download",
    use: ".play <song name>",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        const query = args.join(" ");
        if (!query) return reply("❌ Bhai song name likho");

        await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

        // 🔍 YouTube search
        const search = await yts(query);
        if (!search.videos || !search.videos.length) {
            return reply("❌ Koi result nahi mila");
        }

        const video = search.videos[0];

        // 🎧 MP3 API (tumhari)
        const apiUrl = `https://arslan-apis.vercel.app/download/ytmp3?url=${video.url}`;
        const res = await axios.get(apiUrl, { timeout: 60000 });

        if (
            !res.data ||
            !res.data.status ||
            !res.data.result ||
            !res.data.result.download ||
            !res.data.result.download.url
        ) {
            return reply("❌ Audio generate nahi ho saka");
        }

        const dlUrl = res.data.result.download.url;
        const meta = res.data.result.metadata;
        const quality = res.data.result.download.quality || "128kbps";

        // 🎵 SEND AUDIO (DIRECT STREAM – SAFE)
        await conn.sendMessage(from, {
            audio: { url: dlUrl },
            mimetype: "audio/mpeg",
            ptt: false,
            fileName: `${meta.title}.mp3`,
            caption:
                `🎵 *${meta.title}*\n` +
                `🎚️ Quality: ${quality}\n\n` +
                `> © Arslan-MD`,
            contextInfo: {
                externalAdReply: {
                    title: meta.title.length > 40
                        ? meta.title.substring(0, 40) + "..."
                        : meta.title,
                    body: "YouTube MP3",
                    thumbnailUrl: meta.thumbnail,
                    sourceUrl: video.url,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

    } catch (err) {
        console.error("PLAY ERROR:", err);
        reply("❌ Bhai error aa gaya, thori der baad try karo");
        await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
    }
});
