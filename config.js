const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "ANAYAT-AI~eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiOE80ZUNmZm54Z2J0aTczOW8xOWw4Y0w2cTFUZ01VSzgzNE5YVmc4TkpHTT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRG5CV1hXOWZmMzZxRUp3Q2xtVkd0c3BrQ3Q1T3FrYkxEZldyTHpqRnBUND0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJLUFdXTi9vcmxQUDBVMk9ZUWZDMTBWMFo3QkVNd04veGVXdm9URG5mdFc4PSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJtSU4rOC93V1ZrUGN2V1RrV2d6OU5GV25PNnZIZ25CVy96WFpzSEIyQ2xZPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InFFbkZSdkd6TWdPV2JRQXJDT3ltRGx2dEx6bm1HTFFYdHgwOUY0UU16SGc9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IldjM2N5emFwNCt1VVkwMnZ0RlREb1RuVklXeUZNN1NpUFJmUVkrbzF1Mmc9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiT0JELzlLM2pYT1MwZ1ZDVTFWTWZ0dEFHUThWM3hxcXFic2IrN0JlcVJIST0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiVzRxQTQ1U3EzeHJuMDRkKy9BaFZrTHF5WG5BbDNJeFY5a0dzdHBoaWptQT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IndTcmVhcVFsU1hjV1hGaUlpL0pwR1c5d1F3MnNCRktUUHF4TC9WV1VJSno4ekorUVZMM0xKVFJrU2ZQQkpsc1g5WldDeXhWY3ZGeDYwODdjT0E2Q2d3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjM3LCJhZHZTZWNyZXRLZXkiOiJGM2VNQ1JUTS9BSEQ4QzlZcjl3bmN0VDRMRVVldlNiZzNZUjAwVGhla21rPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W3sia2V5Ijp7InJlbW90ZUppZCI6IjI0MTA1ODI5MzY5QHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IkE1Q0M0RkYzRjYyMjI5OTQ4M0VFNEIyRUY5NDdFMTE0In0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3NjgwNzA5Mjh9LHsia2V5Ijp7InJlbW90ZUppZCI6IjI0MTA1ODI5MzY5QHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IkE1NzMzQkMzQTQ1RDUyNjJCNDc3MEMxMzQ2NEQ3REEzIn0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3NjgwNzA5Mjh9LHsia2V5Ijp7InJlbW90ZUppZCI6IjI0MTA1ODI5MzY5QHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IkE1RTE3OTFBMjBENDhBRjEyNzFFRTVGQ0VGNDA0MzM0In0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3NjgwNzA5Mjh9LHsia2V5Ijp7InJlbW90ZUppZCI6IjI0MTA1ODI5MzY5QHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IkE1NDg4RTg4ODVDQUNGMkQ1NDE5MDU4NEJDMTcyRUNGIn0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3NjgwNzA5MzF9LHsia2V5Ijp7InJlbW90ZUppZCI6IjI0MTA1ODI5MzY5QHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IkE1NEFENTBCNDFCQkJDOTI5N0ZBMkY5QjQ0NTU2M0VCIn0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3NjgwNzA5MzJ9LHsia2V5Ijp7InJlbW90ZUppZCI6IjI0MTA1ODI5MzY5QHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IkE1RkJFNEQ0MDFCRjQ1NDZCQzVCQ0VEMzkwMzUwMUJDIn0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3NjgwNzA5MzR9XSwibmV4dFByZUtleUlkIjo4MTMsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjo4MTMsImFjY291bnRTeW5jQ291bnRlciI6MywiYWNjb3VudFNldHRpbmdzIjp7InVuYXJjaGl2ZUNoYXRzIjpmYWxzZX0sInJlZ2lzdGVyZWQiOnRydWUsInBhaXJpbmdDb2RlIjoiWVVQUkFERVYiLCJtZSI6eyJpZCI6IjI0MTA1ODI5MzY5OjJAcy53aGF0c2FwcC5uZXQiLCJuYW1lIjoiQ2xlcnZ5IiwibGlkIjoiMTM2OTc1NzY4MTIxMzg4OjJAbGlkIn0sImFjY291bnQiOnsiZGV0YWlscyI6IkNLTzkxNTRCRVAyOWlzc0dHQUlnQUNnQSIsImFjY291bnRTaWduYXR1cmVLZXkiOiJUZmkwbnp5RGp5MG1SMm11aUNLeGZBRGh4YVFwWXZXZHg5ZlhrV0FXUmhRPSIsImFjY291bnRTaWduYXR1cmUiOiJxQVYrdnV3QVlKRjMrUXY1cVF6L1VTTmIvcVl4S3VGL1J1NFNGTmJVcG0xV2NSWjRvd1JPRlJ4SkJpdmtmNnV1VlYrSitYYjJQWWtFQWV4bTBrb1JCUT09IiwiZGV2aWNlU2lnbmF0dXJlIjoiQkt3VFVYdi85cjkwUWFVa1RRZFRGUkdrV012Vllxc3l2elliYzhwd2ZrTzJXaVZWTU5NMjM2UC9VKzdETUUzNTY4KzEzTHQvbk9WR1FaVi9DbDZwZ3c9PSJ9LCJzaWduYWxJZGVudGl0aWVzIjpbeyJpZGVudGlmaWVyIjp7Im5hbWUiOiIyNDEwNTgyOTM2OToyQHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQlUzNHRKODhnNDh0SmtkcHJvZ2lzWHdBNGNXa0tXTDFuY2ZYMTVGZ0ZrWVUifX1dLCJwbGF0Zm9ybSI6InNtYmEiLCJyb3V0aW5nSW5mbyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkNBVUlFZ2dOIn0sImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTc2ODA3MDkyNSwibGFzdFByb3BIYXNoIjoibm0zQmIiLCJteUFwcFN0YXRlS2V5SWQiOiJBQUFBQUh6QiJ9",
// add your Session Id 
AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN || "false",
// make true or false status auto seen
AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || "false",
// make true if you want auto reply on status 
AUTO_STATUS_REACT: process.env.AUTO_STATUS_REACT || "false",
// make true if you want auto reply on status 
AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || "*𝚂𝙴𝙴𝙽 𝚈𝙾𝚄𝚁 𝚂𝚃𝙰𝚃𝚄𝚂 𝙱𝚈 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸 🤍*",
// set the auto reply massage on status reply  
ANTI_DELETE: process.env.ANTI_DELETE || "true",
// set true false for anti delete     
ANTI_DEL_PATH: process.env.ANTI_DEL_PATH || "same", 
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
BOT_NAME: process.env.BOT_NAME || "CLERVY-IA",
// add bot namw here for menu
STICKER_NAME: process.env.STICKER_NAME || "GLOIRE-AI",
// type sticker pack name 
CUSTOM_REACT: process.env.CUSTOM_REACT || "true",
// make this true for custum emoji react    
CUSTOM_REACT_EMOJIS: process.env.CUSTOM_REACT_EMOJIS || "🙌,😭,🙌🏾,💫,🤍,😒,🤣",
// chose custom react emojis by yourself 
DELETE_LINKS: process.env.DELETE_LINKS || "false",
// automatic delete links witho remove member 
OWNER_NUMBER: process.env.OWNER_NUMBER || "24165829369",
// add your bot owner number
OWNER_NAME: process.env.OWNER_NAME || "𝕮𝖑𝖊𝖗𝖛𝖞 𝖇𝖔𝖙",
// add bot owner name
DESCRIPTION: process.env.DESCRIPTION || "*© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝕮𝖑𝖊𝖗𝖛𝖞 𝖇𝖔𝖙*",
// add bot owner name    
ALIVE_VID: process.env.ALIVE_VID || "https://files.catbox.moe/2myos8.mp4",
// add img for alive msg
LIVE_MSG: process.env.LIVE_MSG || "𝚉𝙸𝙽𝙳𝙰 𝙷𝚄𝙽 𝚈𝙰𝚁 🤖",
// add alive msg here 
READ_MESSAGE: process.env.READ_MESSAGE || "true",
// Turn true or false for automatic read msgs
AUTO_REACT: process.env.AUTO_REACT || "true",
// make this true or false for auto react on all msgs
ANTI_BAD: process.env.ANTI_BAD || "false",
// false or true for anti bad words  
MODE: process.env.MODE || "inbox",
// make bot public-private-inbox-group 
ANTI_LINK_KICK: process.env.ANTI_LINK_KICK || "false",
// make anti link true,false for groups 
AUTO_STICKER: process.env.AUTO_STICKER || "true",
// make true for automatic stickers 
AUTO_REPLY: process.env.AUTO_REPLY || "false",
// make true or false automatic text reply 
ALWAYS_ONLINE: process.env.ALWAYS_ONLINE || "true",
// maks true for always online 
PUBLIC_MODE: process.env.PUBLIC_MODE || "false",
// make false if want private mod
AUTO_TYPING: process.env.AUTO_TYPING || "true",
// true for automatic show typing   
READ_CMD: process.env.READ_CMD || "true",
// true if want mark commands as read 
DEV: process.env.DEV || "24165829369",
//replace with your whatsapp number        
ANTI_VV: process.env.ANTI_VV || "true",
// true for anti once view 
AUTO_RECORDING: process.env.AUTO_RECORDING || "false"
// make it true for auto recoding 
};
