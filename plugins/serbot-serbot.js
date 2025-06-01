import { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } from '@whiskeysockets/baileys'
import pino from 'pino'
import fs from 'fs'
const imageUrl = 'https://files.catbox.moe/sv8m42.jpg'

let handler = async (m, { conn }) => {
  const id = m.sender.split('@')[0]
  const sessionPath = `./pyshobot-session/${id}`
  if (!fs.existsSync(sessionPath)) fs.mkdirSync })
  const { state, saveCreds } = await useMultiFileAuthState(sessionPath)
  const { version } = await fetchLatestBaileysVersion()
  const sock = makeWASocket({
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
    browser:: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" }).child({ level: "silent" }))
    }
  })
  sock.ev.on('creds.update', saveCreds)
  sock.ev.on('connection.update', async (update) => {
    if (typeof sock.requestPairingCode === 'function') {
      try {
        let pairing = await sock.requestPairingCode(id)
        pairing = pairing.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0,8)
        let code = pairing.slice(0,4) + '-' + pairing.slice(4,8)
        if (code.length === 9 && code.includes('-')) {
          await conn.sendMessage(m.chat, {
            image: { url: imageUrl },
            caption: `*CÓDIGO PARA SER SUB BOT*\n\nCopia y pega este código en WhatsApp > Dispositivos vinculados > Vincular con número:\n\n*${code}*`
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