// =======================
// AUTO API CHECK & FORWARD
// Ultra Pro Max
// © Powered By ANAYAT-AI
// =======================

const { cmd } = require('../command')
const axios = require('axios')

// ✅ Owner Numbers
const OWNERS = [
    "923452401207",
    "923498011451",
    "923392616263",
    "923237045919"
]

function isOwner(sender){
    return OWNERS.includes(sender.split("@")[0])
}

// 🔁 Storage last data
let lastData = null
let autoRunning = false
let forwardJid = null

// =======================
// START AUTO CHECK
// =======================
cmd({
    pattern: "autostart",
    desc: "Start Auto API Check (Owner Only)",
    category: "owner",
    react: "▶️",
    filename: __filename
},
async (conn, mek, m, { sender, reply, args }) => {

    if (!isOwner(sender)) return reply("❌ Owner Only")

    if (!args[0]) return reply("⚠️ Give Group/Channel JID")

    forwardJid = args[0]

    if (autoRunning) return reply("⚠️ Already Running")

    autoRunning = true
    reply("✅ Auto Check Started (3s Interval)")

    setInterval(async () => {

        if (!autoRunning) return

        try {

            // 👉 Replace with your SAFE API
            const res = await axios.get("https://arslan-apis.vercel.app/more/liveotp")

            if (!res.data?.result) return

            let newData = JSON.stringify(res.data.result)

            if (newData !== lastData) {

                lastData = newData

                let text = "📡 New API Update Detected\n\n"

                res.data.result.slice(0,5).forEach((d,i)=>{
                    text += `🔹 ${i+1}. ${d.number || "Data"}\n`
                })

                text += "\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸-𝙰𝚁𝚂𝙻𝙰𝙽-𝙼𝙳*"

                await conn.sendMessage(forwardJid,{ text })

            }

        } catch(err){
            console.log("AUTO CHECK ERROR:", err.message)
        }

    }, 3000) // 3 seconds
})


// =======================
// STOP AUTO CHECK
// =======================
cmd({
    pattern: "autostop",
    desc: "Stop Auto Check",
    category: "owner",
    react: "⏹️",
    filename: __filename
},
async (conn, mek, m, { sender, reply }) => {

    if (!isOwner(sender)) return reply("❌ Owner Only")

    autoRunning = false
    reply("🛑 Auto Check Stopped")
})
