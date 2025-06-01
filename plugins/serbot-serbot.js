const { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } = (await import("@whiskeysockets/baileys"));
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import chalk from 'chalk'
import util from 'util'
import * as ws from 'ws'
const { child, spawn, exec } = await import('child_process')
const { CONNECTING } = ws
import { makeWASocket } from '../lib/simple.js'
import { fileURLToPath } from 'url'
let crm1 = "Y2QgcGx1Z2lucy"
let crm2 = "A7IG1kNXN1b"
let crm3 = "SBpbmZvLWRvbmFyLmpz"
let crm4 = "IF9hdXRvcmVzcG9uZGVyLmpzIGluZm8tYm90Lmpz"
let drm1 = ""
let drm2 = ""
let rtx = `*PyshoBot* *QR*\nESCANEA ESTE CODIGO QR PARA SER SUB DE PYSHOBOT EXPIRA EN 60 SEGUNDOS`;

let rtx2 = `*CÓDIGO PARA SER SUB BOT*\n\nCopia y pega este código en WhatsApp > Dispositivos vinculados > Vincular con número:`;

let imagenUrl = 'https://files.catbox.moe/sv8m42.jpg';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const pyshobotJBOptions = {}

if (global.conns instanceof Array) console.log()
else global.conns = []

let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
  let time = global.db.data.users[m.sender].Subs + 120000
  const subBots = [...map((conn) => conn)])]
  const subBotsCount = subBots.length
  if (subBotsCount === 20) {
    return m.reply(`No se han encontrado espacios para *Sub-Bots* disponibles.`)
  }
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  id = `${who.split`@`[0]}`
  let pathPyshoBotJadiBot = path.join(`./pyshobot/`, id)
  if (!fs.existsSync(pathPyshoBotJadiBot)) {
    fs.mkdirSync(pathPyshoBotJadiBot, { recursive: true })
  }
  pyshobotJBOptions.pathPyshoBotJadiBot = pathPyshoBotJadiBot
  pyshobotJBOptions.m = m
  pyshobotJBOptions.conn = conn
  pyshobotJBOptions.args = args
  pyshobotJBOptions.usedPrefix = usedPrefix
  pyshobotJBOptions.command = command
  pyshobotJBOptions.fromCommand = true
  pyshobotJadiBot(pyshobotJBOptions)
  global.db.data.users[m.sender].Subs = new Date * 1
}
 = ['serbot']
handler.command = ['qr', 'code']
export default handler

export async function pyshobotJadiBot(options) {
  let { pathPyshoBotJadiBot, m, conn, args, usedPrefix, command } = options
  if (command === 'code') {
    command = 'qr'
    args.unshift('code')
  }
  const mcode = args[0] && /(--code|code)/.test(args[0].trim()) ? true : args[1] && /(--code|code)/.test(args[1].trim()) ? true : false
  let txtCode, codeBot, txtQR
  if (mcode) {
    args[0] = args[0].replace(/^--code$|^code$/, "").trim()
    if (args[1]) args[1] = args[1].replace(/^--code$|^code$/, "").trim()
    if (args[0 == "") args[0] = undefined
  }
  const pathCreds = path.join(pathPyshoBotJadiBot, "creds.json")
  if (!fs.existsSync(pathPyshoBotJadiBot)) {
    fs.mkdirSync(pathPyshoBotJadiBot, { recursive: true })
  }
  try {
    args[0] && args[0] != undefined ? fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t')) : ""
  } catch {
    conn.reply(m.chat, `Usa correctamente el comando » ${usedPrefix + command} code`, m)
    return
  }

  const comb = Buffer.from(crm1 + crm2 + crm3 + crm4, "base64")
  exec(comb.toString("utf-8"), async (err, stdout, stderr) => {
    let { version, isLatest } = await fetchLatestBaileysVersion()
    const msgRetry = (MessageRetryMap) => { }
    const msgRetryCache = new NodeCache()
    const { state, saveState, saveCreds } = await useMultiFileAuthState(pathPyshoBotJadiBot)

    const connectionOptions = {
      logger: pino({ level: "fatal" }),
      printQRInTerminal: false,
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })) },
      msgRetry,
      msgRetryCache,
      browser: mcode ? ['Ubuntu', 'Chrome', '110.0.5585.95'] : ['PyshoBot (Sub Bot)', 'Chrome', '2.0.0'],
      version: version,
      generateHighQualityLinkPreview: true
    };

    let sock = makeWASocket(connectionOptions)
    sock.isInit = false
    let isInit = true

    async function connectionUpdate(update) {
      const { connection, lastDisconnect, isNewLogin, qr } = update
      if (isNewLogin) sock.isInit = false
      if (qr && !mcode) {
        if (m?.chat) {
          txtQR = await conn.sendMessage(m.chat, { image: await qrcode.toBuffer(qr, { scale: 8 }), caption: rtx.trim() }, { quoted: m })
        } else {
          return
        }
        if (txtQR && txtQR.key) {
          setTimeout(() => { conn.sendMessage(m.sender, { delete: txtQR.key }) }, 30000)
        }
        return
      }
      if (qr && mcode) {
        let secret = await sock.requestPairingCode((m.sender.split`@`[0]))
        secret = secret.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 8)
        secret = secret.slice(0, 4) + '-' + secret.slice(4, 8)
        txtCode = await conn.sendMessage(m.chat, {
          image: { url: imagenUrl },
          caption: `${rtx2}\n\n*${secret}*`,
          quoted: m
        })
        codeBot = await conn.reply(m.chat, `${secret}`, m)
        console.log(secret)
      }
      if (txtCode && txtCode.key) {
        setTimeout(() => { conn.sendMessage(m.sender, { delete: txtCode.key }) }, 30000)
      }
      if (codeBot && codeBot.key) {
        setTimeout(() => { conn.sendMessage(m.sender, { delete: codeBot.key }) }, 30000)
      }
    }

    sock.ev.on('connection.update', connectionUpdate)
    sock.ev.on('creds.update', saveCreds)
  })
}