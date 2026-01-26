const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "ANAYAT-AI~eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiY0hreDYxZ050b0NmQUVsVVNadlpHMWNDZ2NpdFFVeWZhYXgrTStmZDlHMD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNzhneWdrL1Z1dDlaWEhJdVFaS1lLNXVOUVVrOTJlaklxRHNXNnZDMUFCZz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJBS0lER0hERldMbEdjaTBZZ2UxNTl0MkMwSUk5a1NhZWVHN1FxZldOM1VJPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJLUVRhVlFuaUhVS3NsVkpTNmdIV0lPbmRjTjQ1SGpYM2ZkbUlsR0dya2pBPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlNFY2RiblhKQXZpQ0c3OHZoRzZETTNWR1pEWThYbUN4Rm1xdldOUjhGbHM9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InRzeFF6NTV4NnNXN3B1bXYrdlkyTkVDNW52UWxEbE9Ba2xqUXpPbVQ1R2c9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiUUlNL3BBS0VsWEtLeVZGSUJXL2JqMU9nbHpVem5oajVlWHBPMGsyZWFrTT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiYVUxaTBFcDVFTy80L2s2RnFpMHlKR3paWXBvcFZ4OEJDQUk5ZmRBRnJEUT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ik5ydEUyWjNXeXY5dTlvTjFNYWlCYllEZVMraUQ0SWkwb0N0SHgyZHI2NFNRSDBHVTVmcDB1ODNZRDFiUXpNcVN1eUNQN2g0N2NVU0d4eWZDOFZ4amd3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6OTEsImFkdlNlY3JldEtleSI6IkF2YnV4VFNjRGsyeW8yZjhJcXM3NHFoa29OTVV1SFZkb3lmN1g1QU5LOGc9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbeyJrZXkiOnsicmVtb3RlSmlkIjoiOTIzMDg4MjEyMTQ0QHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IkE1NzFGNjZFQzE2NDA2MzA0RTNGNkI0MzlFN0I1Qzk0In0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3Njk0MTU3NjN9LHsia2V5Ijp7InJlbW90ZUppZCI6IjkyMzA4ODIxMjE0NEBzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiJBNUM3MEYxM0VBN0U4Q0M3NzFBRjM4Rjk5RkJDQzUyQiJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzY5NDE1NzYzfSx7ImtleSI6eyJyZW1vdGVKaWQiOiI5MjMwODgyMTIxNDRAcy53aGF0c2FwcC5uZXQiLCJmcm9tTWUiOnRydWUsImlkIjoiQTVCOEIwNEZBNzBFRjFFNzI0RDY1QkYwMDUxQjA5RTUifSwibWVzc2FnZVRpbWVzdGFtcCI6MTc2OTQxNTc2NH0seyJrZXkiOnsicmVtb3RlSmlkIjoiOTIzMDg4MjEyMTQ0QHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IkE1NjcwRkFENkQ3NUVCMDNDRTBERDI2QkVENjUyMzhBIn0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3Njk0MTU3NjV9XSwibmV4dFByZUtleUlkIjo4MTMsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjo4MTMsImFjY291bnRTeW5jQ291bnRlciI6MiwiYWNjb3VudFNldHRpbmdzIjp7InVuYXJjaGl2ZUNoYXRzIjpmYWxzZX0sInJlZ2lzdGVyZWQiOnRydWUsInBhaXJpbmdDb2RlIjoiWVVQUkFERVYiLCJtZSI6eyJpZCI6IjkyMzA4ODIxMjE0NDoyNkBzLndoYXRzYXBwLm5ldCIsIm5hbWUiOiLhtIDJtOG0gMqP4bSA4bSbIOG0i8mqybTJoiIsImxpZCI6IjIwOTA0MDk3NDA4MjEzMDoyNkBsaWQifSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ1AranBoc1F3TWpjeXdZWUFTQUFLQUE9IiwiYWNjb3VudFNpZ25hdHVyZUtleSI6Ill1Wlp5WHFDUWVoa0tjS1NHMzR6Umlxei9kV1p0elp1T3YyMnY5OVA5d3M9IiwiYWNjb3VudFNpZ25hdHVyZSI6ImxIUHdCaVRSWnZZMWNGK1IrUUZ5SDJTYWpvWDJFdzJIazBQZW9MSlRyaU5nK1A1SzFzWHBNRkVkbHRlREhiZy9NcCthbkFBU0k0aThValFZbUlYSURnPT0iLCJkZXZpY2VTaWduYXR1cmUiOiJ2T3VTaCtDQ2lnWnRvbzFMaFVJeWJnWHVZUXdUbi9kNWRyUXc0Y1B6ZkdhNENMSmIyWG9jSzhudXFtbkJnRDBRcmZScm9nZG1RaUN5b3NRazgybEFnUT09In0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6IjkyMzA4ODIxMjE0NDoyNkBzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJXTG1XY2w2Z2tIb1pDbkNraHQrTTBZcXMvM1ZtYmMyYmpyOXRyL2ZUL2NMIn19XSwicGxhdGZvcm0iOiJzbWJhIiwicm91dGluZ0luZm8iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJDQWdJQlFnTiJ9LCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3Njk0MTU3NTgsImxhc3RQcm9wSGFzaCI6IlBXazVCIiwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFOSUkifQ==",
// add your Session Id 
AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN || "false",
// make true or false status auto seen
AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || "false",
// make true if you want auto reply on status 
AUTO_STATUS_REACT: process.env.AUTO_STATUS_REACT || "false",
// make true if you want auto reply on status 
AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || "*𝚂𝙴𝙴𝙽 𝚈𝙾𝚄𝚁 𝚂𝚃𝙰𝚃𝚄𝚂 𝙱𝚈 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸 🤍*",
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
MENU_IMAGE_URL: process.env.MENU_IMAGE_URL || "https://files.catbox.moe/adhn5v.jpg",
// add custom menu and mention reply image url
PREFIX: process.env.PREFIX || ".",
// add your prifix for bot   
BOT_NAME: process.env.BOT_NAME || "ANAYAT-AI",
// add bot namw here for menu
STICKER_NAME: process.env.STICKER_NAME || "ANAYAT-AI",
// type sticker pack name 
CUSTOM_REACT: process.env.CUSTOM_REACT || "false",
// make this true for custum emoji react    
CUSTOM_REACT_EMOJIS: process.env.CUSTOM_REACT_EMOJIS || "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍",
// chose custom react emojis by yourself 
DELETE_LINKS: process.env.DELETE_LINKS || "false",
// automatic delete links witho remove member 
OWNER_NUMBER: process.env.OWNER_NUMBER || "923452401207",
// add your bot owner number
OWNER_NAME: process.env.OWNER_NAME || "𝙰𝙽𝙰𝚈𝙰𝚃 𝙷𝙰𝙲𝙺𝙴𝚁",
// add bot owner name
DESCRIPTION: process.env.DESCRIPTION || "*© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸 ❣️*",
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
