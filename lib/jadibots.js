import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, watch, rmSync, promises as fsPromises } from "fs";
const fs = { ...fsPromises, existsSync };
import path, { join } from 'path' 
import ws from 'ws';

let handler = async (m, { conn: _envio, command, usedPrefix, args, text, isOwner}) => {
const isCommand1 = /^(deletesesion|deletebot|deletesession|deletesesaion)$/i.test(command)  
const isCommand2 = /^(stop|pausarai|pausarbot)$/i.test(command)  
const isCommand3 = /^(bots|listjadibots|subbots)$/i.test(command)   

async function reportError(e) {
await m.reply(`✦ Ocurrió un error inesperado`)
console.log(e)
}

switch (true) {       
case isCommand1:
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let uniqid = `${who.split`@`[0]}`
const path = `./${jadi}/${uniqid}`

if (!await fs.existsSync(path)) {
await conn.sendMessage(m.chat, { text: `*No tiene una sesión activa, cree una utilizando:*\n${usedPrefix + command}\n\n*Si tiene una *(ID)* puede usar para saltarse el paso anterior usando:*\n*${usedPrefix + command}* \`\`\`(ID)\`\`\`` }, { quoted: m })
return
}
if (global.conn.user.jid !== conn.user.jid) return conn.sendMessage(m.chat, {text: `🌼 *Utilice este comando con el bot principal*.\n\n*https://api.whatsapp.com/send/?phone=${global.conn.user.jid.split`@`[0]}&text=${usedPrefix + command}&type=phone_number&app_absent=0*`}, { quoted: m }) 
else {
await conn.sendMessage(m.chat, { text: `*🌼 La sesión JadiBot fue eliminada*` }, { quoted: m })}
try {
fs.rmdir(`./${jadi}/` + uniqid, { recursive: true, force: true })
await conn.sendMessage(m.chat, { text : `*🌼 La sesión fue cerrada.*` } , { quoted: m })
} catch (e) {
reportError(e)
}  
break

case isCommand2:
if (global.conn.user.jid == conn.user.jid) conn.reply(m.chat, `🌼 Si no tiene una sesión de JadiBot envie mensaje al bot principal para convertise en SUB`, m)
else {
await conn.reply(m.chat, `🌼 ${botname} Desactivado/a.`, m)
conn.ws.close()}  
break

case isCommand3:
//if (global.db.data.settings[conn.user.jid].jadibotmd) return m.reply(`✦ Este comando se encuentra desactivado por el creador del bot.`)
const users = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])];
function convertirMsADiasHorasMinutosSegundos(ms) {
var segundos = Math.floor(ms / 1000);
var minutos = Math.floor(segundos / 60);
var horas = Math.floor(minutos / 60);
var días = Math.floor(horas / 24);
segundos %= 60;
minutos %= 60;
horas %= 24;
var resultado = "";
if (días !== 0) {
resultado += días + " días, ";
}
if (horas !== 0) {
resultado += horas + " horas, ";
}
if (minutos !== 0) {
resultado += minutos + " minutos, ";
}
if (segundos !== 0) {
resultado += segundos + " segundos";
}
return resultado;
}
const message = users.map((v, index) => `❀ ${index + 1} \n*✦ +${v.user.jid.replace(/[^0-9]/g, '')}*\n*🌼 Usuario:* ${v.user.name || 'JadiBot'}\n*🌼 Tiempo:* ${ v.uptime ? convertirMsADiasHorasMinutosSegundos(Date.now() - v.uptime) : 'Deconocido'}`).join('\n\n> ________________\n\n');
const replyMessage = message.length === 0 ? `*✦ No available JadiBots found*` : message;
const totalUsers = users.length;
const responseMessage = `🌼 *Lista de JadiBots*\n\n\`\`\`para convertirse en un JadiBot utiliza (.code) en un sub bot o bot general \`\`\`\n\n*Total de JadiBots conectados:* ${totalUsers || '0'}\n\n${replyMessage.trim()}`.trim();
await _envio.sendMessage(m.chat, {text: responseMessage, mentions: _envio.parseMention(responseMessage)}, {quoted: m})
break   
}}

handler.command = ['deletesesion', 'deletebot', 'deletesession', 'deletesession', 'stop', 'pausarbot', 'bots', 'listjadibots', 'subbots']
export default handler
