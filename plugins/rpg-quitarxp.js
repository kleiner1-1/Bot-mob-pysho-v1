
import db from '../lib/database.js'

let handler = async (m, { conn, text }) => {
    let who;
    if (m.isGroup) who = m.mentionedJid[0];
    else who = m.chat;

    if (!who) throw '🚩 Menciona al usuario con *@user.*';

    let txt = text.replace('@' + who.split('@')[0], '').trim();
    if (!txt) throw '🚩 Ingrese la cantidad de *🌟 Experiencia* que quiere quitar.';
    
    if (isNaN(txt)) throw 'Sólo números.';
    
    let experienciaQuitada = parseInt(txt);
    
    let users = global.db.data.users;

    // Verificar si el usuario tiene suficiente experiencia para quitar
    if (users[who].experience < experienciaQuitada) throw `${who.split('@')[0]} no tiene suficiente *🌟 Experiencia* para quitar.`;
    
    // Restar experiencia al usuario mencionado
    users[who].experience -= experienciaQuitada;

    // Respuesta al usuario
    await m.reply(`🔻 Has quitado *${experienciaQuitada}* puntos de experiencia a ${who.split('@')[0]}!`);
}

handler.help = ['quitarxp *@user <cantidad>*'];
handler.tags = ['rpg'];
handler.command = ['quitarxp', 'restarxp'];

export default handler;