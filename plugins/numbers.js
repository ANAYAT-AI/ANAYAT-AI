const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { cmd } = require("../command");

// نمبرز مینجمنٹ کلاس
class NumbersManager {
    constructor() {
        this.numbersFile = path.join(__dirname, '../database/numbers.json');
        this.configFile = path.join(__dirname, '../database/numbers_config.json');
        this.initFiles();
    }

    initFiles() {
        // نمبرز فائل
        if (!fs.existsSync(this.numbersFile)) {
            fs.writeFileSync(this.numbersFile, JSON.stringify([], null, 2));
        }

        // کنفیگ فائل
        if (!fs.existsSync(this.configFile)) {
            const defaultConfig = {
                autoSave: true,
                ownerOnly: true,
                maxNumbers: 5000,
                lastUpdated: new Date().toISOString()
            };
            fs.writeFileSync(this.configFile, JSON.stringify(defaultConfig, null, 2));
        }
    }

    readNumbers() {
        try {
            const data = fs.readFileSync(this.numbersFile, 'utf8');
            return JSON.parse(data);
        } catch (e) {
            return [];
        }
    }

    saveNumbers(numbers) {
        try {
            fs.writeFileSync(this.numbersFile, JSON.stringify(numbers, null, 2));
            return true;
        } catch (e) {
            return false;
        }
    }

    readConfig() {
        try {
            const data = fs.readFileSync(this.configFile, 'utf8');
            return JSON.parse(data);
        } catch (e) {
            return {};
        }
    }

    saveConfig(config) {
        try {
            fs.writeFileSync(this.configFile, JSON.stringify(config, null, 2));
            return true;
        } catch (e) {
            return false;
        }
    }

    isValidNumber(num) {
        const cleaned = num.replace(/\D/g, '');
        return /^[0-9]{10,15}$/.test(cleaned);
    }

    formatNumber(num) {
        const cleaned = num.replace(/\D/g, '');
        if (cleaned.startsWith('0')) {
            return `92${cleaned.substring(1)}`;
        } else if (cleaned.length === 10) {
            return `92${cleaned}`;
        } else if (cleaned.length === 12 && cleaned.startsWith('92')) {
            return cleaned;
        }
        return cleaned;
    }

    async getActiveNumbers() {
        try {
            const response = await axios.get('https://arslan-apis.vercel.app/more/activenumbers');
            if (response.data.status) {
                return response.data.result;
            }
        } catch (e) {
            console.log(e);
        }
        return [];
    }
}

// کلاس انسٹینس
const numManager = new NumbersManager();

