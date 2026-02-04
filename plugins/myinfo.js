const { cmd } = require("../command");
const os = require("os");

cmd({
    pattern: "myinfo",
    alias: ["ana"],
    desc: "ANAYAT Ultra New Edition",
    category: "info",
    react: "👑",
    filename: __filename
}, async (conn, mek, m, { from }) => {
    try {

        // ✅ Uptime
        const uptime = process.uptime();
        const h = Math.floor(uptime / 3600);
        const min = Math.floor((uptime % 3600) / 60);
        const sec = Math.floor(uptime % 60);

        // ✅ RAM
        const totalRAM = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
        const freeRAM = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
        const usedRAM = (totalRAM - freeRAM).toFixed(2);

        // ✅ CPU
        const cpu = os.cpus()[0].model;

        // ✅ Date & Time
        const date = new Date().toLocaleDateString();
        const time = new Date().toLocaleTimeString();

        // ✅ Greeting System
        let greet = "🌙 Good Night";
        const hour = new Date().getHours();
        if (hour < 12) greet = "🌅 Good Morning";
        else if (hour < 17) greet = "☀️ Good Afternoon";
        else if (hour < 20) greet = "🌆 Good Evening";

        const text = `
╔═══〔 🇵🇰 𝙰𝙽𝙰𝚈𝙰𝚈-𝙰𝙸 𝚄𝙻𝚃𝚁𝙰 🇵🇰 〕═══╗

${greet} @${m.sender.split("@")[0]}

┌─❖ OWNER INFO ❖─
│ 👤 Name     : 𝙰𝙽𝙰𝚈𝙰𝚃 𝙷𝙰𝙲𝙺𝙴𝚁 💫
│ 🏷 Nick     : 𝙰𝙽𝙰 💫
│ 🎂 Age      : 18+ 💫
│ 🧬 Caste    : 𝚂𝚄𝙳𝙷𝙰𝙽 💫
│ 🌍 Country  : Pakistan 💫
│ 🏙 City     : 𝙰𝚉𝙰𝙳 𝙺𝙰𝚂𝙷𝙼𝙸𝚁 💫 
└───────────────

┌─❖ BOT INFO ❖─
│ 🤖 Bot Name : 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸 👻
│ 👑 Owner    : 𝙰𝙽𝙰𝚈𝙰𝚃 𝙷𝙰𝙲𝙺𝙴𝚁 👻
│ 📞 Owner No : +923452401207 👻
│ 🔣 Prefix   : . 👻
│ ⚙️ Mode     : Public 👻
│ 🔌 Version  : Multi Device 👻
└───────────────

┌─❖ SYSTEM STATUS ❖─
│ 💻 Platform : ${os.platform()}
│ ⚡ CPU      : ${cpu}
│ 🧠 RAM      : ${usedRAM}GB / ${totalRAM}GB
│ ⏳ Uptime   : ${h}h ${min}m ${sec}s
│ 📅 Date     : ${date}
│ ⏰ Time     : ${time}
└───────────────

╚═══════════════════════╝

> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸*
`;

        await conn.sendMessage(from, {
            text,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true
            }
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
    }
});
