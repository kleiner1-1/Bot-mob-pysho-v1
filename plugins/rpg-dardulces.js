const impuesto = 0.02;

let handler = async (m, { conn, text }) => {
    let who = m.mentionedJid && m.mentionedJid.length > 0 ? m.mentionedJid[0] : null;
    if (!who) throw '🚩 Menciona al usuario con *@user*.';

    let txt = text.replace('@' + who.split`@`[0], '').trim();
    if (!txt) throw '🚩 Ingresa la cantidad de *🍬 Dulces* que quieres transferir.';
    if (isNaN(txt)) throw '🚩 Solo se permiten números.';

    let poin = parseInt(txt);
    let imt = Math.ceil(poin * impuesto);
    let total = poin + imt;

    if (total < 1) throw '🚩 El mínimo para donar es *1 🍬 Dulce*.';

    let sender = m.sender;

    // Verificamos que ambos usuarios existen en la base de datos
    if (!(sender in global.db.data.users)) throw '🚩 No estás registrado en mi base de datos.';
    if (!(who in global.db.data.users)) throw '🚩 El usuario mencionado no está registrado en mi base de datos.';

    let senderData = global.db.data.users[sender];
    let receiverData = global.db.data.users[who];

    if (total > senderData.limit) throw '🚩 No tienes suficientes *🍬 Dulces* para donar.';

    senderData.limit -= total;
    receiverData.limit += poin;

    await m.reply(`✅ Has transferido *${poin}* 🍬 Dulces a @${who.split('@')[0]}.  
📌 *Impuesto (2%)*: *${imt}* 🍬 Dulces  
💰 *Total gastado*: *${total}* 🍬 Dulces`, null, { mentions: [who] });

    conn.fakeReply(m.chat, `🎁 *¡Recibiste ${poin} 🍬 Dulces!*`, who, m.text);
};

handler.help = ['dardulces *@user <cantidad>*'];
handler.tags = ['rpg'];
handler.command = ['dardulces', 'donardulces'];

export default handler;