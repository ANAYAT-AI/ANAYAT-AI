const { cmd } = require("../command");
const { sleep } = require("../lib/functions");

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
        if (!isCreator) {
            return reply("> *📛 𝚃𝙷𝙸𝚂 𝙸𝚂 𝙰𝙽 𝙾𝚆𝙽𝙴𝚁 𝙾𝙽𝙻𝚈 𝙲𝙾𝙼𝙼𝙰𝙽𝙳?!*");
        }

        // Initial message
        const updateMsg = await conn.sendMessage(from, {
            text: 'ιηιтιαтιηg sүsтεм υρ∂αт�?...🚀'
        }, { quoted: mek });

        // Update steps with emojis
        const updateSteps = [
            "*🔍 cнєcкιηg sүsтєм sтαтυs...*",
            "*🛠�? ρяєραʀιηg υρ∂αт�? cσмρσηєηтs...*",
            "*📦 ғιηαℓιzιηg ραcкαgєs...*",
            "*�? σρтιмιzιηg ρєʀғσʀмαηcε...*",
            "*🔃 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸 ʀєѕτατ...*",
            "*♻️ ʀєѕτατιηg sεʀvιcεs...*"
        ];

        // Show each step with delay
        for (const step of updateSteps) {
            await sleep(1500);
            await conn.relayMessage(
                from,
                {
                    protocolMessage: {
                        key: updateMsg.key,
                        type: 14,
                        editedMessage: {
                            conversation: step,
                        },
                    },
                },
                {}
            );
        }

        // Final message before restart
        await conn.sendMessage(from, {
            text: '- *�? ANAYAT-AI υρ∂αт�? cσмρℓєтє∂ ʀєѕτατιηg*'
        }, { quoted: mek });

        // Execute restart after a short delay
        await sleep(1000);
        require('child_process').exec("pm2 restart all");

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, {
            text: `*�? Update Failed!*\n_Error:_ ${e.message}\n\n*Try manually:*\n\`\`\`pm2 restart all\`\`\``
        }, { quoted: mek });
    }
});
