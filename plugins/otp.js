const axios = require('axios')

const CHANNEL_ID = "120363420933039839@newsletter"
const API_URL = "https://arslan-apis.vercel.app/more/liveotp"

let lastIDs = new Set()

module.exports = async (conn) => {

    console.log("✅ Live OTP Auto Forward Started")

    setInterval(async () => {
        try {

            const res = await axios.get(API_URL)

            if (!res.data || !res.data.status) return

            const data = res.data.result

            for (let item of data) {

                // Unique ID banane ke liye
                const uniqueID = item.number + item.received_at

                // Duplicate message rokne ke liye
                if (lastIDs.has(uniqueID)) continue
                lastIDs.add(uniqueID)

                // Stylish Message
                let msg = `
╔════〔 LIVE OTP ALERT 〕════╗

📡 Service: ${item.service}
⏰ Time: ${item.received_at}
🔒 OTP: Hidden

╚════════════════════╝
> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸*
`

                await conn.sendMessage(CHANNEL_ID, { text: msg })

            }

            // Memory clean rakhne ke liye
            if (lastIDs.size > 50) {
                lastIDs.clear()
            }

        } catch (err) {
            console.log("AUTO OTP ERROR:", err.message)
        }

    }, 60000) // 1 minute interval
}
