const { cmd } = require("../command");
const os = require("os");

cmd({
    pattern: "myinfo",
    alias: ["ana"],
    desc: "ANAYAT Ultra Pro Max Intro",
    category: "info",
    react: "🇵🇰",
    filename: __filename
}, async (conn, mek, m, { from }) => {
    try {

        // ✅ Channel JID
        const channelJid = "120363420933039839@newsletter";

        // ✅ Greeting
        const now = new Date();
        let greet = "🌙 Good Night";
        const hour = now.getHours();
        if (hour < 12) greet = "🌅 Good Morning";
        else if (hour < 17) greet = "☀️ Good Afternoon";
        else if (hour < 20) greet = "🌆 Good Evening";

        const text = `
╔═══〔 🇵🇰 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸 𝚄𝙻𝚃𝚁𝙰 𝙿𝚁𝙾 𝙼𝙰𝚇 🇵🇰 〕═══╗

${greet} @${m.sender.split("@")[0]}

╭───〔 👤 OWNER PROFILE 〕───╮
│ 🧑 Name      : 𝙰𝙽𝙰𝚈𝙰𝚃 𝙷𝙰𝙲𝙺𝙴𝚁
│ 🏷 Nick      : 𝙰𝙽𝙰
│ 🎂 Age       : 18+
│ 🧬 Tribe     : 𝚂𝚄𝙳𝙷𝙰𝙽
│ 🌍 Country   : 𝙿𝙰𝙺𝙸𝚂𝚃𝙰𝙽
│ 🏙 City      : 𝙰𝚉𝙰𝙳 𝙺𝙰𝚂𝙷𝙼𝙸𝚁
╰────────────────────────╯

╭───〔 🤖 BOT INFORMATION 〕───╮
│ 🧠 Bot Name  : 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸
│ 👑 Owner     : 𝙰𝙽𝙰𝚈𝙰𝚃 𝙷𝙰𝙲𝙺𝙴𝚁
│ 📞 Owner No  : +923452401207
│ 🔣 Prefix    : .
│ ⚙️ Mode      : 𝙿𝚄𝙱𝙻𝙸𝙲
│ 🔌 Version   : 𝙼𝚄𝙻𝚃𝙸 𝙳𝙴𝚅𝙸𝙲𝙴 
╰────────────────────────╯

╚════════════════════════════╝

> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸*
`;

        await conn.sendMessage(from, {
            text,
            contextInfo: {
                mentionedJid: [m.sender, channelJid], // ✅ User + Channel mention
                forwardingScore: 999,
                isForwarded: true
            }
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
    }
});
