/* 
RECONEXIÓN DE SUBBOTS AUTOMÁTICA AL REINICIAR EL BOT
by github.com/DIEGO-OFC adaptado para BarbozaBot
*/

import fs from 'fs'
import path from 'path'
import pino from 'pino'
import chalk from 'chalk'
import { 
  makeWASocket, 
  useMultiFileAuthState, 
  makeCacheableSignalKeyStore, 
  fetchLatestBaileysVersion,
  DisconnectReason
} from '@whiskeysockets/baileys'

global.conns = global.conns || []

export async function connectSubBots() {
  try {
    const subBotDir = './BarbozaJadiBot/'
    if (!fs.existsSync(subBotDir)) {
      console.log(chalk.yellow('ℹ️ No hay subbots para reconectar.'))
      return
    }

    const folders = fs.readdirSync(subBotDir).filter(folder => {
      const folderPath = path.join(subBotDir, folder)
      return fs.existsSync(path.join(folderPath, 'creds.json'))
    })

    if (folders.length === 0) {
      console.log(chalk.yellow('ℹ️ No se encontraron credenciales de subbots.'))
      return
    }

    console.log(chalk.blue(`🔍 Intentando reconectar ${folders.length} subbot(s)...`))

    for (const folder of folders) {
      try {
        const folderPath = path.join(subBotDir, folder)
        const { state, saveCreds } = await useMultiFileAuthState(folderPath)
        const { version } = await fetchLatestBaileysVersion()

        const conn = makeWASocket({
          logger: pino({ level: 'silent' }),
          printQRInTerminal: false,
          browser: ['BarbozaBot-AI', 'Desktop', '1.0.0'],
          auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }))
          },
          markOnlineOnConnect: true,
          generateHighQualityLinkPreview: true,
          version
        })

        conn.ev.on('connection.update', (update) => {
          const { connection, lastDisconnect } = update
          if (connection === 'close') {
            const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
            if (code === DisconnectReason.loggedOut) {
              console.log(chalk.red(`❌ Subbot ${folder} cerró sesión, eliminando credenciales...`))
              fs.rmSync(folderPath, { recursive: true, force: true })
            }
            console.log(chalk.yellow(`⚠️ Subbot ${folder} desconectado, intentando reconectar...`))
            setTimeout(() => connectSubBots(), 10000)
          } else if (connection === 'open') {
            console.log(chalk.green(`✅ Subbot reconectado: ${folder}`))
          }
        })

        conn.ev.on('creds.update', saveCreds)
        setTimeout(() => {
          if (!conn.user) {
            console.log(chalk.yellow(`⚠️ Subbot ${folder} no se conectó, reintentando...`))
            conn.ws.close()
          }
        }, 5000)
        const existingIndex = global.conns.findIndex(c => c.user?.jid === conn.user?.jid)
        if (existingIndex >= 0) {
          global.conns[existingIndex] = conn
        } else {
          global.conns.push(conn)
        }

      } catch (e) {
        console.error(chalk.red(`❌ Error al reconectar subbot ${folder}:`), e)
      }
    }
  } catch (error) {
    console.error(chalk.red('❌ Error en connectSubBots:'), error)
  }
                   }
