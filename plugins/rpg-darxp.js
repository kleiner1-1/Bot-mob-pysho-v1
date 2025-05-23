
import db from '../lib/database.js'

let handler = async (m, { conn, text }) => {
    let who;
    if (m.isGroup) who = m.mentionedJid[0];
    else who = m.chat;

    if (!who) throw '🚩 Menciona al usuario con *@user.*';

    let txt = text.replace('@' + who.split('@')[0], '').trim();
    if (!txt) throw '🚩 Ingrese la cantidad de *🌟 Experiencia* que quiere regalar.';
    
    if (isNaN(txt)) throw 'Sólo números.';
    
    let experienciaRegalada = parseInt(txt);
    
    let users = global.db.data.users;
    
    if (experienciaRegalada < 1) throw '🚩 Mínimo es *1 🌟 Experiencia*.';
    
    // Verificar si el usuario tiene suficiente experiencia para regalar
    if (users[m.sender].experience < experienciaRegalada) throw 'No tienes suficiente *🌟 Experiencia* para regalar.';
    
    // Restar experiencia del donante y sumar al receptor
    users[m.sender].experience -= experienciaRegalada;
    users[who].experience += experienciaRegalada;

    // Respuesta al usuario
    await m.reply(`🎉 Has regalado *${experienciaRegalada}* puntos de experiencia a ${who.split('@')[0]}!`);
    
    conn.fakeReply(m.chat, `*+${experienciaRegalada}* *🌟 Experiencia.*`, who, m.text);
}

handler.help = ['regalarxp *@user <cantidad>*'];
handler.tags = ['rpg'];
handler.command = ['regalarxp', 'donarexp'];

export default handler;