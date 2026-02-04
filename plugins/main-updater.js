const { cmd } = require("../command");
const { sleep } = require("../lib/functions");
const { exec } = require("child_process");

cmd({
    pattern: "update",
    alias: ["upgrade", "sync"],
    desc: "Update and restart the bot system",
    category: "owner",
    react: "🚀",
    filename: __filename
},
async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) return reply("*📛 This is an owner-only command!*");

        // Step messages
        const updateSteps = [
            "🔍 Checking system status...",
            "🛠️ Preparing update components...",
            "📦 Finalizing packages...",
            "⚡ Optimizing performance...",
            "🔃 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸 restart...",
            "♻️ Restarting services..."
        ];

        // Send initial message
        let msg = await conn.sendMessage(from, { text: "🚀 Initiating system update..." }, { quoted: mek });

        // Loop through steps with delay
        for (let step of updateSteps) {
            await sleep(1500);
            await conn.sendMessage(from, { text: step }, { quoted: msg });
        }

        // Final message
        await sleep(1000);
        await conn.sendMessage(from, { text: "✅ 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸 update completed. Restarting..." }, { quoted: msg });

        // Restart bot
        exec("pm2 restart all", (err, stdout, stderr) => {
            if (err) {
                conn.sendMessage(from, { text: `❌ Restart failed!\n_Error:_ ${err.message}` }, { quoted: mek });
            }
        });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, {
            text: `❌ Update Failed!\n_Error:_ ${e.message}\nTry manually:\n\`\`\`pm2 restart all\`\`\``
        }, { quoted: mek });
    }
});
