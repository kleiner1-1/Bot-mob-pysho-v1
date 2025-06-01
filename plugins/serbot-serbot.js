import { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } from '@whiskeysockets/baileys'
import pino from 'pino'
import fs from 'fs'

let handler = async (m, { conn }) => {
  const id = m.sender.split('@')[0]
  const sessionPath = `./BarbozaJadiBot/${id}`

  if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath, { recursive: true })
  const { state, saveCreds } = await useMultiFileAuthState(sessionPath)
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    logger: pino({ level: "silent" }),
    printQRInTerminal ['PyshoBot', 'Chrome', '1.0.0'],
    version: version,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" }).child({ level: "silent" }))
    }
  })

  let enviado = false

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', async (update) => {
    if (!enviado && typeof sock.requestPairingCode === 'function') {
      try {
        let secret = await sock.requestPairingCode(id)
        const code = secret.replace(/\D/g, '').slice(0, 8)
        if (code.length === 8) {
          await conn.reply(m.chat, `Tu código de PyshoBot es: *${code}*\n\nUsa este código de 8 dígitos en WhatsApp > Dispositivos vinculados > Vincular con número para iniciar sesión como sub-bot.`, m)
        } else {
          await conn.reply(m.chat, 'No se pudo generar el código de 8 dígitos, intenta más tarde.', m)
        }
        enviado = true
        setTimeout(() => {
          try { fs.rmSync(sessionPath, { recursive: true, force: true }) } catch { }
        }, 60000)
      } catch (e) {
        await conn.reply(m.chat, 'No se pudo generar el código, intenta más tarde.', m)
        enviado = true
      }
    }
  })
}

handler.help = ['pyshobot']
handler.tags = ['jadibot']
handler.command = ['pyshobot', 'serbot', 'code']

export default handler