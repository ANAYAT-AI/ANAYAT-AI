const { cmd } = require('../command')
const axios = require('axios')
const yts = require('yt-search')
const fs = require('fs')
const path = require('path')
const ffmpeg = require('fluent-ffmpeg')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path

ffmpeg.setFfmpegPath(ffmpegPath)

cmd({
    pattern: "video",
    alias: ["playvideo", "vid"],
    desc: "Download YouTube video",
    category: "download",
    react: "🎬",
    filename: __filename
}, async (conn, mek, m, { from, reply, text }) => {
    try {
        if (!text) {
            return reply("❌ *Video name likho*\nExample:\n.video phir chala")
        }

        // 🔍 Search video
        const search = await yts(text)
        if (!search.videos || !search.videos.length) {
            return reply("❌ *No video found*")
        }

        const vid = search.videos[0]

        // 🎨 STYLE MESSAGE (same as screenshot)
        const caption = `
> *𝙰𝙽𝙰𝚈𝙰𝚃-𝙷𝙰𝙲𝙺𝙴𝚁 🇵🇰*
────────────────────
🎬 *VIDEO FOUND*

📌 *Title:* ${vid.title}
⏱️ *Duration:* ${vid.timestamp}

⏳ *Processing video...*
────────────────────
• > *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸*
`

        await conn.sendMessage(from, {
            image: { url: vid.thumbnail },
            caption
        }, { quoted: mek })

        // 🎥 API (Arslan)
        const api = `https://arslan-apis.vercel.app/download/ytmp4?url=${encodeURIComponent(vid.url)}`
        const res = await axios.get(api, { timeout: 60000 })

        if (!res.data?.status || !res.data?.result?.download?.url) {
            return reply("❌ *Video API failed*")
        }

        const videoUrl = res.data.result.download.url

        // 📂 temp
        const tempDir = path.join(__dirname, '../temp')
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)

        const rawPath = path.join(tempDir, `raw_${Date.now()}.mp4`)
        const finalPath = path.join(tempDir, `final_${Date.now()}.mp4`)

        // ⬇ Download video
        const stream = await axios({
            url: videoUrl,
            method: "GET",
            responseType: "stream",
            timeout: 120000
        })

        await new Promise((resolve, reject) => {
            const w = fs.createWriteStream(rawPath)
            stream.data.pipe(w)
            w.on('finish', resolve)
            w.on('error', reject)
        })

        // 🛠️ FFMPEG FIX (BLACK SCREEN SOLUTION)
        await new Promise((resolve, reject) => {
            ffmpeg(rawPath)
                .outputOptions([
                    '-map 0:v:0',
                    '-map 0:a:0?',
                    '-movflags +faststart',
                    '-pix_fmt yuv420p',
                    '-vf scale=trunc(iw/2)*2:trunc(ih/2)*2',
                    '-profile:v baseline',
                    '-level 3.0'
                ])
                .videoCodec('libx264')
                .audioCodec('aac')
                .audioBitrate('128k')
                .videoBitrate('900k')
                .format('mp4')
                .on('end', resolve)
                .on('error', reject)
                .save(finalPath)
        })

        // 📤 Send video
        await conn.sendMessage(from, {
            video: fs.readFileSync(finalPath),
            mimetype: "video/mp4",
            caption: `🎬 *${vid.title}*\n\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸*`
        }, { quoted: mek })

        // 🧹 cleanup
        fs.unlinkSync(rawPath)
        fs.unlinkSync(finalPath)

    } catch (err) {
        console.error(err)
        reply("❌ *Video processing error*")
    }
})
      
