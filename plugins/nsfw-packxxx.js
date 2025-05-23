
import fetch from 'node-fetch';

let handler = async(m, { conn, text, usedPrefix, command }) => {

m.react('🕑');

let txt = 'Disfruta 🔥🥵';

let img = 'https://delirius-apiofc.vercel.app/nsfw/boobs';

m.react('✅');
conn.sendMessage(m.chat, { image: { url: img }, caption: txt }, { quoted: fkontak });
}

handler.command = ['packxxx'];

export default handler;