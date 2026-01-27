const { cmd } = require('../command');

// FAIZAN-MD name styles (rotate)
const nameStyles = [
    "𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸",
    "𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸",
    "𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸",
    "𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸",
    "𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸",
    "𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸",
    "𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸"
];

let nameIndex = 0;

cmd({
    pattern: "ping",
    alias: ["speed"],
    desc: "Stylish ping with rotating ANAYAT-AI name",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from }) => {
    try {
        const start = Date.now();

        // First message
        const sentMsg = await conn.sendMessage(from, {
            text: "⏳ Pinging..."
        }, { quoted: mek });

        // 1 second delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const speed = Date.now() - start;

        // Get current name style & rotate
        const botName = nameStyles[nameIndex];
        nameIndex = (nameIndex + 1) % nameStyles.length;

        // Edit same message
        await conn.sendMessage(from, {
            text: `⚡ ${botName} • 『${speed}ᴍs』`,
            edit: sentMsg.key
        });

    } catch (e) {
        console.error("PING ERROR:", e);
    }
});
