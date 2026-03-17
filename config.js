const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID ||"ANAYAT-AI~eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiZ0VLVHZ3RmEzL0loUUFmYzh0NEltSEJodmpCaExSOTVJVjQ3UHp1QlgwUT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiSmJSLy83M1JZVW01akdDS3AvOTBKNGpDdjNtT3RyYVVsWUhOeTFocUgwbz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI4SGtRSmU3aGFTR1J5U2pQVWJIRSt5TjBCdklPeXpoQWYzMWFIM2xOTjJZPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJqaS9IZVZaNGkyZ1dlUXFYbUlQM29QY2ZNeHpodjk1WE8rNkR2VkRMVG0wPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IllBNTVYWjZxSDhZMzJhMk9jK2w0d2UrcWo2TEZQOEtRVjdvSFhPQVdtbjA9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlhtNmhlekIyU3JtZThHQzBzdCtEa3dkd3pUK1MzdW83VkRPREJVUml4UVk9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiS05nZ20xN3cxWmVlNzcyMjBRT0h2a1FrQzVtOFgwY2tQYndoOE92ZmpVdz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiTTFwaTVDVkJ2SFFRNlFPTDRpdHRVbnFJSlB1UkRadEQyQjNPTWNDc1F6Yz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImZFV3RSaUd0NGhtRVFOMHBRMHZTbnpQZnBEU0wvei9KbTU3Y1poY1Q4a2hDd3F0d2RUYyszTHhTcW11bjVNdXZDdytaSlRyOVErMWh5dlhNTTVnTUNRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTU2LCJhZHZTZWNyZXRLZXkiOiI3eC9pK282ZTNoekRiUnRMWXVVQzgwcXpnUWc4SlFXNWE2NXZyRVRyZ2NNPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W3sia2V5Ijp7InJlbW90ZUppZCI6IjI1NDExMjI1MTcyNUBzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiJBNTBCOTQxMzlBMEQ2RUYxQkUxMzM1NjAzNjU2MDFDMCJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzcwNzE4MjI1fSx7ImtleSI6eyJyZW1vdGVKaWQiOiIyNTQxMTIyNTE3MjVAcy53aGF0c2FwcC5uZXQiLCJmcm9tTWUiOnRydWUsImlkIjoiQTVGRjg1OTBDN0EzRjVGN0JBODBCMjYyMDg2QTMyQjAifSwibWVzc2FnZVRpbWVzdGFtcCI6MTc3MDcxODIyNX0seyJrZXkiOnsicmVtb3RlSmlkIjoiMjU0MTEyMjUxNzI1QHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IkE1Q0Q2NkZCNTIwOERCNDc2OTJDNzZEMkZFMDg4NUQ4In0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3NzA3MTgyMjV9LHsia2V5Ijp7InJlbW90ZUppZCI6IjI1NDExMjI1MTcyNUBzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiJBNTlERDVDMzdEMzFFRUJDNEM5MEQ1MjUwQ0VBODgzMiJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzcwNzE4MjI1fV0sIm5leHRQcmVLZXlJZCI6ODEzLCJmaXJzdFVudXBsb2FkZWRQcmVLZXlJZCI6ODEzLCJhY2NvdW50U3luY0NvdW50ZXIiOjEsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJyZWdpc3RlcmVkIjp0cnVlLCJwYWlyaW5nQ29kZSI6IllVUFJBREVWIiwibWUiOnsiaWQiOiIyNTQxMTIyNTE3MjU6N0BzLndoYXRzYXBwLm5ldCIsIm5hbWUiOiJFbGlzaGEgTXRldWxlIiwibGlkIjoiNzMxOTEwNDEwMTU5MTA6N0BsaWQifSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ0tHVyttZ1EvWWVzekFZWUFTQUFLQUE9IiwiYWNjb3VudFNpZ25hdHVyZUtleSI6IlFGS2ZVQzJVL28zVjZWQUF6K1Z5VmRxQzBYb0c4SmVtcWdCZUw4ZDBMa1E9IiwiYWNjb3VudFNpZ25hdHVyZSI6IjA5UlhpRUxrdVlRbGVGL0V2RndqeE9rc3Vnd2x4K0hhZHEvbllzdzhUM2VaRmY4c2ppSzFSclIxdElTek5rMGhoRUFWMFkwMjN0L2tCRWE5V0xMSENBPT0iLCJkZXZpY2VTaWduYXR1cmUiOiI0aURtWlBmK3B4SGwvS3d2Wm9aZEN1cEZDZnhhV2dOS1dpN1lXcVVuaCt6Vnc5c2xIRFFWRzVOMmIvak1teDdLUjE4YmJvR2d2RVVRSDdtWjlPcTlDZz09In0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6IjI1NDExMjI1MTcyNTo3QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQlVCU24xQXRsUDZOMWVsUUFNL2xjbFhhZ3RGNkJ2Q1hwcW9BWGkvSGRDNUUifX1dLCJwbGF0Zm9ybSI6InNtYmEiLCJyb3V0aW5nSW5mbyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkNBVUlFZ2dJIn0sImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTc3MDcxODIxOSwibGFzdFByb3BIYXNoIjoiUFdrNUIiLCJteUFwcFN0YXRlS2V5SWQiOiJBQUFBQUk4WiJ9",
// add your Session Id 
AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN || "false",
// make true or false status auto seen
AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || "false",
// make true if you want auto reply on status 
AUTO_STATUS_REACT: process.env.AUTO_STATUS_REACT || "false",
// make true if you want auto reply on status 
AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || "*𝚂𝙴𝙴𝙽 𝚈𝙾𝚄𝚁 𝚂𝚃𝙰𝚃𝚄𝚂 𝙱𝚈 MR.PING 𝙰𝙸 🤍*",
// set the auto reply massage on status reply  
ANTI_DELETE: process.env.ANTI_DELETE || "false",
// set true false for anti delete     
ANTI_DEL_PATH: process.env.ANTI_DEL_PATH || "inbox", 
// change it to 'same' if you want to resend deleted message in same chat     
WELCOME: process.env.WELCOME || "false",
// true if want welcome and goodbye msg in groups    
ADMIN_EVENTS: process.env.ADMIN_EVENTS || "false",
// make true to know who dismiss or promoted a member in group
ANTI_LINK: process.env.ANTI_LINK || "false",
// make anti link true,false for groups 
MENTION_REPLY: process.env.MENTION_REPLY || "false",
// make true if want auto voice reply if someone menetion you 
MENU_IMAGE_URL: process.env.MENU_IMAGE_URL || "https://files.catbox.moe/hhk8i3.jpg",
// add custom menu and mention reply image url
PREFIX: process.env.PREFIX || ".",
// add your prifix for bot   
BOT_NAME: process.env.BOT_NAME || "MR.PING",
// add bot namw here for menu
STICKER_NAME: process.env.STICKER_NAME || "Mteule-AI",
// type sticker pack name 
CUSTOM_REACT: process.env.CUSTOM_REACT || "false",
// make this true for custum emoji react    
CUSTOM_REACT_EMOJIS: process.env.CUSTOM_REACT_EMOJIS || "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍",
// chose custom react emojis by yourself 
DELETE_LINKS: process.env.DELETE_LINKS || "false",
// automatic delete links witho remove member 
OWNER_NUMBER: process.env.OWNER_NUMBER || "254112251725",
// add your bot owner number
OWNER_NAME: process.env.OWNER_NAME || "MTEULE",
// add bot owner name
DESCRIPTION: process.env.DESCRIPTION || "*© ᴘᴏᴡᴇʀᴇᴅ ʙʏ MR.PING 𝙰𝙸 ❣️*",
// add bot owner name    
ALIVE_VID: process.env.ALIVE_VID || "https://files.catbox.moe/2myos8.mp4",
// add img for alive msg
LIVE_MSG: process.env.LIVE_MSG || "𝚉𝙸𝙽𝙳𝙰 𝙷𝚄𝙽 𝚈𝙰𝚁 🤖",
// add alive msg here 
READ_MESSAGE: process.env.READ_MESSAGE || "false",
// Turn true or false for automatic read msgs
AUTO_REACT: process.env.AUTO_REACT || "false",
// make this true or false for auto react on all msgs
ANTI_BAD: process.env.ANTI_BAD || "false",
// false or true for anti bad words  
MODE: process.env.MODE || "public",
// make bot public-private-inbox-group 
ANTI_LINK_KICK: process.env.ANTI_LINK_KICK || "false",
// make anti link true,false for groups 
AUTO_STICKER: process.env.AUTO_STICKER || "false",
// make true for automatic stickers 
AUTO_REPLY: process.env.AUTO_REPLY || "false",
// make true or false automatic text reply 
ALWAYS_ONLINE: process.env.ALWAYS_ONLINE || "false",
// maks true for always online 
PUBLIC_MODE: process.env.PUBLIC_MODE || "true",
// make false if want private mod
AUTO_TYPING: process.env.AUTO_TYPING || "false",
// true for automatic show typing   
READ_CMD: process.env.READ_CMD || "false",
// true if want mark commands as read 
DEV: process.env.DEV || "923452401207",
//replace with your whatsapp number        
ANTI_VV: process.env.ANTI_VV || "false",
// true for anti once view 
AUTO_RECORDING: process.env.AUTO_RECORDING || "false"
// make it true for auto recoding 
};
