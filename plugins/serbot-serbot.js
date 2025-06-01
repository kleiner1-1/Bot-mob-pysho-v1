import { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } from '@whiskeysockets/baileys'
import pino from 'pino'
import fs from 'fs'
import path from 'path'

let handler = async (m, { conn }) => {
  const id = m.sender.split('@')[0]
  const sessionPath = `./BarbozaJadiBot/${id}`

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

  sock.ev.once('connection.update', async (update) => {
    if (update.qr) return // Solo queremos el modo código

    if (update.pairingCode) {
      // pairingCode puede venir como 1234-5678-1234-5678, juntamos y extraemos los primeros 8 dígitos
      const code = update.pairingCode.replace(/\D/g, '').slice(0, 8)
      await conn.reply(m.chat, `Tu código de PyshoBot es: *${code}*`, m)
      setTimeout(() => {
        try { fs.rmSync(sessionPath, { recursive: true, force: true }) } catch { }
      }, 60000)
    } else if (sock.requestPairingCode) {
      let secret = await sock.requestPairingCode(id)
      // secret suele venir como 1234-5678, lo juntamos y mostramos solo 8 dígitos
      const code = secret.replace(/\D/g, '').slice(0, 8)
      await conn.reply(m.chat, `Tu código de PyshoBot es: *${code}*`, m)
      setTimeout(() => {
        try { fs.rmSync(sessionPath, { recursive: true, force: true }) } catch { }
      }, 60000)
    } else {
      await conn.reply(m.chat, 'No se pudo generar el código, inténtalo más tarde.', m)
    }
  })
}

handler.help = ['pyshobot']
handler.tags = ['jadibot']
handler.command = ['code']

export default handler