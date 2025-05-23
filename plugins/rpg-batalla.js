let handler = async (m, { conn, text, usedPrefix }) => {
    let users = global.db.data.users;
    let sender = m.sender;
    let opponent = m.mentionedJid[0];

    if (!opponent) return m.reply(`🚩 Menciona a un jugador para iniciar una batalla.\nEjemplo: *${usedPrefix}batalla @usuario*`);
    if (!(opponent in users)) return m.reply("🚩 El usuario mencionado no está registrado.");
    if (opponent === sender) return m.reply("🚩 No puedes luchar contra ti mismo.");

    let player = users[sender];
    let enemy = users[opponent];

    if (!player.mascota) return m.reply("🚩 No tienes una mascota. Usa *.mimascota* para adoptar una.");
    if (!enemy.mascota) return m.reply("🚩 Tu oponente no tiene una mascota.");

    if (player.vidaMascota <= 0) return m.reply("🚩 Tu mascota está muerta. Usa *.revivirmascota* para revivirla.");
    if (enemy.vidaMascota <= 0) return m.reply("🚩 La mascota de tu oponente está muerta.");

    // Batalla aleatoria
    let resultado = Math.random() < 0.5 ? "gana" : "pierde";
    let ganador, perdedor;

    if (resultado === "gana") {
        ganador = player;
        perdedor = enemy;
    } else {
        ganador = enemy;
        perdedor = player;
    }

    // Daño a las mascotas
    let dañoGanador = 10;
    let dañoPerdedor = 20;

    ganador.vidaMascota -= dañoGanador;
    perdedor.vidaMascota -= dañoPerdedor;

    // Transferencia de XP y dulces
    let xpRobado = Math.min(perdedor.exp, 5000);
    let dulcesRobados = Math.min(perdedor.limit, 5000);

    ganador.exp += xpRobado;
    ganador.limit += dulcesRobados;

    perdedor.exp -= xpRobado;
    perdedor.limit -= dulcesRobados;

    // Si la mascota muere
    if (perdedor.vidaMascota <= 0) {
        perdedor.vidaMascota = 0;
        m.reply(`💀 *¡Batalla terminada!*  
🏆 *Ganador:* @${ganador.jid.split('@')[0]}  
💔 *Perdedor:* @${perdedor.jid.split('@')[0]}  
⚰ *La mascota de @${perdedor.jid.split('@')[0]} ha muerto.* 😭  
🎁 *Recompensa para el ganador:* +${xpRobado} XP, +${dulcesRobados} 🍬 Dulces`, null, { mentions: [sender, opponent] });
    } else {
        m.reply(`⚔ *¡Batalla terminada!*  
🏆 *Ganador:* @${ganador.jid.split('@')[0]}  
💔 *Perdedor:* @${perdedor.jid.split('@')[0]}  
❤️ *Vida restante de ${ganador.mascota}:* ${ganador.vidaMascota}/100  
💔 *Vida restante de ${perdedor.mascota}:* ${perdedor.vidaMascota}/100  
🎁 *Recompensa para el ganador:* +${xpRobado} XP, +${dulcesRobados} 🍬 Dulces`, null, { mentions: [sender, opponent] });
    }
};

handler.help = ['batalla @usuario'];
handler.tags = ['rpg'];
handler.command = ['batalla'];

export default handler;