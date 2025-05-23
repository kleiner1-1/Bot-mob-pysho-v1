import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, watch, rmSync, promises as fs} from "fs"
import path, { join } from 'path'

let handler  = async (m, { conn: parentw, usedPrefix, command}, args) => {

let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let uniqid = `${who.split`@`[0]}`
let userS = `${conn.getName(who)}`

try {
await fs.rmdir("./BajobotsJadiBot/" + uniqid, { recursive: true, force: true })
await parentw.sendMessage(m.chat, { text: '🚩 Sub-Bot eliminado.' }, { quoted: fkontak })
} catch(err) {
if (err.code === 'ENOENT' && err.path === `./BajobotsJadiBot/${uniqid}`) {
await parentw.sendMessage(m.chat, { text: "🌠 No cuentas con ninguna sesión de Sub-Bot." }, { quoted: fkontak })
} else {
await m.react(error)
}}}
handler.tags = ['serbot']
handler.help = ['delsession']
handler.command = /^(delsession|delsubbot)$/i
//handler.private = true
handler.fail = null

export default handler