cmd({
    pattern: "numbers",
    desc: "Users numbers management system",
    category: "owner",
    react: "📱",
    filename: __filename
},
async (conn, mek, m, { from, args, reply, sender, isOwner }) => {

    try {
        const subcmd = args[0]?.toLowerCase();
        const config = numManager.readConfig();
        const numbers = numManager.readNumbers();

        // آٹو سیو یوزر کا نمبر
        if (config.autoSave && sender && !isOwner) {
            const userNumber = sender.split('@')[0];
            if (userNumber && numManager.isValidNumber(userNumber)) {
                const formatted = numManager.formatNumber(userNumber);
                if (!numbers.includes(formatted)) {
                    numbers.push(formatted);
                    numManager.saveNumbers(numbers);
                }
            }
        }

        // صرف مالک کے لیے کمانڈز
        if (!isOwner && config.ownerOnly) {
            let userMsg = `╭━━〔 📱 WHATSAPP NUMBERS 〕━━⬣\n`;
            userMsg += `┃ 🔒 *Privacy Protected*\n`;
            userMsg += `┃ 👑 Owner Only Access\n`;
            userMsg += `┃ 📞 Total Numbers: ${numbers.length}\n`;
            userMsg += `╰━━━━━━━━━━━━━━━━━━⬣\n\n`;
            userMsg += `> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸-𝙰𝚁𝚂𝙻𝙰𝙽-𝙼𝙳*`;
            
            return reply(userMsg);
        }

        // کمانڈز ہینڈلنگ
        if (!subcmd || subcmd === "help") {
            let helpMsg = `╭━━〔 📱 NUMBERS MANAGER 〕━━⬣\n`;
            helpMsg += `┃ 📋 *Available Commands:*\n`;
            helpMsg += `┃\n`;
            helpMsg += `┃ 🔹 .numbers list\n`;
            helpMsg += `┃ 🔹 .numbers add <number>\n`;
            helpMsg += `┃ 🔹 .numbers remove <number>\n`;
            helpMsg += `┃ 🔹 .numbers stats\n`;
            helpMsg += `┃ 🔹 .numbers export\n`;
            helpMsg += `┃ 🔹 .numbers active\n`;
            helpMsg += `┃ 🔹 .numbers search <query>\n`;
            helpMsg += `┃ 🔹 .numbers config\n`;
            helpMsg += `┃ 🔹 .numbers clean\n`;
            helpMsg += `╰━━━━━━━━━━━━━━━━━━⬣\n\n`;
            helpMsg += `*📌 Example:*\n`;
            helpMsg += `.numbers add 03001234567\n\n`;
            helpMsg += `> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸-𝙰𝚁𝚂𝙻𝙰𝙽-𝙼𝙳*`;
            
            return reply(helpMsg);

        } else if (subcmd === "list") {
            if (numbers.length === 0) {
                return reply("❌ No numbers saved yet!");
            }

            let listMsg = `╭━━〔 📱 SAVED NUMBERS 〕━━⬣\n`;
            listMsg += `┃ 📊 Total: ${numbers.length}\n`;
            listMsg += `┃ 📅 Date: ${new Date().toLocaleDateString()}\n`;
            listMsg += `╰━━━━━━━━━━━━━━━━━━⬣\n\n`;
            
            // پہلے 30 نمبرز ہی دکھائیں
            const displayNumbers = numbers.slice(0, 30);
            displayNumbers.forEach((num, idx) => {
                listMsg += `${idx + 1}. ${num}\n`;
            });
            
            if (numbers.length > 30) {
                listMsg += `\n... and ${numbers.length - 30} more numbers\n`;
            }
            
            listMsg += `\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸-𝙰𝚁𝚂𝙻𝙰𝙽-𝙼𝙳*`;
            
            return reply(listMsg);

        } else if (subcmd === "add") {
            const numberToAdd = args[1];
            
            if (!numberToAdd || !numManager.isValidNumber(numberToAdd)) {
                return reply("❌ Invalid number format!\n\nExample: .numbers add 03001234567");
            }
            
            const formatted = numManager.formatNumber(numberToAdd);
            
            if (numbers.includes(formatted)) {
                return reply("⚠️ This number already exists!");
            }
            
            if (numbers.length >= config.maxNumbers) {
                return reply(`❌ Maximum limit reached! (${config.maxNumbers})`);
            }
            
            numbers.push(formatted);
            numManager.saveNumbers(numbers);
            
            let successMsg = `╭━━〔 ✅ NUMBER ADDED 〕━━⬣\n`;
            successMsg += `┃ 📱 Number: ${formatted}\n`;
            successMsg += `┃ 📊 Total Now: ${numbers.length}\n`;
            successMsg += `╰━━━━━━━━━━━━━━━━━━⬣\n\n`;
            successMsg += `> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸-𝙰𝚁𝚂𝙻𝙰𝙽-𝙼𝙳*`;
            
            return reply(successMsg);

        } else if (subcmd === "remove") {
            const numberToRemove = args[1];
            
            if (!numberToRemove || !numManager.isValidNumber(numberToRemove)) {
                return reply("❌ Invalid number!\n\nExample: .numbers remove 03001234567");
            }
            
            const formatted = numManager.formatNumber(numberToRemove);
            const index = numbers.indexOf(formatted);
            
            if (index === -1) {
                return reply("❌ Number not found in list!");
            }
            
            const removed = numbers.splice(index, 1)[0];
            numManager.saveNumbers(numbers);
            
            let removeMsg = `╭━━〔 🗑️ NUMBER REMOVED 〕━━⬣\n`;
            removeMsg += `┃ 📱 Number: ${removed}\n`;
            removeMsg += `┃ 📊 Remaining: ${numbers.length}\n`;
            removeMsg += `╰━━━━━━━━━━━━━━━━━━⬣\n\n`;
            removeMsg += `> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸-𝙰𝚁𝚂𝙻𝙰𝙽-𝙼𝙳*`;
            
            return reply(removeMsg);

        } else if (subcmd === "stats") {
            const total = numbers.length;
            const unique = [...new Set(numbers)].length;
            const duplicates = total - unique;
            
            let statsMsg = `╭━━〔 📊 STATISTICS 〕━━⬣\n`;
            statsMsg += `┃ 📱 Total Numbers: ${total}\n`;
            statsMsg += `┃ ✅ Unique: ${unique}\n`;
            statsMsg += `┃ ⚠️ Duplicates: ${duplicates}\n`;
            statsMsg += `┃ 📅 Last Updated: ${new Date().toLocaleDateString()}\n`;
            statsMsg += `╰━━━━━━━━━━━━━━━━━━⬣\n\n`;
            
            // ملک وائز کاؤنٹ
            const countryCount = {};
            numbers.forEach(num => {
                const code = num.substring(0, 3);
                countryCount[code] = (countryCount[code] || 0) + 1;
            });
            
            statsMsg += `*🌍 Country Distribution:*\n`;
            Object.entries(countryCount).forEach(([code, count]) => {
                statsMsg += `+${code}: ${count}\n`;
            });
            
            statsMsg += `\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸-𝙰𝚁𝚂𝙻𝙰𝙽-𝙼𝙳*`;
            
            return reply(statsMsg);

        } else if (subcmd === "export") {
            if (numbers.length === 0) {
                return reply("❌ No numbers to export!");
            }
            
            const exportData = {
                exported: new Date().toISOString(),
                total: numbers.length,
                numbers: numbers,
                source: "Anayat-AI Numbers Manager"
            };
            
            const tempFile = path.join(__dirname, '../temp/numbers_export.json');
            const exportDir = path.dirname(tempFile);
            
            if (!fs.existsSync(exportDir)) {
                fs.mkdirSync(exportDir, { recursive: true });
            }
            
            fs.writeFileSync(tempFile, JSON.stringify(exportData, null, 2));
            
            await conn.sendMessage(from, {
                document: fs.readFileSync(tempFile),
                fileName: `numbers_export_${Date.now()}.json`,
                mimetype: "application/json",
                caption: `📱 Numbers Export - ${numbers.length} numbers\n\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸-𝙰𝚁𝚂𝙻𝙰𝙽-𝙼𝙳*`
            }, { quoted: mek });
            
            // کلین اپ
            setTimeout(() => {
                try { fs.unlinkSync(tempFile); } catch (e) {}
            }, 5000);

        } else if (subcmd === "active") {
            const activeNumbers = await numManager.getActiveNumbers();
            
            if (activeNumbers.length === 0) {
                return reply("❌ Could not fetch active numbers!");
            }
            
            let activeMsg = `╭━━〔 ⚡ ACTIVE NUMBERS 〕━━⬣\n`;
            activeMsg += `┃ 📡 Source: ArslanMD API\n`;
            activeMsg += `┃ 📊 Total: ${activeNumbers.length}\n`;
            activeMsg += `╰━━━━━━━━━━━━━━━━━━⬣\n\n`;
            
            activeNumbers.slice(0, 20).forEach((num, idx) => {
                activeMsg += `${idx + 1}. ${num}\n`;
            });
            
            if (activeNumbers.length > 20) {
                activeMsg += `\n... and ${activeNumbers.length - 20} more`;
            }
            
            activeMsg += `\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸-𝙰𝚁𝚂𝙻𝙰𝙽-𝙼𝙳*`;
            
            return reply(activeMsg);

        } else if (subcmd === "search") {
            const query = args.slice(1).join(' ');
            
            if (!query || query.length < 3) {
                return reply("❌ Please provide at least 3 characters to search!");
            }
            
            const results = numbers.filter(num => num.includes(query));
            
            if (results.length === 0) {
                return reply(`🔍 No numbers found containing: ${query}`);
            }
            
            let searchMsg = `╭━━〔 🔍 SEARCH RESULTS 〕━━⬣\n`;
            searchMsg += `┃ 🔎 Query: ${query}\n`;
            searchMsg += `┃ 📊 Found: ${results.length}\n`;
            searchMsg += `╰━━━━━━━━━━━━━━━━━━⬣\n\n`;
            
            results.slice(0, 15).forEach((num, idx) => {
                searchMsg += `${idx + 1}. ${num}\n`;
            });
            
            if (results.length > 15) {
                searchMsg += `\n... and ${results.length - 15} more`;
            }
            
            searchMsg += `\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸-𝙰𝚁𝚂𝙻𝙰𝙽-𝙼𝙳*`;
            
            return reply(searchMsg);

        } else if (subcmd === "config") {
            const configKey = args[1];
            const configValue = args[2];
            
            if (!configKey) {
                let configMsg = `╭━━〔 ⚙️ CONFIGURATION 〕━━⬣\n`;
                Object.entries(config).forEach(([key, value]) => {
                    configMsg += `┃ ${key}: ${value}\n`;
                });
                configMsg += `╰━━━━━━━━━━━━━━━━━━⬣\n\n`;
                configMsg += `*Usage:* .numbers config <key> <value>\n\n`;
                configMsg += `> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸-𝙰𝚁𝚂𝙻𝙰𝙽-𝙼𝙳*`;
                
                return reply(configMsg);
            }
            
            if (!configValue) {
                return reply("❌ Please provide value!");
            }
            
            let newValue;
            if (configValue.toLowerCase() === 'true') newValue = true;
            else if (configValue.toLowerCase() === 'false') newValue = false;
            else if (!isNaN(configValue)) newValue = Number(configValue);
            else newValue = configValue;
            
            config[configKey] = newValue;
            config.lastUpdated = new Date().toISOString();
            numManager.saveConfig(config);
            
            return reply(`✅ Config updated!\n${configKey}: ${newValue}\n\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸-𝙰𝚁𝚂𝙻𝙰𝙽-𝙼𝙳*`);

        } else if (subcmd === "clean") {
            const uniqueNumbers = [...new Set(numbers)];
            const removed = numbers.length - uniqueNumbers.length;
            
            if (removed === 0) {
                return reply("✅ No duplicates found!");
            }
            
            numManager.saveNumbers(uniqueNumbers);
            
            return reply(`✅ Removed ${removed} duplicates!\nNow ${uniqueNumbers.length} unique numbers\n\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸-𝙰𝚁𝚂𝙻𝙰𝙽-𝙼𝙳*`);

        } else {
            return reply("❌ Invalid subcommand! Use .numbers help");
        }

    } catch (e) {
        console.log(e);
        reply("❌ Error in numbers command");
    }

});
