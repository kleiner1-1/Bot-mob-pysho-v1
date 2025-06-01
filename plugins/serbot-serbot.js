import { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } from '@whiskeysockets/baileys'
import pino from 'pino'
import fs from 'fs'

let handler = async (m, { conn }) => {
  const id = m.sender.split('@')[0]
  const sessionPath = `./pyshobot-session/${id}`

  if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath, { recursive: true })
  const { state, saveCreds } = await useMultiFileAuthState(sessionPath)
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
    browser: ['PyshoBot', 'Chrome', '1.0.0'],
    version: version,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" }).child({ level: "silent" }))
    }
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', async (update) => {
    if (update.connection === 'connecting' && typeof sock.requestPairingCode === 'function') {
      try {
        let secret = await sock.requestPairingCode(id)
        const code = secret.replace(/\D/g, '').slice(0, 8)
        await conn.reply(m.chat, `Tu código de PyshoBot es: *${code}*`, m)
        setTimeout(() => {
          try { fs.rmSync(sessionPath, { recursive: true, force: true }) } catch { }
        }, 60000)
      } catch (e) {
        await conn.reply(m.chat, 'No se pudo generar el código, intenta más tarde.', m)
      }
    }
  })
}

handler.help = ['pyshobot']
handler.tags = ['jadibot']
handler.command = ['pyshobot', 'serbot', 'code']

export default handler