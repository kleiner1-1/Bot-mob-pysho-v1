import { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } from '@whiskeysockets/baileys'
import pino from 'pino'
import fs from 'fs'
const imageUrl = 'https://files.catbox.moe/sv8m42.jpg'

let handler = async (m, { conn }) => {
  const id = m.sender.split('@')[0]
  const sessionPath = `./pyshobot-session/${id}`
  if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath, { recursive: true })
  const { state, saveCreds } = await useMultiFileAuthState(sessionPath)
  const { version } = await fetchLatestBaileysVersion()
  const sock = make ['PyshoBot', 'Chrome', '1.0.0'],
    version: version,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" }).child({ level: "silent" }))
    }
  })
  sock.ev.on('creds.update', saveCreds)
  sock.ev.on('connection.update', async (update) => {
    if (typeof sock.requestPairingCode === 'function') {
      try {
        let secret = await sock.requestPairingCode(id)
        const code = secret.replace(/\D/g, '').slice(0, 8)
        if (code.length === 8) {
          await conn.sendMessage(m.chat, {
            image: { url: imageUrl },
            caption: `✰ Usa este código de 8 dígitos para ser sub-bot temporal:\n\n*${code}*\n\n- WhatsApp > Dispositivos vinculados > Vincular con número`
          }, { quoted: m })
        } else {
          await conn.reply(m.chat, 'No se pudo generar el código de 8 dígitos, intenta más tarde.', m)
        }
        setTimeout(() => {
          try { fs.rmSync(sessionPath, { recursive: true, force: true }) } catch { }
        }, 60000)
      } catch {
        await conn.reply(m.chat, 'No se pudo generar el código, intenta más tarde.', m)
      }
    }
  })
}

handler.help = ['serbot']
handler.tags = ['jadibot']
handler.command = ['serbot', 'pyshobot', 'code']

export default handler